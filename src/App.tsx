/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  BookOpen,
  AlertTriangle,
  MapPin,
  Bookmark,
  MessageSquare,
  User,
  ArrowRight,
  ShieldAlert,
  Globe,
  Phone,
} from 'lucide-react';
import heroBannerImg from './assets/images/hero_healthcare_navigator_1790586006801.jpg';
import {
  SupportedLanguage,
  LANGUAGE_OPTIONS,
  UI_TRANSLATIONS,
} from './data/translations';
import {
  HEALTH_KNOWLEDGE_BASE,
  HealthCategoryId,
} from './data/knowledgeBase';
import {
  HEALTHCARE_FACILITIES,
  HealthcareFacility,
  ServiceFacilityType,
} from './data/healthcareServices';
import { AssistantView, SavedAiRequest } from './components/AssistantView';
import { ServicesView } from './components/ServicesView';
import { EmergencyView } from './components/EmergencyView';
import { HealthInfoView } from './components/HealthInfoView';
import { MyRequestsView } from './components/MyRequestsView';
import { ProfileModal, UserProfilePreferences } from './components/ProfileModal';

type ActiveSection = 'home' | 'assistant' | 'services' | 'healthInfo' | 'emergency' | 'myRequests';

const INITIAL_SAMPLE_REQUEST: SavedAiRequest = {
  id: 'seed-fever-guide',
  timestamp: '09:30 AM',
  question: 'I have a fever. What should I know?',
  language: 'en',
  answer: {
    intent: 'general_health_info',
    intentExplanation:
      'You are asking for general educational health information about understanding a fever and knowing when to seek medical evaluation.',
    summary:
      'A fever is a temporary rise in body temperature—typically above 38°C (100.4°F)—that shows your immune system is actively responding to an infection or inflammation. It is an important sign rather than a disease by itself.',
    commonReasonsOrContext: [
      'Common viral infections such as seasonal flu, common cold, or upper respiratory infections.',
      'Vector-borne illnesses (such as dengue or malaria) or bacterial infections requiring clinical evaluation.',
      'Temporary immune response following a routine vaccination or heat exhaustion.',
    ],
    generalGuidance: [
      'Stay well hydrated by drinking clean water, WHO-formulated Oral Rehydration Solution (ORS), coconut water, or clear soups.',
      'Rest in a comfortable, well-ventilated room and wear light, breathable cotton clothes.',
      'Monitor your temperature every 4 to 6 hours using a digital thermometer and avoid taking unprescribed antibiotics.',
    ],
    whenToSeeDoctor: [
      'Fever lasts more than 48 to 72 hours or rises above 39.4°C (103°F).',
      'Accompanied by severe headache, stiff neck, shortness of breath, persistent vomiting, confusion, or skin rash.',
      'Any fever in an infant under 3 months old, a pregnant woman, or an older adult with chronic health conditions.',
    ],
    disclaimer:
      'General educational information only. This does not constitute a medical diagnosis or prescription. Please consult a qualified healthcare professional for personal medical advice.',
    suggestedServiceType: 'Clinic',
    isEmergencyRedFlag: false,
  },
  ragMetadata: {
    embeddingModel: 'gemini-embedding-2-preview',
    generationModel: 'gemini-3.8-flash',
    retrievedCategories: [{ id: 'fever', name: 'Fever', similarityScore: 96 }],
    sources: [
      {
        categoryId: 'fever',
        categoryName: 'Fever',
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Integrated Management of Adolescent and Adult Illness – Fever Guidelines',
        url: 'https://www.who.int/health-topics',
        lastReviewed: '2026',
        similarityScore: 96,
      },
      {
        categoryId: 'fever',
        categoryName: 'Fever',
        organization: 'Ministry of Health & Family Welfare (MoHFW), Govt. of India',
        documentTitle: 'National Vector Borne Disease Control & Acute Febrile Illness Patient Guidance',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2026',
        similarityScore: 96,
      },
    ],
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [profile, setProfile] = useState<UserProfilePreferences>(() => {
    try {
      const stored = localStorage.getItem('healthguide_profile');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore storage errors
    }
    return {
      ageGroup: 'unspecified',
      preferredLanguage: 'en',
      location: 'Hyderabad',
    };
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Home search bar input
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // Cross-view navigation state
  const [pendingAiQuestion, setPendingAiQuestion] = useState<string | undefined>(undefined);
  const [serviceFilterType, setServiceFilterType] = useState<ServiceFacilityType | 'All'>('All');
  const [sortByNearby, setSortByNearby] = useState(false);
  const [selectedHealthCategory, setSelectedHealthCategory] = useState<HealthCategoryId>('fever');

  // Saved Requests State
  const [savedQuestions, setSavedQuestions] = useState<SavedAiRequest[]>(() => {
    try {
      const stored = localStorage.getItem('healthguide_saved_questions');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [INITIAL_SAMPLE_REQUEST];
  });

  const [savedFacilities, setSavedFacilities] = useState<HealthcareFacility[]>(() => {
    try {
      const stored = localStorage.getItem('healthguide_saved_facilities');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [HEALTHCARE_FACILITIES[0], HEALTHCARE_FACILITIES[7]];
  });

  const [savedGuideIds, setSavedGuideIds] = useState<HealthCategoryId[]>(() => {
    try {
      const stored = localStorage.getItem('healthguide_saved_guides');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return ['fever', 'first_aid'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('healthguide_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('healthguide_saved_questions', JSON.stringify(savedQuestions));
    } catch {
      // ignore
    }
  }, [savedQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem('healthguide_saved_facilities', JSON.stringify(savedFacilities));
    } catch {
      // ignore
    }
  }, [savedFacilities]);

  useEffect(() => {
    try {
      localStorage.setItem('healthguide_saved_guides', JSON.stringify(savedGuideIds));
    } catch {
      // ignore
    }
  }, [savedGuideIds]);

  const language = profile.preferredLanguage;
  const t = UI_TRANSLATIONS[language];

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setProfile((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = homeSearchQuery.trim();
    if (!q) {
      setActiveSection('assistant');
      return;
    }
    setPendingAiQuestion(q);
    setHomeSearchQuery('');
    setActiveSection('assistant');
  };

  const handleSaveAiRequest = (item: SavedAiRequest) => {
    setSavedQuestions((prev) => {
      const exists = prev.some((r) => r.question === item.question);
      if (exists) return prev;
      return [item, ...prev];
    });
  };

  const handleToggleSaveFacility = (facility: HealthcareFacility) => {
    setSavedFacilities((prev) => {
      const exists = prev.some((f) => f.id === facility.id);
      if (exists) return prev.filter((f) => f.id !== facility.id);
      return [facility, ...prev];
    });
  };

  const handleToggleSaveGuide = (id: HealthCategoryId) => {
    setSavedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalSavedCount =
    savedQuestions.length + savedFacilities.length + savedGuideIds.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: Strictly 3 Zones (Brand wordmark | 5 nav links | Primary actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setActiveSection('home')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-teal-800 transition-colors whitespace-nowrap shrink-0"
        >
          HealthGuide AI
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          aria-label="Primary Navigation"
        >
          <button
            type="button"
            onClick={() => setActiveSection('home')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeSection === 'home'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('assistant')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeSection === 'assistant'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            {t.nav.assistant}
          </button>
          <button
            type="button"
            onClick={() => {
              setServiceFilterType('All');
              setSortByNearby(false);
              setActiveSection('services');
            }}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeSection === 'services'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('healthInfo')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeSection === 'healthInfo'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            {t.nav.healthInfo}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('myRequests')}
            className={`py-1 transition-colors whitespace-nowrap ${
              activeSection === 'myRequests'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            {t.nav.myRequests}
          </button>
        </nav>

        {/* Zone 3: Language / Profile & Emergency Help Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Multilingual Switcher (English, Telugu, Hindi) */}
          <div
            className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200"
            role="group"
            aria-label="Language Selector"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleLanguageChange(opt.code)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  language === opt.code
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.nativeLabel}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.nav.profile}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('emergency')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.nav.emergencyHelp}</span>
          </button>
        </div>
      </header>

      {/* Mobile Secondary Navigation Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium text-slate-600">
        <button
          type="button"
          onClick={() => setActiveSection('home')}
          className={`whitespace-nowrap ${
            activeSection === 'home' ? 'text-teal-800 font-semibold' : ''
          }`}
        >
          {t.nav.home}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('assistant')}
          className={`whitespace-nowrap ${
            activeSection === 'assistant' ? 'text-teal-800 font-semibold' : ''
          }`}
        >
          {t.nav.assistant}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('services')}
          className={`whitespace-nowrap ${
            activeSection === 'services' ? 'text-teal-800 font-semibold' : ''
          }`}
        >
          {t.nav.services}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('healthInfo')}
          className={`whitespace-nowrap ${
            activeSection === 'healthInfo' ? 'text-teal-800 font-semibold' : ''
          }`}
        >
          {t.nav.healthInfo}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('myRequests')}
          className={`whitespace-nowrap ${
            activeSection === 'myRequests' ? 'text-teal-800 font-semibold' : ''
          }`}
        >
          {t.nav.myRequests}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* 1. Home Hero & Search Dashboard */}
            <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
              {/* Background Hero Image with Resilient Fallback & Contrast Scrim */}
              <div className="absolute inset-0">
                {!heroImgFailed ? (
                  <img
                    src={heroBannerImg}
                    alt="Modern sunlit healthcare information and community navigation center"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover opacity-45"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
              </div>

              <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:py-20 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-medium mb-3">
                  <span>WHO · MoHFW · ICMR Knowledge Grounded</span>
                  <span aria-hidden="true">·</span>
                  <span>English · తెలుగు · हिन्दी</span>
                  <span aria-hidden="true">·</span>
                  <span>Region: {profile.location}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  {t.appName}
                </h1>
                <p className="text-lg sm:text-xl text-slate-200 mt-2.5 font-normal">
                  “{t.tagline}”
                </p>

                {/* Primary Search Bar: "What healthcare information do you need?" */}
                <form
                  onSubmit={handleHomeSearchSubmit}
                  className="mt-7 bg-white rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-lg"
                >
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                    <Search className="w-5 h-5 text-teal-700 shrink-0" />
                    <input
                      type="text"
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      aria-label={t.searchPlaceholder}
                      className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t.searchButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Starter Prompts Below Search Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                  <span className="text-slate-400">Popular inquiries:</span>
                  {t.assistant.sampleQuestions.slice(0, 3).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPendingAiQuestion(q);
                        setActiveSection('assistant');
                      }}
                      className="hover:text-white underline underline-offset-4 decoration-teal-500/60 text-left"
                    >
                      “{q}”
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Non-Diagnostic Safety Assurance Strip */}
            <section className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700">
                  <strong className="font-semibold text-slate-900">{t.safetyBanner.title}: </strong>
                  {t.safetyBanner.text}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('assistant')}
                className="text-xs font-semibold text-teal-700 hover:underline whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                Open AI Assistant →
              </button>
            </section>

            {/* Primary Dashboard Navigation Buttons (The 5 Core Modules + AI Assistant Card) */}
            <section aria-label="Core Healthcare Navigation Actions">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Healthcare Navigation Modules
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a service directory, verified health topic, or emergency resource
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  Active City: {profile.location}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Button 1: Find Healthcare Services */}
                <button
                  type="button"
                  onClick={() => {
                    setServiceFilterType('All');
                    setSortByNearby(false);
                    setActiveSection('services');
                  }}
                  className="text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-700 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-mono-tabular text-teal-700 font-semibold">01 · DIRECTORY</span>
                      <Building2 className="w-4 h-4 text-teal-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {t.homeButtons.findServices}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {t.homeButtons.findServicesDesc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span>Hospitals · Clinics · Pharmacies · Labs</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                {/* Button 2: Health Information */}
                <button
                  type="button"
                  onClick={() => setActiveSection('healthInfo')}
                  className="text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-700 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-mono-tabular text-teal-700 font-semibold">02 · KNOWLEDGE BASE</span>
                      <BookOpen className="w-4 h-4 text-teal-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {t.homeButtons.healthInfo}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {t.homeButtons.healthInfoDesc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span>09 Public Health Topics · WHO & MoHFW</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                {/* Button 3: Emergency Help */}
                <button
                  type="button"
                  onClick={() => setActiveSection('emergency')}
                  className="text-left bg-white border border-red-200 rounded-xl p-6 hover:border-red-600 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-red-700 mb-3">
                      <span className="font-mono-tabular font-semibold">03 · URGENT CARE</span>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                      {t.homeButtons.emergencyHelp}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {t.homeButtons.emergencyHelpDesc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-red-700">
                    <span className="font-mono-tabular">Helplines 112 / 108 / 911 · 24/7 Trauma</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                {/* Button 4: Nearby Hospitals */}
                <button
                  type="button"
                  onClick={() => {
                    setServiceFilterType('Hospital');
                    setSortByNearby(true);
                    setActiveSection('services');
                  }}
                  className="text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-700 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-mono-tabular text-teal-700 font-semibold">04 · PROXIMITY</span>
                      <MapPin className="w-4 h-4 text-teal-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {t.homeButtons.nearbyHospitals}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {t.homeButtons.nearbyHospitalsDesc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span>GPS & City Distance Sorting ({profile.location})</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                {/* Button 5: My Requests */}
                <button
                  type="button"
                  onClick={() => setActiveSection('myRequests')}
                  className="text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-700 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-mono-tabular text-teal-700 font-semibold">05 · SAVED ITEMS</span>
                      <Bookmark className="w-4 h-4 text-teal-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {t.homeButtons.myRequests}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {t.homeButtons.myRequestsDesc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                    <span className="font-mono-tabular">{totalSavedCount} Saved Resources</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                {/* Card 6: AI Healthcare Assistant Direct Launch */}
                <button
                  type="button"
                  onClick={() => setActiveSection('assistant')}
                  className="text-left bg-slate-900 text-white border border-slate-800 rounded-xl p-6 hover:bg-slate-800 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-teal-300 mb-3">
                      <span className="font-mono-tabular font-semibold">06 · AI + RAG ENGINE</span>
                      <MessageSquare className="w-4 h-4 text-teal-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {t.assistant.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Describe your question in simple language for non-diagnostic educational guidance and service routing.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-300">
                    <span>Ask in English, తెలుగు, or हिन्दी</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              </div>
            </section>

            {/* Quick Browse: 9 Health Information Categories */}
            <section className="pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {t.healthInfo.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t.healthInfo.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('healthInfo')}
                  className="text-xs font-semibold text-teal-700 hover:underline self-start sm:self-end"
                >
                  Explore Full Library →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {HEALTH_KNOWLEDGE_BASE.map((entry, idx) => {
                  const loc = entry.content[language] || entry.content.en;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setSelectedHealthCategory(entry.id);
                        setActiveSection('healthInfo');
                      }}
                      className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-700 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-mono-tabular">0{idx + 1}</span>
                        <span>{entry.references[0]?.organization.split('(')[0]}</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-teal-800">
                        {loc.categoryName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {loc.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* How the AI + RAG Healthcare Navigator Works */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <div className="max-w-3xl mb-6">
                <p className="text-xs font-semibold text-teal-700 mb-1">
                  Transparent Retrieval-Augmented Generation (RAG)
                </p>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  How HealthGuide AI Grounds Every Response in Public Health Sources
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs font-mono-tabular font-semibold text-teal-700 mb-1">
                    01. User Question
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    Multilingual Plain-Language Input
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ask in English, Telugu, or Hindi about symptoms, preventive care, or nearby healthcare facilities.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono-tabular font-semibold text-teal-700 mb-1">
                    02. Vector Embedding
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    Semantic + Lexical Retrieval
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your query is embedded using <code className="font-mono-tabular">gemini-embedding-2-preview</code> to match relevant public health guidelines.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono-tabular font-semibold text-teal-700 mb-1">
                    03. Verified Knowledge Base
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    WHO, MoHFW, ICMR & UNICEF
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Retrieves curated guidance from official health agencies with explicit source citations and review years.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono-tabular font-semibold text-teal-700 mb-1">
                    04. Safe AI Guidance
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    Non-Diagnostic Navigation
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Explains general context, highlights when to see a doctor, and connects you to matching hospitals or clinics.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'assistant' && (
          <AssistantView
            language={language}
            initialQuestion={pendingAiQuestion}
            onClearInitialQuestion={() => setPendingAiQuestion(undefined)}
            userProfile={{ ageGroup: profile.ageGroup, location: profile.location }}
            savedRequests={savedQuestions}
            onSaveRequest={handleSaveAiRequest}
            onNavigateToServices={(type) => {
              setServiceFilterType(type || 'All');
              setSortByNearby(true);
              setActiveSection('services');
            }}
            onNavigateToEmergency={() => setActiveSection('emergency')}
          />
        )}

        {activeSection === 'services' && (
          <ServicesView
            language={language}
            initialServiceType={serviceFilterType}
            initialSortByNearby={sortByNearby}
            userCity={profile.location}
            onUpdateUserCity={(city) => {
              if (city !== 'All') {
                setProfile((prev) => ({ ...prev, location: city }));
              }
            }}
            savedFacilities={savedFacilities}
            onToggleSaveFacility={handleToggleSaveFacility}
          />
        )}

        {activeSection === 'healthInfo' && (
          <HealthInfoView
            language={language}
            initialCategoryId={selectedHealthCategory}
            savedGuideIds={savedGuideIds}
            onToggleSaveGuide={handleToggleSaveGuide}
            onAskAiAboutTopic={(q) => {
              setPendingAiQuestion(q);
              setActiveSection('assistant');
            }}
            onNavigateToServices={(type) => {
              setServiceFilterType(type);
              setSortByNearby(true);
              setActiveSection('services');
            }}
          />
        )}

        {activeSection === 'emergency' && (
          <EmergencyView
            language={language}
            userCity={profile.location}
            onNavigateToEmergencyFacilities={(type) => {
              setServiceFilterType(type);
              setSortByNearby(true);
              setActiveSection('services');
            }}
          />
        )}

        {activeSection === 'myRequests' && (
          <MyRequestsView
            language={language}
            savedQuestions={savedQuestions}
            savedFacilities={savedFacilities}
            savedGuideIds={savedGuideIds}
            onClearQuestions={() => setSavedQuestions([])}
            onRemoveFacility={handleToggleSaveFacility}
            onRemoveGuide={handleToggleSaveGuide}
            onOpenQuestionInAssistant={(q) => {
              setPendingAiQuestion(q);
              setActiveSection('assistant');
            }}
            onOpenCategoryInHealthInfo={(id) => {
              setSelectedHealthCategory(id);
              setActiveSection('healthInfo');
            }}
            onNavigateToServices={() => {
              setServiceFilterType('All');
              setActiveSection('services');
            }}
          />
        )}
      </main>

      {/* Quiet Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">HealthGuide AI</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Healthcare Information & Service Navigator</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>General educational information only; never replaces a qualified physician.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('emergency')}
              className="text-red-700 font-semibold hover:underline"
            >
              {t.nav.emergencyHelp} (112 / 108 / 911)
            </button>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-900 underline-offset-2 hover:underline"
            >
              {t.nav.profile} ({language.toUpperCase()})
            </button>
          </div>
        </div>
      </footer>

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
      />
    </div>
  );
}
