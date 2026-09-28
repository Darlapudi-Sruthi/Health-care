import React, { useState } from 'react';
import {
  MessageSquare,
  Building2,
  BookOpen,
  Trash2,
  ArrowRight,
  Phone,
  MapPin,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/translations';
import { SavedAiRequest } from './AssistantView';
import { HealthcareFacility } from '../data/healthcareServices';
import { HEALTH_KNOWLEDGE_BASE, HealthCategoryId } from '../data/knowledgeBase';

interface MyRequestsViewProps {
  language: SupportedLanguage;
  savedQuestions: SavedAiRequest[];
  savedFacilities: HealthcareFacility[];
  savedGuideIds: HealthCategoryId[];
  onClearQuestions: () => void;
  onRemoveFacility: (facility: HealthcareFacility) => void;
  onRemoveGuide: (id: HealthCategoryId) => void;
  onOpenQuestionInAssistant: (question: string) => void;
  onOpenCategoryInHealthInfo: (id: HealthCategoryId) => void;
  onNavigateToServices: () => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  language,
  savedQuestions,
  savedFacilities,
  savedGuideIds,
  onClearQuestions,
  onRemoveFacility,
  onRemoveGuide,
  onOpenQuestionInAssistant,
  onOpenCategoryInHealthInfo,
  onNavigateToServices,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'questions' | 'facilities' | 'guides'>('questions');

  const savedGuides = HEALTH_KNOWLEDGE_BASE.filter((entry) =>
    savedGuideIds.includes(entry.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-700 mb-1">
            Local Privacy-First History · Stored Only on Your Device
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {t.myRequests.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t.myRequests.subtitle}</p>
        </div>

        {/* Interactive Segmented Tab Selector */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.myRequests.tabQuestions} ({savedQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('facilities')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'facilities'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.myRequests.tabFacilities} ({savedFacilities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'guides'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.myRequests.tabGuides} ({savedGuides.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Saved AI Questions */}
      {activeTab === 'questions' && (
        <div>
          {savedQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <MessageSquare className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-4">{t.myRequests.emptyQuestions}</p>
              <button
                type="button"
                onClick={() => onOpenQuestionInAssistant('I have a fever. What should I know?')}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                Ask Sample Question in AI Assistant
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClearQuestions}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.myRequests.clearHistoryBtn}</span>
                </button>
              </div>

              {savedQuestions.map((req) => (
                <article
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      <span className="font-mono-tabular">{req.timestamp}</span>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-teal-700 font-medium">
                        {t.assistant.intentLabels[req.answer.intent] ||
                          t.assistant.intentLabels.general_health_info}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenQuestionInAssistant(req.question)}
                      className="inline-flex items-center gap-1 text-teal-700 hover:underline font-medium"
                    >
                      <span>Ask Again</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <h2 className="text-base font-semibold text-slate-900">“{req.question}”</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">{req.answer.summary}</p>

                  {req.ragMetadata.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span>Sources: </span>
                      {req.ragMetadata.sources
                        .slice(0, 2)
                        .map((s) => s.organization)
                        .join(' · ')}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Healthcare Facilities */}
      {activeTab === 'facilities' && (
        <div>
          {savedFacilities.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <Building2 className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-4">{t.myRequests.emptyFacilities}</p>
              <button
                type="button"
                onClick={onNavigateToServices}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                {t.homeButtons.findServices}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedFacilities.map((fac) => (
                <article
                  key={fac.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-teal-800">{fac.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{fac.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span>{fac.city}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{fac.name}</h3>
                    <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{fac.address}</span>
                    </p>
                    <p className="text-xs text-slate-800 font-mono-tabular flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.phone}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${fac.name} ${fac.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      {t.services.openMapBtn} →
                    </a>
                    <button
                      type="button"
                      onClick={() => onRemoveFacility(fac)}
                      className="text-xs text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Health Information Guides */}
      {activeTab === 'guides' && (
        <div>
          {savedGuides.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-4">{t.myRequests.emptyGuides}</p>
              <button
                type="button"
                onClick={() => onOpenCategoryInHealthInfo('fever')}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                {t.homeButtons.healthInfo}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedGuides.map((entry) => {
                const loc = entry.content[language] || entry.content.en;
                return (
                  <article
                    key={entry.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-teal-800 mb-1">
                        {loc.categoryName}
                      </p>
                      <h3 className="text-base font-semibold text-slate-900 mb-2">
                        {loc.headline}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3">{loc.summary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onOpenCategoryInHealthInfo(entry.id)}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        Read Full Guide →
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveGuide(entry.id)}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
