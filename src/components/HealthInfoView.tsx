import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ExternalLink,
  Bookmark,
  Check,
  MessageSquare,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/translations';
import {
  HEALTH_KNOWLEDGE_BASE,
  HealthCategoryId,
  HealthKnowledgeEntry,
} from '../data/knowledgeBase';
import { ServiceFacilityType } from '../data/healthcareServices';

interface HealthInfoViewProps {
  language: SupportedLanguage;
  initialCategoryId?: HealthCategoryId;
  savedGuideIds: HealthCategoryId[];
  onToggleSaveGuide: (id: HealthCategoryId) => void;
  onAskAiAboutTopic: (question: string) => void;
  onNavigateToServices: (type: ServiceFacilityType) => void;
}

export const HealthInfoView: React.FC<HealthInfoViewProps> = ({
  language,
  initialCategoryId = 'fever',
  savedGuideIds,
  onToggleSaveGuide,
  onAskAiAboutTopic,
  onNavigateToServices,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [selectedId, setSelectedId] = useState<HealthCategoryId>(initialCategoryId);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const activeEntry: HealthKnowledgeEntry =
    HEALTH_KNOWLEDGE_BASE.find((item) => item.id === selectedId) || HEALTH_KNOWLEDGE_BASE[0];
  const localized = activeEntry.content[language] || activeEntry.content.en;
  const isSaved = savedGuideIds.includes(activeEntry.id);

  const handleTriggerAi = () => {
    const promptByLang =
      language === 'te'
        ? `${localized.categoryName} గురించి నేను ఏమి తెలుసుకోవాలి? డాక్టర్‌ను ఎప్పుడు సంప్రదించాలి?`
        : language === 'hi'
        ? `${localized.categoryName} के बारे में मुझे क्या जानना चाहिए और डॉक्टर से कब मिलना चाहिए?`
        : `What should I know about ${localized.categoryName}, and when should I consult a doctor?`;
    onAskAiAboutTopic(promptByLang);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <p className="text-xs font-medium text-teal-700 mb-1">
          Verified Public Health Knowledge Base · WHO · MoHFW · ICMR · UNICEF
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          {t.healthInfo.title}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">{t.healthInfo.subtitle}</p>
      </div>

      {/* Workspace Layout: Category Sidebar + Detailed Guide Article */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Column: 9 Categories */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200 rounded-xl p-3">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-100 mb-1.5">
            09 Verified Health Categories
          </p>
          <nav className="space-y-1" aria-label="Health Information Categories">
            {HEALTH_KNOWLEDGE_BASE.map((entry, idx) => {
              const catLocalized = entry.content[language] || entry.content.en;
              const active = entry.id === selectedId;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between gap-2 ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{catLocalized.categoryName}</span>
                  <span
                    className={`font-mono-tabular text-xs shrink-0 ${
                      active ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Viewport: Selected Category Guide */}
        <article className="lg:col-span-8 xl:col-span-9 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          {/* Top Metadata & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <span className="font-semibold text-teal-800">{localized.categoryName}</span>
                <span aria-hidden="true">·</span>
                <span>Plain-Language Public Health Guide</span>
                <span aria-hidden="true">·</span>
                <span>Reviewed 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
                {localized.headline}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onToggleSaveGuide(activeEntry.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  isSaved
                    ? 'border-teal-600 bg-teal-50/40 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                    <span>{t.healthInfo.savedGuideBtn}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t.healthInfo.saveGuideBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTriggerAi}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.healthInfo.askAiAboutTopicBtn}</span>
              </button>
            </div>
          </div>

          {/* Overview Section */}
          <div className="py-6 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-2">
              {t.healthInfo.overviewLabel}
            </h3>
            <p className="text-base text-slate-800 leading-relaxed">{localized.summary}</p>
          </div>

          {/* Two-Column Details: Key Facts & General Self-Care */}
          <div className="py-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                01. {t.healthInfo.keyFactsLabel}
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {localized.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono-tabular text-xs font-semibold text-teal-700 mt-1">
                      0{idx + 1}.
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                02. {t.healthInfo.selfCareLabel}
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {localized.generalSelfCareAndPrevention.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono-tabular text-xs font-semibold text-teal-700 mt-1">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to Consult a Qualified Doctor */}
          <div className="py-6 border-b border-slate-100">
            <div className="pl-4 border-l-2 border-amber-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                03. {t.healthInfo.whenToConsultDoctorLabel}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {localized.whenToSeeDoctor.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span aria-hidden="true" className="text-amber-700 font-bold">
                      ·
                    </span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Reference Sources */}
          <div className="py-6">
            <h3 className="text-xs font-semibold text-slate-500 mb-3">
              {t.healthInfo.officialSourcesLabel}
            </h3>
            <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
              {activeEntry.references.map((ref, idx) => (
                <div
                  key={idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{ref.organization}</span>
                    <span className="mx-1.5 text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-700">{ref.documentTitle}</span>
                    <span className="mx-1.5 text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono-tabular text-slate-500">
                      Reviewed {ref.lastReviewed}
                    </span>
                  </div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium underline-offset-2 hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{t.safetyBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onNavigateToServices(activeEntry.recommendedServiceType as ServiceFacilityType)
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Find {activeEntry.recommendedServiceType}s Near You</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
