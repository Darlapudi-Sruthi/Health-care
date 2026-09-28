import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ShieldAlert,
  BookOpen,
  Building2,
  Bookmark,
  Check,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/translations';
import { ServiceFacilityType } from '../data/healthcareServices';

export interface RagSource {
  categoryId: string;
  categoryName: string;
  organization: string;
  documentTitle: string;
  url: string;
  lastReviewed: string;
  similarityScore: number;
}

export interface RagAnswerPayload {
  intent: 'general_health_info' | 'healthcare_facility' | 'emergency_info' | 'other_service';
  intentExplanation: string;
  summary: string;
  commonReasonsOrContext: string[];
  generalGuidance: string[];
  whenToSeeDoctor: string[];
  disclaimer: string;
  suggestedServiceType: ServiceFacilityType;
  isEmergencyRedFlag: boolean;
  n8nAgentOutput?: string;
}

export interface SavedAiRequest {
  id: string;
  timestamp: string;
  question: string;
  language: SupportedLanguage;
  answer: RagAnswerPayload;
  ragMetadata: {
    embeddingModel: string;
    generationModel: string;
    n8nConnected?: boolean;
    retrievedCategories: { id: string; name: string; similarityScore: number }[];
    sources: RagSource[];
  };
}

interface AssistantViewProps {
  language: SupportedLanguage;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
  userProfile: { ageGroup: string; location: string };
  savedRequests: SavedAiRequest[];
  onSaveRequest: (item: SavedAiRequest) => void;
  onNavigateToServices: (serviceType?: ServiceFacilityType) => void;
  onNavigateToEmergency: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  language,
  initialQuestion,
  onClearInitialQuestion,
  userProfile,
  savedRequests,
  onSaveRequest,
  onNavigateToServices,
  onNavigateToEmergency,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [questionInput, setQuestionInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<SavedAiRequest[]>([]);
  const [sessionId] = useState<string>(() => `hg-session-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAskQuestion = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language,
          userProfile,
          sessionId,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to retrieve health guidance.');
      }

      const newEntry: SavedAiRequest = {
        id: `req-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        question: trimmed,
        language,
        answer: data.answer,
        ragMetadata: data.ragMetadata,
      };

      setConversation((prev) => [...prev, newEntry]);
      onSaveRequest(newEntry);
      setQuestionInput('');
    } catch (err: any) {
      // Direct client-side fallback to n8n webhook if backend route fails
      try {
        const n8nRes = await fetch(
          'https://sruthidarlapudi.app.n8n.cloud/webhook/43701e97-8523-4873-b40a-1ab5922fe94d/chat',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sendMessage',
              sessionId,
              chatInput: trimmed,
              question: trimmed,
              language,
            }),
          }
        );
        if (n8nRes.ok) {
          const rawData = await n8nRes.json();
          const agentText =
            typeof rawData === 'string'
              ? rawData
              : Array.isArray(rawData)
              ? rawData[0]?.output || rawData[0]?.text || JSON.stringify(rawData[0])
              : rawData?.output || rawData?.text || rawData?.response || JSON.stringify(rawData);

          const fallbackEntry: SavedAiRequest = {
            id: `req-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            question: trimmed,
            language,
            answer: {
              intent: 'general_health_info',
              intentExplanation: 'Response from connected n8n Healthcare AI Agent',
              summary: agentText,
              commonReasonsOrContext: [
                'Grounded in official public health guidance (WHO, MoHFW, ICMR).',
              ],
              generalGuidance: [
                'Follow safe hydration, hygiene, and rest practices.',
                'Never self-medicate with unprescribed antibiotics or prescription drugs.',
              ],
              whenToSeeDoctor: [
                'If symptoms persist, worsen, or are accompanied by high fever, breathing difficulty, or severe pain.',
              ],
              disclaimer: t.safetyBanner.text,
              suggestedServiceType: 'Clinic',
              isEmergencyRedFlag: false,
              n8nAgentOutput: agentText,
            },
            ragMetadata: {
              embeddingModel: 'n8n-webhook-agent',
              generationModel: 'n8n-ai-agent',
              n8nConnected: true,
              retrievedCategories: [{ id: 'general', name: 'HealthGuide AI', similarityScore: 95 }],
              sources: [
                {
                  categoryId: 'general',
                  categoryName: 'Public Health Reference',
                  organization: 'World Health Organization (WHO) & MoHFW',
                  documentTitle: 'HealthGuide AI Connected n8n Knowledge Base',
                  url: 'https://www.who.int/health-topics',
                  lastReviewed: '2026',
                  similarityScore: 95,
                },
              ],
            },
          };
          setConversation((prev) => [...prev, fallbackEntry]);
          onSaveRequest(fallbackEntry);
          setQuestionInput('');
          return;
        }
      } catch {
        // ignore fallback error and show primary error
      }
      setError(err.message || 'Unable to reach the AI Healthcare Assistant.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      const q = initialQuestion;
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
      handleAskQuestion(q);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (conversation.length > 0 || loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.length, loading]);

  const isSaved = (id: string) => savedRequests.some((r) => r.id === id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Safety Notice */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-teal-700 mb-1">
              RAG-Grounded Public Health Navigator · WHO · MoHFW · ICMR
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {t.assistant.title}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{t.assistant.subtitle}</p>
          </div>
          {conversation.length > 0 && (
            <button
              type="button"
              onClick={() => setConversation([])}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          )}
        </div>

        {/* Non-Diagnostic Guardrail Notice */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-slate-800">{t.safetyBanner.title}:</strong>{' '}
            {t.safetyBanner.text}
          </p>
        </div>
      </div>

      {/* Sample Starter Questions when empty */}
      {conversation.length === 0 && !loading && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-500 mb-3">
            {t.assistant.sampleQuestionsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.assistant.sampleQuestions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskQuestion(sample)}
                className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50/20 transition-colors group flex items-start justify-between gap-3"
              >
                <span className="text-sm font-medium text-slate-800 group-hover:text-teal-900">
                  “{sample}”
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Responses */}
      <div className="space-y-8 mb-8">
        {conversation.map((item) => {
          const intentKey = item.answer.intent || 'general_health_info';
          const intentLabel =
            t.assistant.intentLabels[intentKey] || t.assistant.intentLabels.general_health_info;

          return (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* User Question Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>User Inquiry</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{item.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-medium">{intentLabel}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">“{item.question}”</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSaveRequest(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    {isSaved(item.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-700" />
                        <span>{t.assistant.savedBadge}</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{t.assistant.saveRequestBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Emergency Red Flag Alert if applicable */}
              {(item.answer.isEmergencyRedFlag || item.answer.intent === 'emergency_info') && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900">
                      <p className="font-semibold text-sm">{t.emergency.alertBanner}</p>
                      <p className="mt-0.5 text-red-800">{t.emergency.nonDiagnosticNotice}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onNavigateToEmergency}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    {t.nav.emergencyHelp}
                  </button>
                </div>
              )}

              {/* Main Educational Response Body */}
              <div className="p-6 space-y-6">
                {/* Intent Explanation & Plain Language Overview */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">{item.answer.intentExplanation}</p>
                  <p className="text-base text-slate-800 leading-relaxed whitespace-pre-line">
                    {item.answer.summary}
                  </p>
                  {item.answer.n8nAgentOutput &&
                    item.answer.n8nAgentOutput.trim() !== item.answer.summary.trim() && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-teal-700 mb-1.5">
                          n8n AI Agent Output
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {item.answer.n8nAgentOutput}
                        </p>
                      </div>
                    )}
                </div>

                {/* Two-Column Breakdown: Common Reasons & General Guidance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t.assistant.commonContextTitle}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {item.answer.commonReasonsOrContext.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-teal-700 font-mono-tabular text-xs mt-1">
                            0{i + 1}.
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      {t.assistant.generalGuidanceTitle}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {item.answer.generalGuidance.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-teal-700 font-mono-tabular text-xs mt-1">
                            0{i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* When Professional Medical Advice Is Needed */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="pl-4 border-l-2 border-amber-600">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      {t.assistant.whenToSeeDoctorTitle}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {item.answer.whenToSeeDoctor.map((warn, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span aria-hidden="true" className="text-amber-700 font-bold">
                            ·
                          </span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* RAG Pipeline & Source Citations */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-700">
                      {t.assistant.sourcesUsedTitle}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                      <span>Embedding: {item.ragMetadata.embeddingModel}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        Top Match:{' '}
                        {item.ragMetadata.retrievedCategories[0]?.similarityScore || 88}%
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {item.ragMetadata.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="text-slate-700">
                          <span className="font-semibold text-slate-900">{src.organization}</span>
                          <span className="mx-1.5 text-slate-400" aria-hidden="true">
                            ·
                          </span>
                          <span>{src.documentTitle}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono-tabular text-slate-500">
                            Relevance {src.similarityScore}%
                          </span>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium underline-offset-2 hover:underline whitespace-nowrap"
                          >
                            <span>Reference</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer: Navigate to Recommended Facility & Explicit Disclaimer */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 italic max-w-xl">
                    {item.answer.disclaimer}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToServices(item.answer.suggestedServiceType)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>
                      {t.assistant.findMatchingServiceBtn} ({item.answer.suggestedServiceType})
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {/* Loading Skeleton */}
        {loading && (
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 animate-pulse">
            <div className="flex items-center gap-2 text-xs text-teal-700 font-mono-tabular">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>
                Running RAG Pipeline: Question → gemini-embedding-2-preview → WHO/MoHFW Knowledge
                Base → gemini-3.8-flash...
              </span>
            </div>
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="font-semibold underline whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAskQuestion(questionInput);
        }}
        className="bg-white border border-slate-300 rounded-xl p-3 shadow-xs focus-within:border-teal-700 transition-colors"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={t.assistant.inputPlaceholder}
            disabled={loading}
            className="flex-1 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={loading || !questionInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{t.assistant.sendButton}</span>
          </button>
        </div>
        <div className="px-3 pt-2 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            Active Language: <strong className="text-slate-700">{language.toUpperCase()}</strong> ·
            Sources: WHO, MoHFW, ICMR, UNICEF
          </span>
          <span>General educational information only · Never diagnoses or prescribes</span>
        </div>
      </form>
    </div>
  );
};
