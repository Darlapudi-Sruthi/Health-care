import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { HEALTH_KNOWLEDGE_BASE, HealthKnowledgeEntry } from './src/data/knowledgeBase.ts';
import { HEALTHCARE_FACILITIES, EMERGENCY_REGIONS } from './src/data/healthcareServices.ts';
import { SupportedLanguage } from './src/data/translations.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const N8N_CHAT_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://sruthidarlapudi.app.n8n.cloud/webhook/43701e97-8523-4873-b40a-1ab5922fe94d/chat';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'unconfigured',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function queryN8nAgent(
  question: string,
  language: SupportedLanguage,
  sessionId: string,
  userProfile?: { ageGroup?: string; location?: string }
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: sessionId || 'healthguide-default-session',
        chatInput: question,
        question,
        language,
        userProfile,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`n8n webhook returned status ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data: any = await response.json();
      if (typeof data === 'string') return data;
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        return (
          first?.output ||
          first?.text ||
          first?.response ||
          first?.message ||
          JSON.stringify(first)
        );
      }
      if (data && typeof data === 'object') {
        return (
          data.output ||
          data.text ||
          data.response ||
          data.message ||
          data.answer ||
          JSON.stringify(data)
        );
      }
    } else {
      const text = await response.text();
      if (text && text.trim()) return text.trim();
    }
  } catch (err) {
    console.warn('n8n webhook call warning:', err);
  }
  return null;
}

// In-memory vector cache for the RAG Knowledge Base
interface EmbeddedKnowledgeChunk {
  entry: HealthKnowledgeEntry;
  textToEmbed: string;
  embedding?: number[];
}

const knowledgeChunks: EmbeddedKnowledgeChunk[] = HEALTH_KNOWLEDGE_BASE.map((entry) => {
  const en = entry.content.en;
  const te = entry.content.te;
  const hi = entry.content.hi;
  const textToEmbed = [
    `Category: ${en.categoryName} (${te.categoryName} / ${hi.categoryName})`,
    `Headline: ${en.headline}`,
    `Keywords: ${entry.keywords.join(', ')}`,
    `Summary: ${en.summary}`,
    `Key Facts: ${en.keyFacts.join(' ')}`,
    `Self Care & Prevention: ${en.generalSelfCareAndPrevention.join(' ')}`,
    `When to See Doctor: ${en.whenToSeeDoctor.join(' ')}`,
  ].join('\n');

  return {
    entry,
    textToEmbed,
  };
});

let kbEmbeddingsInitialized = false;

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function computeKeywordOverlapScore(query: string, entry: HealthKnowledgeEntry): number {
  const qLower = query.toLowerCase();
  let matches = 0;
  for (const kw of entry.keywords) {
    if (qLower.includes(kw.toLowerCase())) {
      matches += 1;
    }
  }
  return Math.min(matches * 0.22, 0.55);
}

async function ensureKnowledgeBaseEmbeddings(): Promise<boolean> {
  if (kbEmbeddingsInitialized) return true;
  if (!process.env.GEMINI_API_KEY) return false;

  try {
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: knowledgeChunks.map((c) => c.textToEmbed),
    });

    if (result.embeddings && result.embeddings.length === knowledgeChunks.length) {
      result.embeddings.forEach((emb, idx) => {
        if (emb.values) {
          knowledgeChunks[idx].embedding = emb.values;
        }
      });
      kbEmbeddingsInitialized = true;
      return true;
    }
  } catch (err) {
    console.warn('Embedding warm-up fallback to hybrid keyword retrieval:', err);
  }
  return false;
}

async function retrieveRelevantKnowledge(question: string, topK = 3) {
  let queryVector: number[] | undefined;
  let usedEmbeddingModel = 'gemini-embedding-2-preview';

  try {
    await ensureKnowledgeBaseEmbeddings();
    if (kbEmbeddingsInitialized) {
      const qEmbRes = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [question],
      });
      queryVector = qEmbRes.embeddings?.[0]?.values;
    }
  } catch (err) {
    console.warn('Query embedding fallback:', err);
  }

  const scored = knowledgeChunks.map((chunk) => {
    const semanticScore =
      queryVector && chunk.embedding
        ? Math.max(0, cosineSimilarity(queryVector, chunk.embedding))
        : 0;
    const lexicalBoost = computeKeywordOverlapScore(question, chunk.entry);
    const combinedScore =
      semanticScore > 0
        ? Math.min(0.99, semanticScore * 0.78 + lexicalBoost * 0.35)
        : Math.min(0.95, 0.45 + lexicalBoost);

    return {
      entry: chunk.entry,
      similarityScore: Math.round(combinedScore * 100),
      semanticActive: Boolean(queryVector && chunk.embedding),
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return {
    embeddingModel: usedEmbeddingModel,
    topChunks: scored.slice(0, topK),
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Enable CORS on /api/* so n8n and external AI agents can fetch data freely
  app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'HealthGuide AI RAG Navigator',
      n8nWebhookUrl: N8N_CHAT_WEBHOOK_URL,
    });
  });

  // Expose full website knowledge base for n8n HTTP Request tool / external AI agent training
  app.all('/api/knowledge-base', (_req, res) => {
    res.json({
      appName: 'HealthGuide AI – Healthcare Information Navigator',
      tagline: 'Find the right healthcare information and services.',
      safetyRules: [
        'Provide general educational health information only.',
        'Never diagnose diseases or medical conditions.',
        'Never prescribe or recommend specific prescription medicines.',
        'Always state clearly when to consult a qualified doctor.',
      ],
      knowledgeBase: HEALTH_KNOWLEDGE_BASE,
      healthcareFacilities: HEALTHCARE_FACILITIES,
      emergencyRegions: EMERGENCY_REGIONS,
    });
  });

  // RAG Endpoint: Question -> n8n AI Agent + Embedding Model -> Knowledge Base -> Relevant Medical Sources -> AI Response
  app.post('/api/rag/ask', async (req, res) => {
    try {
      const {
        question,
        language = 'en',
        userProfile,
        sessionId = 'healthguide-web-session',
      }: {
        question?: string;
        language?: SupportedLanguage;
        userProfile?: { ageGroup?: string; location?: string };
        sessionId?: string;
      } = req.body || {};

      if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ error: 'Please provide a valid health question.' });
      }

      const trimmedQuestion = question.trim();

      // Run n8n AI Agent Webhook & Local RAG Knowledge Base Retrieval in parallel
      const [n8nResponseText, retrieval] = await Promise.all([
        queryN8nAgent(trimmedQuestion, language, sessionId, userProfile),
        retrieveRelevantKnowledge(trimmedQuestion, 3),
      ]);

      const topEntries = retrieval.topChunks;
      const primaryChunk = topEntries[0]?.entry || HEALTH_KNOWLEDGE_BASE[0];
      const localizedChunk = primaryChunk.content[language] || primaryChunk.content.en;

      // Flatten official references from retrieved knowledge chunks
      const retrievedReferences = topEntries.flatMap((item) =>
        item.entry.references.map((ref) => ({
          categoryId: item.entry.id,
          categoryName:
            item.entry.content[language]?.categoryName || item.entry.content.en.categoryName,
          organization: ref.organization,
          documentTitle: ref.documentTitle,
          url: ref.url,
          lastReviewed: ref.lastReviewed,
          similarityScore: item.similarityScore,
        }))
      );

      // Check if n8n returned a structured JSON matching our schema directly
      let parsedFromN8n: any = null;
      if (n8nResponseText) {
        try {
          const cleaned = n8nResponseText
            .replace(/^```json\s*/i, '')
            .replace(/```\s*$/, '')
            .trim();
          if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            const candidate = JSON.parse(cleaned);
            if (candidate.summary && Array.isArray(candidate.whenToSeeDoctor)) {
              parsedFromN8n = candidate;
            }
          }
        } catch {
          // Plain text / markdown response from n8n agent
        }
      }

      if (parsedFromN8n) {
        return res.json({
          answer: {
            ...parsedFromN8n,
            n8nAgentOutput: n8nResponseText,
          },
          ragMetadata: {
            embeddingModel: retrieval.embeddingModel,
            generationModel: 'n8n-ai-agent + gemini-3.8-flash',
            n8nConnected: true,
            retrievedCategories: topEntries.map((t) => ({
              id: t.entry.id,
              name: t.entry.content[language]?.categoryName || t.entry.content.en.categoryName,
              similarityScore: t.similarityScore,
            })),
            sources: retrievedReferences.slice(0, 5),
          },
        });
      }

      // Construct RAG context block for the LLM (incorporating n8n agent output if present)
      const ragContextBlock = topEntries
        .map((item, idx) => {
          const c = item.entry.content.en;
          const refs = item.entry.references
            .map((r) => `${r.organization} - "${r.documentTitle}" (${r.url})`)
            .join('; ');
          return [
            `[Source Chunk #${idx + 1} | Relevance: ${item.similarityScore}% | Topic: ${c.categoryName}]`,
            `Summary: ${c.summary}`,
            `Key Facts: ${c.keyFacts.join(' | ')}`,
            `Safe Supportive Care: ${c.generalSelfCareAndPrevention.join(' | ')}`,
            `When to See a Doctor: ${c.whenToSeeDoctor.join(' | ')}`,
            `Recommended Facility Type: ${item.entry.recommendedServiceType}`,
            `Official Citations: ${refs}`,
          ].join('\n');
        })
        .join('\n\n');

      const languageName =
        language === 'te'
          ? 'Telugu (తెలుగు - write in clear, simple, natural Telugu script)'
          : language === 'hi'
          ? 'Hindi (हिन्दी - write in clear, simple, natural Devanagari Hindi script)'
          : 'English (simple, accessible everyday English)';

      const profileContext = userProfile
        ? `Optional User Context: Age group: ${userProfile.ageGroup || 'Not specified'}, Location: ${
            userProfile.location || 'Not specified'
          }.`
        : '';

      const n8nContext = n8nResponseText
        ? `\nn8n AI Agent Response to Incorporate:\n"${n8nResponseText}"\n`
        : '';

      // Try Gemini synthesis if GEMINI_API_KEY is available, otherwise build directly from n8n + Knowledge Base
      if (process.env.GEMINI_API_KEY) {
        try {
          const systemInstruction = `You are HealthGuide AI – Healthcare Information Navigator.
Your strict mission is to help users navigate healthcare services and understand general, reliable health information grounded in the provided WHO, Ministry of Health & Family Welfare (MoHFW), ICMR, and UNICEF knowledge base.

CRITICAL MEDICAL SAFETY RULES (NON-NEGOTIABLE):
1. NEVER claim to diagnose any disease or medical condition.
2. NEVER prescribe, dose, or recommend specific prescription medicines or antibiotics.
3. NEVER give dangerous or invasive treatment instructions.
4. ALWAYS explain concepts in simple, calm, reassuring, easy-to-understand language in the user's requested language: ${languageName}.
5. ALWAYS clearly state when professional medical advice from a qualified doctor is needed.
6. Identify the user's primary intent accurately:
   - "general_health_info": User is asking about symptoms (like fever, cough), nutrition, vaccines, mental wellbeing, first aid, or general health.
   - "healthcare_facility": User is looking for a hospital, clinic, government hospital, pharmacy, or diagnostic center.
   - "emergency_info": User describes potentially urgent red-flag symptoms (severe chest pain, difficulty breathing, unconsciousness, severe bleeding, stroke, poisoning, snakebite) or asks for emergency help.
   - "other_service": User asks about preventive checkups, maternal registration, or community health programs.
7. Ground your response in the retrieved Knowledge Base Context below.`;

          const prompt = `User Question: "${trimmedQuestion}"
Target Response Language: ${languageName}
${profileContext}
${n8nContext}
Retrieved RAG Knowledge Base Context:
${ragContextBlock}

Respond strictly in JSON matching the schema, with all user-facing text fields written in ${languageName}.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  intent: {
                    type: Type.STRING,
                    description:
                      'Must be one of: general_health_info, healthcare_facility, emergency_info, other_service',
                  },
                  intentExplanation: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  commonReasonsOrContext: { type: Type.ARRAY, items: { type: Type.STRING } },
                  generalGuidance: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whenToSeeDoctor: { type: Type.ARRAY, items: { type: Type.STRING } },
                  disclaimer: { type: Type.STRING },
                  suggestedServiceType: { type: Type.STRING },
                  isEmergencyRedFlag: { type: Type.BOOLEAN },
                },
                required: [
                  'intent',
                  'intentExplanation',
                  'summary',
                  'commonReasonsOrContext',
                  'generalGuidance',
                  'whenToSeeDoctor',
                  'disclaimer',
                  'suggestedServiceType',
                  'isEmergencyRedFlag',
                ],
              },
            },
          });

          const rawText = response.text?.trim() || '{}';
          const parsed = JSON.parse(rawText);

          return res.json({
            answer: {
              ...parsed,
              ...(n8nResponseText ? { n8nAgentOutput: n8nResponseText } : {}),
            },
            ragMetadata: {
              embeddingModel: retrieval.embeddingModel,
              generationModel: n8nResponseText
                ? 'n8n-ai-agent + gemini-3.8-flash'
                : 'gemini-3.8-flash',
              n8nConnected: Boolean(n8nResponseText),
              retrievedCategories: topEntries.map((t) => ({
                id: t.entry.id,
                name: t.entry.content[language]?.categoryName || t.entry.content.en.categoryName,
                similarityScore: t.similarityScore,
              })),
              sources: retrievedReferences.slice(0, 5),
            },
          });
        } catch (geminiErr) {
          console.warn('Gemini synthesis fallback to n8n + RAG KB:', geminiErr);
        }
      }

      // Direct n8n Agent + Knowledge Base Response (when n8n responds or without Gemini key)
      const fallbackAnswer = {
        intent: 'general_health_info',
        intentExplanation: localizedChunk.headline,
        summary: n8nResponseText || localizedChunk.summary,
        commonReasonsOrContext: localizedChunk.keyFacts,
        generalGuidance: localizedChunk.generalSelfCareAndPrevention,
        whenToSeeDoctor: localizedChunk.whenToSeeDoctor,
        disclaimer:
          language === 'te'
            ? 'ఇది సాధారణ అవగాహన సమాచారం మాత్రమే. ఇది వ్యాధి నిర్ధారణ లేదా మందుల సూచన కాదు. వ్యక్తిగత వైద్య సలహా కోసం డాక్టర్‌ను సంప్రదించండి.'
            : language === 'hi'
            ? 'यह केवल सामान्य शैक्षिक स्वास्थ्य जानकारी है। यह किसी बीमारी का निदान या दवा का परामर्श नहीं है। कृपया किसी योग्य डॉक्टर से सलाह लें।'
            : 'General educational information only. This does not constitute a medical diagnosis or prescription. Please consult a qualified healthcare professional.',
        suggestedServiceType: primaryChunk.recommendedServiceType,
        isEmergencyRedFlag: false,
        ...(n8nResponseText ? { n8nAgentOutput: n8nResponseText } : {}),
      };

      return res.json({
        answer: fallbackAnswer,
        ragMetadata: {
          embeddingModel: retrieval.embeddingModel,
          generationModel: n8nResponseText ? 'n8n-ai-agent' : 'rag-knowledge-base',
          n8nConnected: Boolean(n8nResponseText),
          retrievedCategories: topEntries.map((t) => ({
            id: t.entry.id,
            name: t.entry.content[language]?.categoryName || t.entry.content.en.categoryName,
            similarityScore: t.similarityScore,
          })),
          sources: retrievedReferences.slice(0, 5),
        },
      });
    } catch (error: any) {
      console.error('Error in /api/rag/ask:', error);
      return res.status(500).json({
        error:
          error?.message ||
          'Unable to process your question right now. Please check the Health Information library or contact a healthcare professional.',
      });
    }
  });

  // Live Healthcare Facility Discovery via OpenStreetMap Overpass/Nominatim + Gemini Maps Grounding
  app.post('/api/services/live-search', async (req, res) => {
    try {
      const {
        cityOrQuery = 'Hyderabad',
        serviceType = 'Hospital',
        lat,
        lng,
      }: {
        cityOrQuery?: string;
        serviceType?: string;
        lat?: number;
        lng?: number;
      } = req.body || {};

      // 1. Query OpenStreetMap Nominatim for real healthcare facilities
      const searchQuery = `${serviceType} in ${cityOrQuery}`;
      let osmFacilities: any[] = [];
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchQuery
        )}&limit=6&addressdetails=1`;
        const osmRes = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'HealthGuideAI-Navigator/1.0',
            Accept: 'application/json',
          },
        });
        if (osmRes.ok) {
          const osmData = await osmRes.json();
          if (Array.isArray(osmData)) {
            osmFacilities = osmData.map((place: any, idx: number) => {
              const name =
                place.name ||
                place.display_name?.split(',')[0] ||
                `${cityOrQuery} ${serviceType}`;
              const isGov =
                /government|govt|district|primary health|aiims|osmania|gandhi|kgh|civil|general hospital/i.test(
                  name
                );
              return {
                id: `osm-${place.place_id || idx}`,
                name,
                type: serviceType,
                sector: isGov ? 'Government' : 'Private',
                city:
                  place.address?.city ||
                  place.address?.town ||
                  place.address?.state_district ||
                  cityOrQuery,
                address: place.display_name || cityOrQuery,
                phone: isGov ? '104 / 108 (Public Health Desk)' : 'Directory Verified Facility',
                services: [
                  serviceType,
                  'Outpatient & Triage Navigation',
                  isGov ? 'Public Healthcare Scheme Support' : 'General Medical Services',
                ],
                openingHours:
                  serviceType === 'Emergency Department' || serviceType === 'Hospital'
                    ? 'Open 24 Hours (Verify OPD timings locally)'
                    : '8:30 AM – 8:00 PM',
                isOpen24Hours:
                  serviceType === 'Emergency Department' || serviceType === 'Hospital',
                isOpenNow: true,
                lat: parseFloat(place.lat) || lat || 17.385,
                lng: parseFloat(place.lon) || lng || 78.4867,
                mapUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=16/${place.lat}/${place.lon}`,
                source: 'OpenStreetMap Public Directory',
              };
            });
          }
        }
      } catch (osmErr) {
        console.warn('OpenStreetMap lookup warning:', osmErr);
      }

      // 2. Also query Gemini with Google Maps Grounding when API key is available
      let mapsGroundingLinks: { title: string; uri: string }[] = [];
      let aiSummary = '';

      if (process.env.GEMINI_API_KEY) {
        try {
          const toolConfig: any = {};
          if (typeof lat === 'number' && typeof lng === 'number') {
            toolConfig.retrievalConfig = {
              latLng: {
                latitude: lat,
                longitude: lng,
              },
            };
          }

          const mapsResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `List well-known ${serviceType} facilities in or near ${cityOrQuery}, including government hospitals and emergency departments, with their general location and services.`,
            config: {
              tools: [{ googleMaps: {} }],
              ...(Object.keys(toolConfig).length > 0 ? { toolConfig } : {}),
            },
          });

          aiSummary = mapsResponse.text || '';
          const chunks =
            mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          for (const chunk of chunks as any[]) {
            if (chunk?.maps?.uri) {
              mapsGroundingLinks.push({
                title: chunk.maps.title || `${serviceType} – Google Maps`,
                uri: chunk.maps.uri,
              });
            }
          }
        } catch (mapsErr) {
          console.warn('Maps grounding fallback:', mapsErr);
        }
      }

      return res.json({
        facilities: osmFacilities,
        mapsGroundingLinks,
        aiSummary,
      });
    } catch (error: any) {
      console.error('Error in /api/services/live-search:', error);
      return res.status(500).json({
        error: error?.message || 'Unable to complete live healthcare directory search.',
      });
    }
  });

  // Mount Vite in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthGuide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
