import { GoogleGenAI, Type } from '@google/genai';
import { HEALTH_KNOWLEDGE_BASE, HealthKnowledgeEntry } from '../../src/data/knowledgeBase';
import { SupportedLanguage } from '../../src/data/translations';

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

    if (!response.ok) return null;

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
    console.warn('Embedding warm-up fallback:', err);
  }
  return false;
}

async function retrieveRelevantKnowledge(question: string, topK = 3) {
  let queryVector: number[] | undefined;

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
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return {
    embeddingModel: 'gemini-embedding-2-preview',
    topChunks: scored.slice(0, topK),
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const [n8nResponseText, retrieval] = await Promise.all([
      queryN8nAgent(trimmedQuestion, language, sessionId, userProfile),
      retrieveRelevantKnowledge(trimmedQuestion, 3),
    ]);

    const topEntries = retrieval.topChunks;
    const primaryChunk = topEntries[0]?.entry || HEALTH_KNOWLEDGE_BASE[0];
    const localizedChunk = primaryChunk.content[language] || primaryChunk.content.en;

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
        // Plain text from n8n
      }
    }

    if (parsedFromN8n) {
      return res.status(200).json({
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

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are HealthGuide AI – Healthcare Information Navigator.
Your strict mission is to help users navigate healthcare services and understand general, reliable health information grounded in the provided WHO, Ministry of Health & Family Welfare (MoHFW), ICMR, and UNICEF knowledge base.

CRITICAL MEDICAL SAFETY RULES (NON-NEGOTIABLE):
1. NEVER claim to diagnose any disease or medical condition.
2. NEVER prescribe, dose, or recommend specific prescription medicines or antibiotics.
3. NEVER give dangerous or invasive treatment instructions.
4. ALWAYS explain concepts in simple, calm, reassuring, easy-to-understand language in the user's requested language: ${languageName}.
5. ALWAYS clearly state when professional medical advice from a qualified doctor is needed.`;

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
                intent: { type: Type.STRING },
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

        return res.status(200).json({
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
        console.warn('Gemini synthesis fallback:', geminiErr);
      }
    }

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

    return res.status(200).json({
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
        'Unable to process your question right now. Please check the Health Information library.',
    });
  }
}
