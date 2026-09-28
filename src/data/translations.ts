export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export const UI_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    appName: string;
    tagline: string;
    searchPlaceholder: string;
    searchButton: string;
    nav: {
      home: string;
      assistant: string;
      services: string;
      healthInfo: string;
      myRequests: string;
      emergencyHelp: string;
      profile: string;
    };
    homeButtons: {
      findServices: string;
      findServicesDesc: string;
      healthInfo: string;
      healthInfoDesc: string;
      emergencyHelp: string;
      emergencyHelpDesc: string;
      nearbyHospitals: string;
      nearbyHospitalsDesc: string;
      myRequests: string;
      myRequestsDesc: string;
    };
    safetyBanner: {
      title: string;
      text: string;
    };
    assistant: {
      title: string;
      subtitle: string;
      inputPlaceholder: string;
      sendButton: string;
      sampleQuestionsTitle: string;
      sampleQuestions: string[];
      intentLabels: {
        general_health_info: string;
        healthcare_facility: string;
        emergency_info: string;
        other_service: string;
      };
      ragPipelineTitle: string;
      sourcesUsedTitle: string;
      whenToSeeDoctorTitle: string;
      commonContextTitle: string;
      generalGuidanceTitle: string;
      findMatchingServiceBtn: string;
      saveRequestBtn: string;
      savedBadge: string;
    };
    services: {
      title: string;
      subtitle: string;
      searchLocationPlaceholder: string;
      useMyLocation: string;
      liveExternalSearch: string;
      filterType: string;
      filterSector: string;
      filterStatus: string;
      filterDistance: string;
      allTypes: string;
      allSectors: string;
      government: string;
      private: string;
      allStatuses: string;
      openNow: string;
      open24Hours: string;
      anyDistance: string;
      openMapBtn: string;
      callFacilityBtn: string;
      bookmarkBtn: string;
      bookmarkedBtn: string;
      availableServicesLabel: string;
      openingHoursLabel: string;
      contactLabel: string;
      addressLabel: string;
    };
    emergency: {
      title: string;
      alertBanner: string;
      nonDiagnosticNotice: string;
      findNearbyEmergencyBtn: string;
      selectRegionLabel: string;
      officialNumbersTitle: string;
      whileWaitingTitle: string;
      whileWaitingSteps: string[];
    };
    healthInfo: {
      title: string;
      subtitle: string;
      askAiAboutTopicBtn: string;
      overviewLabel: string;
      keyFactsLabel: string;
      selfCareLabel: string;
      whenToConsultDoctorLabel: string;
      officialSourcesLabel: string;
      saveGuideBtn: string;
      savedGuideBtn: string;
    };
    profile: {
      title: string;
      subtitle: string;
      privacyNotice: string;
      ageGroupLabel: string;
      preferredLanguageLabel: string;
      locationLabel: string;
      saveProfileBtn: string;
      savedConfirmation: string;
      ageGroups: { value: string; label: string }[];
    };
    myRequests: {
      title: string;
      subtitle: string;
      tabQuestions: string;
      tabFacilities: string;
      tabGuides: string;
      emptyQuestions: string;
      emptyFacilities: string;
      emptyGuides: string;
      clearHistoryBtn: string;
    };
  }
> = {
  en: {
    appName: 'HealthGuide AI',
    tagline: 'Find the right healthcare information and services.',
    searchPlaceholder: 'What healthcare information do you need?',
    searchButton: 'Ask & Navigate',
    nav: {
      home: 'Home',
      assistant: 'AI Assistant',
      services: 'Find Services',
      healthInfo: 'Health Info',
      myRequests: 'My Requests',
      emergencyHelp: 'Emergency Help',
      profile: 'Profile',
    },
    homeButtons: {
      findServices: 'Find Healthcare Services',
      findServicesDesc: 'Search hospitals, clinics, pharmacies, diagnostic centers, and emergency units.',
      healthInfo: 'Health Information',
      healthInfoDesc: 'Verified plain-language guides from WHO and public health agencies.',
      emergencyHelp: 'Emergency Help',
      emergencyHelpDesc: 'Official emergency helplines and nearest 24/7 trauma & emergency departments.',
      nearbyHospitals: 'Nearby Hospitals',
      nearbyHospitalsDesc: 'Locate government and private hospitals sorted by distance from your area.',
      myRequests: 'My Requests',
      myRequestsDesc: 'Review your saved AI health questions, bookmarked facilities, and guides.',
    },
    safetyBanner: {
      title: 'General Healthcare Information Only',
      text: 'HealthGuide AI provides educational health information and service navigation. It does NOT diagnose diseases, prescribe medicines, or replace a qualified doctor.',
    },
    assistant: {
      title: 'AI Healthcare Assistant',
      subtitle: 'Ask a health or healthcare service question in simple language. Powered by RAG over WHO, MoHFW, ICMR, and CDC public health references.',
      inputPlaceholder: 'Describe your question (e.g., "I have a fever. What should I know?")',
      sendButton: 'Get Guidance',
      sampleQuestionsTitle: 'Try a sample question',
      sampleQuestions: [
        'I have a fever. What should I know?',
        'Where can I find a government hospital or diagnostic center near me?',
        'What are safe first-aid steps for a minor burn at home?',
        'Which routine vaccinations are recommended for young children?',
      ],
      intentLabels: {
        general_health_info: 'Intent: General Health Information',
        healthcare_facility: 'Intent: Healthcare Facility Navigation',
        emergency_info: 'Intent: Urgent / Emergency Information',
        other_service: 'Intent: Preventive & Support Service',
      },
      ragPipelineTitle: 'RAG Knowledge Retrieval Pipeline',
      sourcesUsedTitle: 'Verified Public Health Sources Referenced',
      whenToSeeDoctorTitle: 'When Professional Medical Advice Is Needed',
      commonContextTitle: 'Common Reasons & Educational Context',
      generalGuidanceTitle: 'General Supportive Information',
      findMatchingServiceBtn: 'Find Matching Healthcare Facilities',
      saveRequestBtn: 'Save to My Requests',
      savedBadge: 'Saved in My Requests',
    },
    services: {
      title: 'Find Healthcare Services',
      subtitle: 'Filter verified hospitals, clinics, government facilities, pharmacies, diagnostic centers, and emergency departments.',
      searchLocationPlaceholder: 'Search by facility name, area, or service...',
      useMyLocation: 'Use GPS Location',
      liveExternalSearch: 'Discover Live via OpenStreetMap & Gemini Maps',
      filterType: 'Service Type',
      filterSector: 'Sector',
      filterStatus: 'Operating Status',
      filterDistance: 'Max Distance',
      allTypes: 'All Facility Types',
      allSectors: 'Government & Private',
      government: 'Government Only',
      private: 'Private / Trust',
      allStatuses: 'All Hours',
      openNow: 'Open Now',
      open24Hours: '24/7 Emergency Ready',
      anyDistance: 'Any Distance',
      openMapBtn: 'View on Map',
      callFacilityBtn: 'Call Facility',
      bookmarkBtn: 'Save Facility',
      bookmarkedBtn: 'Saved',
      availableServicesLabel: 'Available Services',
      openingHoursLabel: 'Opening Hours',
      contactLabel: 'Contact',
      addressLabel: 'Address',
    },
    emergency: {
      title: 'Emergency Help & Urgent Care Navigation',
      alertBanner: 'If someone is in immediate danger, contact your local emergency service or go to the nearest emergency department.',
      nonDiagnosticNotice: 'HealthGuide AI does not assess or diagnose medical emergencies. Please call an official emergency helpline immediately if someone experiences chest pain, difficulty breathing, severe bleeding, stroke symptoms, or loss of consciousness.',
      findNearbyEmergencyBtn: 'Find Nearby Emergency Healthcare Facilities',
      selectRegionLabel: 'Select Region for Official Helplines',
      officialNumbersTitle: 'Official Emergency Helplines',
      whileWaitingTitle: 'Safe Non-Diagnostic Steps While Waiting for Help',
      whileWaitingSteps: [
        'Stay calm and keep the person still, comfortable, and in a safe area.',
        'Keep your phone line free and share your exact landmark or GPS address with the dispatcher.',
        'Do not give food, drink, or unprescribed medications to an unconscious or severely ill person.',
        'Have someone wait at the entrance to guide the ambulance or emergency responders.',
      ],
    },
    healthInfo: {
      title: 'Reliable Health Information Library',
      subtitle: 'Simple, accessible guidance retrieved from WHO, Ministry of Health & Family Welfare (MoHFW), ICMR, UNICEF, and CDC.',
      askAiAboutTopicBtn: 'Ask AI Assistant About This Topic',
      overviewLabel: 'Simple Overview',
      keyFactsLabel: 'What You Should Know',
      selfCareLabel: 'General Preventive & Supportive Guidance',
      whenToConsultDoctorLabel: 'When to Consult a Qualified Doctor',
      officialSourcesLabel: 'Official Reference Sources',
      saveGuideBtn: 'Save Guide',
      savedGuideBtn: 'Saved in My Requests',
    },
    profile: {
      title: 'User Preferences & Profile',
      subtitle: 'Optional preferences to tailor language and nearby service distance calculations.',
      privacyNotice: 'Privacy First: We only ask for optional age group, language, and city/region. We never collect sensitive medical histories, personal identifiers, or clinical records.',
      ageGroupLabel: 'Age Group (Optional)',
      preferredLanguageLabel: 'Preferred Language',
      locationLabel: 'Preferred City / Region (Optional)',
      saveProfileBtn: 'Save Preferences',
      savedConfirmation: 'Preferences updated.',
      ageGroups: [
        { value: 'unspecified', label: 'Prefer not to say' },
        { value: 'under_18', label: 'Under 18 (Child / Adolescent)' },
        { value: '18_35', label: '18 – 35 years (Young Adult)' },
        { value: '36_59', label: '36 – 59 years (Adult)' },
        { value: '60_plus', label: '60+ years (Senior Citizen)' },
      ],
    },
    myRequests: {
      title: 'My Requests & Saved Resources',
      subtitle: 'Access your recent AI healthcare questions, bookmarked facilities, and saved health guides.',
      tabQuestions: 'AI Questions',
      tabFacilities: 'Saved Facilities',
      tabGuides: 'Saved Health Guides',
      emptyQuestions: 'No AI questions saved yet. Ask a question in the AI Healthcare Assistant to see it here.',
      emptyFacilities: 'No healthcare facilities saved yet. Browse Find Healthcare Services to bookmark hospitals or clinics.',
      emptyGuides: 'No health information guides saved yet. Explore Health Information to bookmark topics.',
      clearHistoryBtn: 'Clear Saved Requests',
    },
  },
  te: {
    appName: 'హెల్త్‌గైడ్ AI (HealthGuide AI)',
    tagline: 'సరైన ఆరోగ్య సమాచారం మరియు వైద్య సేవలను కనుగొనండి.',
    searchPlaceholder: 'మీకు ఏ ఆరోగ్య సమాచారం కావాలి?',
    searchButton: 'అడగండి & వెతకండి',
    nav: {
      home: 'హోమ్',
      assistant: 'AI సహాయకుడు',
      services: 'వైద్య సేవలు',
      healthInfo: 'ఆరోగ్య సమాచారం',
      myRequests: 'నా అభ్యర్థనలు',
      emergencyHelp: 'అత్యవసర సహాయం',
      profile: 'ప్రొఫైల్',
    },
    homeButtons: {
      findServices: 'వైద్య సేవలను కనుగొనండి',
      findServicesDesc: 'ఆసుపత్రులు, క్లినిక్‌లు, ప్రభుత్వ ఆసుపత్రులు, ఫార్మసీలు మరియు డయాగ్నస్టిక్ సెంటర్లను వెతకండి.',
      healthInfo: 'ఆరోగ్య సమాచారం',
      healthInfoDesc: 'WHO మరియు ప్రభుత్వ ఆరోగ్య సంస్థల నుండి సులభమైన భాషలో ఆరోగ్య సమాచారం.',
      emergencyHelp: 'అత్యవసర సహాయం',
      emergencyHelpDesc: 'అధికారిక అత్యవసర హెల్ప్‌లైన్ నంబర్లు మరియు సమీప 24/7 అత్యవసర విభాగాలు.',
      nearbyHospitals: 'సమీప ఆసుపత్రులు',
      nearbyHospitalsDesc: 'మీ ప్రాంతానికి దగ్గరలో ఉన్న ప్రభుత్వ మరియు ప్రైవేట్ ఆసుపత్రులను కనుగొనండి.',
      myRequests: 'నా అభ్యర్థనలు',
      myRequestsDesc: 'మీరు అడిగిన AI ఆరోగ్య ప్రశ్నలు మరియు సేవ్ చేసిన ఆసుపత్రులను చూడండి.',
    },
    safetyBanner: {
      title: 'సాధారణ ఆరోగ్య సమాచారం మాత్రమే',
      text: 'HealthGuide AI కేవలం అవగాహన కోసం సాధారణ ఆరోగ్య సమాచారాన్ని మాత్రమే అందిస్తుంది. ఇది వ్యాధులను నిర్ధారించదు, మందులను సూచించదు మరియు డాక్టర్‌కు ప్రత్యామ్నాయం కాదు.',
    },
    assistant: {
      title: 'AI ఆరోగ్య సహాయకుడు',
      subtitle: 'సరళమైన భాషలో మీ ఆరోగ్య ప్రశ్నను అడగండి. WHO, MoHFW మరియు ICMR ఆధారాలతో సమాచారం అందించబడుతుంది.',
      inputPlaceholder: 'మీ ప్రశ్నను వివరించండి (ఉదా: "నాకు జ్వరం ఉంది. నేను ఏమి తెలుసుకోవాలి?")',
      sendButton: 'సమాచారం పొందండి',
      sampleQuestionsTitle: 'ఉదాహరణ ప్రశ్నను ప్రయత్నించండి',
      sampleQuestions: [
        'నాకు జ్వరం ఉంది. నేను ఏమి తెలుసుకోవాలి?',
        'నా దగ్గరలో ప్రభుత్వ ఆసుపత్రి లేదా డయాగ్నస్టిక్ సెంటర్ ఎక్కడ ఉంది?',
        'చిన్న కాలిన గాయాలకు ఇంట్లో చేయగల సురక్షిత ప్రథమ చికిత్స ఏమిటి?',
        'చిన్న పిల్లలకు ఏ టీకాలు (వ్యాక్సిన్లు) వేయించాలి?',
      ],
      intentLabels: {
        general_health_info: 'ఉద్దేశ్యం: సాధారణ ఆరోగ్య సమాచారం',
        healthcare_facility: 'ఉద్దేశ్యం: వైద్య కేంద్రం / ఆసుపత్రి సమాచారం',
        emergency_info: 'ఉద్దేశ్యం: అత్యవసర ఆరోగ్య సమాచారం',
        other_service: 'ఉద్దేశ్యం: నివారణ & ఇతర ఆరోగ్య సేవలు',
      },
      ragPipelineTitle: 'RAG నాలెడ్జ్ బేస్ శోధన క్రమం',
      sourcesUsedTitle: 'ఉపయోగించిన అధికారిక ఆరోగ్య ఆధారాలు (Sources)',
      whenToSeeDoctorTitle: 'డాక్టర్‌ను ఎప్పుడు సంప్రదించాలి',
      commonContextTitle: 'సాధారణ కారణాలు & వివరణ',
      generalGuidanceTitle: 'సాధారణ ఆరోగ్య సూచనలు',
      findMatchingServiceBtn: 'సమీప వైద్య కేంద్రాలను కనుగొనండి',
      saveRequestBtn: 'నా అభ్యర్థనలలో సేవ్ చేయండి',
      savedBadge: 'సేవ్ చేయబడింది',
    },
    services: {
      title: 'వైద్య సేవలను కనుగొనండి',
      subtitle: 'ఆసుపత్రులు, క్లినిక్‌లు, ప్రభుత్వ ఆసుపత్రులు, ఫార్మసీలు, డయాగ్నస్టిక్ సెంటర్లు మరియు అత్యవసర విభాగాలను వెతకండి.',
      searchLocationPlaceholder: 'ఆసుపత్రి పేరు, ప్రాంతం లేదా సేవ ద్వారా వెతకండి...',
      useMyLocation: 'నా GPS లొకేషన్ ఉపయోగించండి',
      liveExternalSearch: 'OpenStreetMap & Gemini Maps ద్వారా లైవ్ శోధన',
      filterType: 'సేవ రకం',
      filterSector: 'విభాగం',
      filterStatus: 'సమయం',
      filterDistance: 'దూరం',
      allTypes: 'అన్ని రకాలు',
      allSectors: 'ప్రభుత్వ & ప్రైవేట్',
      government: 'ప్రభుత్వ ఆసుపత్రులు మాత్రమే',
      private: 'ప్రైవేట్ / ట్రస్ట్',
      allStatuses: 'అన్ని వేళలు',
      openNow: 'ఇప్పుడు తెరిచి ఉన్నవి',
      open24Hours: '24/7 అత్యవసర సేవలు',
      anyDistance: 'ఏ దూరమైనా',
      openMapBtn: 'మ్యాప్‌లో చూడండి',
      callFacilityBtn: 'కాల్ చేయండి',
      bookmarkBtn: 'సేవ్ చేయండి',
      bookmarkedBtn: 'సేవ్ చేయబడింది',
      availableServicesLabel: 'అందుబాటులో ఉన్న సేవలు',
      openingHoursLabel: 'పనిచేయు సమయాలు',
      contactLabel: 'ఫోన్ నంబర్',
      addressLabel: 'చిరునామా',
    },
    emergency: {
      title: 'అత్యవసర సహాయం (Emergency Help)',
      alertBanner: 'ఎవరైనా తక్షణ ప్రమాదంలో ఉంటే, వెంటనే మీ స్థానిక అత్యవసర సేవను సంప్రదించండి లేదా సమీపంలోని అత్యవసర విభాగానికి (Emergency Department) వెళ్లండి.',
      nonDiagnosticNotice: 'HealthGuide AI అత్యవసర పరిస్థితులను నిర్ధారించదు. ఛాతీ నొప్పి, శ్వాస తీసుకోవడంలో ఇబ్బంది, తీవ్రమైన రక్తస్రావం లేదా స్పృహ కోల్పోవడం వంటి లక్షణాలు ఉంటే వెంటనే 108 లేదా 112 కు కాల్ చేయండి.',
      findNearbyEmergencyBtn: 'సమీప అత్యవసర ఆసుపత్రులను కనుగొనండి',
      selectRegionLabel: 'అధికారిక హెల్ప్‌లైన్ల కోసం ప్రాంతాన్ని ఎంచుకోండి',
      officialNumbersTitle: 'అధికారిక అత్యవసర హెల్ప్‌లైన్ నంబర్లు',
      whileWaitingTitle: 'అంబులెన్స్ వచ్చే వరకు తీసుకోవలసిన సాధారణ జాగ్రత్తలు',
      whileWaitingSteps: [
        'భయపడకుండా ప్రశాంతంగా ఉండండి మరియు బాధితుడిని సురక్షితమైన ప్రదేశంలో ఉంచండి.',
        'మీ ఫోన్ లైన్‌ను ఖాళీగా ఉంచండి మరియు ఖచ్చితమైన చిరునామాను అంబులెన్స్ సిబ్బందికి తెలియజేయండి.',
        'స్పృహ లేని వ్యక్తికి నీరు, ఆహారం లేదా డాక్టర్ సూచించని మందులు ఇవ్వకండి.',
        'అంబులెన్స్ సిబ్బందికి దారి చూపడానికి ఎవరినైనా ఇంటి బయట వేచి ఉండమని చెప్పండి.',
      ],
    },
    healthInfo: {
      title: 'ఆరోగ్య సమాచార విభాగం',
      subtitle: 'WHO, కేంద్ర ఆరోగ్య మంత్రిత్వ శాఖ (MoHFW), ICMR మరియు UNICEF నుండి సేకరించిన సులభమైన ఆరోగ్య సమాచారం.',
      askAiAboutTopicBtn: 'ఈ అంశంపై AI సహాయకుడిని అడగండి',
      overviewLabel: 'సాధారణ వివరణ',
      keyFactsLabel: 'మీరు తెలుసుకోవలసిన ముఖ్య విషయాలు',
      selfCareLabel: 'సాధారణ నివారణ & జాగ్రత్తలు',
      whenToConsultDoctorLabel: 'డాక్టర్‌ను ఎప్పుడు సంప్రదించాలి',
      officialSourcesLabel: 'అధికారిక సమాచార ఆధారాలు',
      saveGuideBtn: 'సేవ్ చేయండి',
      savedGuideBtn: 'సేవ్ చేయబడింది',
    },
    profile: {
      title: 'వినియోగదారు ప్రొఫైల్ & ప్రాధాన్యతలు',
      subtitle: 'భాష మరియు సమీప ఆసుపత్రుల దూరాన్ని అంచనా వేయడానికి ఐచ్ఛిక వివరాలు.',
      privacyNotice: 'గోప్యతా హామీ: మేము మీ వ్యక్తిగత వైద్య చరిత్రను లేదా సున్నితమైన సమాచారాన్ని సేకరించము.',
      ageGroupLabel: 'వయస్సు విభాగం (ఐచ్ఛికం)',
      preferredLanguageLabel: 'భాష (Preferred Language)',
      locationLabel: 'ప్రాంతం / నగరం (ఐచ్ఛికం)',
      saveProfileBtn: 'వివరాలు సేవ్ చేయండి',
      savedConfirmation: 'ప్రొఫైల్ వివరాలు సేవ్ చేయబడ్డాయి.',
      ageGroups: [
        { value: 'unspecified', label: 'చెప్పడం ఇష్టం లేదు' },
        { value: 'under_18', label: '18 ఏళ్ల లోపు (పిల్లలు / కౌమారదశ)' },
        { value: '18_35', label: '18 – 35 ఏళ్లు (యువత)' },
        { value: '36_59', label: '36 – 59 ఏళ్లు (పెద్దలు)' },
        { value: '60_plus', label: '60+ ఏళ్లు (వయోవృద్ధులు)' },
      ],
    },
    myRequests: {
      title: 'నా అభ్యర్థనలు (My Requests)',
      subtitle: 'మీరు గతంలో అడిగిన AI ప్రశ్నలు, సేవ్ చేసిన ఆసుపత్రులు మరియు ఆరోగ్య సమాచారం.',
      tabQuestions: 'AI ప్రశ్నలు',
      tabFacilities: 'సేవ్ చేసిన ఆసుపత్రులు',
      tabGuides: 'సేవ్ చేసిన ఆరోగ్య అంశాలు',
      emptyQuestions: 'ఇంకా ఏ AI ప్రశ్నలు సేవ్ చేయలేదు.',
      emptyFacilities: 'ఇంకా ఏ ఆసుపత్రులను సేవ్ చేయలేదు.',
      emptyGuides: 'ఇంకా ఏ ఆరోగ్య అంశాలను సేవ్ చేయలేదు.',
      clearHistoryBtn: 'చరిత్రను తొలగించండి',
    },
  },
  hi: {
    appName: 'हेल्थगाइड AI (HealthGuide AI)',
    tagline: 'सही स्वास्थ्य जानकारी और चिकित्सा सेवाएं खोजें।',
    searchPlaceholder: 'आपको किस स्वास्थ्य जानकारी की आवश्यकता है?',
    searchButton: 'पूछें और खोजें',
    nav: {
      home: 'होम',
      assistant: 'AI सहायक',
      services: 'स्वास्थ्य सेवाएं',
      healthInfo: 'स्वास्थ्य जानकारी',
      myRequests: 'मेरे अनुरोध',
      emergencyHelp: 'आपातकालीन सहायता',
      profile: 'प्रोफ़ाइल',
    },
    homeButtons: {
      findServices: 'स्वास्थ्य सेवाएं खोजें',
      findServicesDesc: 'अस्पताल, क्लिनिक, सरकारी अस्पताल, फार्मेसी और डायग्नोस्टिक सेंटर खोजें।',
      healthInfo: 'स्वास्थ्य जानकारी',
      healthInfoDesc: 'WHO और सरकारी स्वास्थ्य संगठनों से सरल भाषा में विश्वसनीय स्वास्थ्य जानकारी।',
      emergencyHelp: 'आपातकालीन सहायता',
      emergencyHelpDesc: 'आधिकारिक आपातकालीन हेल्पलाइन नंबर और निकटतम 24/7 आपातकालीन विभाग।',
      nearbyHospitals: 'नज़दीकी अस्पताल',
      nearbyHospitalsDesc: 'अपने क्षेत्र से दूरी के अनुसार सरकारी और निजी अस्पताल खोजें।',
      myRequests: 'मेरे अनुरोध',
      myRequestsDesc: 'अपने सहेजे गए AI स्वास्थ्य प्रश्न, अस्पताल और स्वास्थ्य गाइड देखें।',
    },
    safetyBanner: {
      title: 'केवल सामान्य स्वास्थ्य जानकारी',
      text: 'HealthGuide AI केवल सामान्य शैक्षिक स्वास्थ्य जानकारी और सेवा नेविगेशन प्रदान करता है। यह किसी बीमारी का निदान नहीं करता, दवाएं नहीं लिखता और डॉक्टर का विकल्प नहीं है।',
    },
    assistant: {
      title: 'AI स्वास्थ्य सहायक',
      subtitle: 'सरल भाषा में अपना स्वास्थ्य या सेवा संबंधी प्रश्न पूछें। WHO, MoHFW और ICMR के विश्वसनीय स्रोतों पर आधारित।',
      inputPlaceholder: 'अपना प्रश्न लिखें (जैसे: "मुझे बुखार है। मुझे क्या जानना चाहिए?")',
      sendButton: 'जानकारी प्राप्त करें',
      sampleQuestionsTitle: 'उदाहरण प्रश्न पूछें',
      sampleQuestions: [
        'मुझे बुखार है। मुझे क्या जानना चाहिए?',
        'मेरे पास सरकारी अस्पताल या डायग्नोस्टिक सेंटर कहाँ मिल सकता है?',
        'हल्के जलने पर घर में सुरक्षित प्राथमिक उपचार (First Aid) क्या है?',
        'छोटे बच्चों के लिए कौन से नियमित टीके (Vaccines) आवश्यक हैं?',
      ],
      intentLabels: {
        general_health_info: 'उद्देश्य: सामान्य स्वास्थ्य जानकारी',
        healthcare_facility: 'उद्देश्य: स्वास्थ्य केंद्र / अस्पताल खोज',
        emergency_info: 'उद्देश्य: आपातकालीन स्वास्थ्य जानकारी',
        other_service: 'उद्देश्य: निवारक और सहायक सेवा',
      },
      ragPipelineTitle: 'RAG नॉलेज बेस खोज प्रक्रिया',
      sourcesUsedTitle: 'प्रयुक्त विश्वसनीय स्वास्थ्य स्रोत (Sources)',
      whenToSeeDoctorTitle: 'डॉक्टर से कब संपर्क करें',
      commonContextTitle: 'सामान्य कारण और संदर्भ',
      generalGuidanceTitle: 'सामान्य सहायक जानकारी',
      findMatchingServiceBtn: 'संबंधित स्वास्थ्य केंद्र खोजें',
      saveRequestBtn: 'मेरे अनुरोधों में सहेजें',
      savedBadge: 'सहेजा गया',
    },
    services: {
      title: 'स्वास्थ्य सेवाएं खोजें',
      subtitle: 'अस्पताल, क्लिनिक, सरकारी अस्पताल, फार्मेसी, डायग्नोस्टिक सेंटर और इमरजेंसी विभाग खोजें।',
      searchLocationPlaceholder: 'अस्पताल का नाम, क्षेत्र या सेवा खोजें...',
      useMyLocation: 'मेरी GPS लोकेशन का उपयोग करें',
      liveExternalSearch: 'OpenStreetMap और Gemini Maps से लाइव खोजें',
      filterType: 'सेवा का प्रकार',
      filterSector: 'क्षेत्र (सरकारी/निजी)',
      filterStatus: 'स्थिति',
      filterDistance: 'अधिकतम दूरी',
      allTypes: 'सभी प्रकार के केंद्र',
      allSectors: 'सरकारी और निजी',
      government: 'केवल सरकारी अस्पताल',
      private: 'निजी / ट्रस्ट',
      allStatuses: 'सभी समय',
      openNow: 'अभी खुले हैं',
      open24Hours: '24/7 आपातकालीन सेवा',
      anyDistance: 'कोई भी दूरी',
      openMapBtn: 'मैप पर देखें',
      callFacilityBtn: 'कॉल करें',
      bookmarkBtn: 'केंद्र सहेजें',
      bookmarkedBtn: 'सहेजा गया',
      availableServicesLabel: 'उपलब्ध सेवाएं',
      openingHoursLabel: 'खुलने का समय',
      contactLabel: 'संपर्क नंबर',
      addressLabel: 'पता',
    },
    emergency: {
      title: 'आपातकालीन सहायता (Emergency Help)',
      alertBanner: 'यदि कोई व्यक्ति तत्काल खतरे में है, तो तुरंत अपनी स्थानीय आपातकालीन सेवा से संपर्क करें या निकटतम आपातकालीन विभाग (Emergency Department) में जाएं।',
      nonDiagnosticNotice: 'HealthGuide AI आपातकालीन स्थिति का निदान नहीं करता है। सीने में दर्द, सांस लेने में तकलीफ, गंभीर रक्तस्राव या बेहोशी होने पर तुरंत 112 या 108 पर कॉल करें।',
      findNearbyEmergencyBtn: 'नज़दीकी आपातकालीन अस्पताल खोजें',
      selectRegionLabel: 'आधिकारिक हेल्पलाइन के लिए क्षेत्र चुनें',
      officialNumbersTitle: 'आधिकारिक आपातकालीन हेल्पलाइन नंबर',
      whileWaitingTitle: 'सहायता आने तक सुरक्षित सामान्य सावधानियां',
      whileWaitingSteps: [
        'शांत रहें और व्यक्ति को सुरक्षित व आरामदायक स्थिति में रखें।',
        'अपनी फोन लाइन खाली रखें और ऑपरेटर को सटीक पता या लैंडमार्क बताएं।',
        'बेहोश या गंभीर रूप से बीमार व्यक्ति को पानी, भोजन या बिना डॉक्टर की सलाह के कोई दवा न दें।',
        'एम्बुलेंस को रास्ता दिखाने के लिए किसी को मुख्य द्वार पर खड़ा करें।',
      ],
    },
    healthInfo: {
      title: 'विश्वसनीय स्वास्थ्य जानकारी पुस्तकालय',
      subtitle: 'WHO, स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW), ICMR और UNICEF से सरल भाषा में स्वास्थ्य जानकारी।',
      askAiAboutTopicBtn: 'इस विषय पर AI सहायक से पूछें',
      overviewLabel: 'सरल परिचय',
      keyFactsLabel: 'मुख्य बातें जो आपको जाननी चाहिए',
      selfCareLabel: 'सामान्य बचाव और देखभाल',
      whenToConsultDoctorLabel: 'योग्य डॉक्टर से कब मिलें',
      officialSourcesLabel: 'आधिकारिक संदर्भ स्रोत',
      saveGuideBtn: 'गाइड सहेजें',
      savedGuideBtn: 'सहेजा गया',
    },
    profile: {
      title: 'उपयोगकर्ता प्रोफ़ाइल और प्राथमिकताएं',
      subtitle: 'भाषा और नज़दीकी अस्पतालों की दूरी के लिए वैकल्पिक जानकारी।',
      privacyNotice: 'गोपनीयता नीति: हम आपकी संवेदनशील चिकित्सा जानकारी या व्यक्तिगत स्वास्थ्य रिकॉर्ड एकत्र नहीं करते हैं।',
      ageGroupLabel: 'आयु वर्ग (वैकल्पिक)',
      preferredLanguageLabel: 'पसंदीदा भाषा (Language)',
      locationLabel: 'पसंदीदा शहर / क्षेत्र (वैकल्पिक)',
      saveProfileBtn: 'प्राथमिकताएं सहेजें',
      savedConfirmation: 'प्रोफ़ाइल प्राथमिकताएं अपडेट हो गईं।',
      ageGroups: [
        { value: 'unspecified', label: 'बताना नहीं चाहते' },
        { value: 'under_18', label: '18 वर्ष से कम (बच्चे / किशोर)' },
        { value: '18_35', label: '18 – 35 वर्ष (युवा)' },
        { value: '36_59', label: '36 – 59 वर्ष (वयस्क)' },
        { value: '60_plus', label: '60+ वर्ष (वरिष्ठ नागरिक)' },
      ],
    },
    myRequests: {
      title: 'मेरे अनुरोध और सहेजे गए संसाधन',
      subtitle: 'आपके द्वारा पूछे गए AI स्वास्थ्य प्रश्न, सहेजे गए अस्पताल और स्वास्थ्य गाइड।',
      tabQuestions: 'AI प्रश्न',
      tabFacilities: 'सहेजे गए अस्पताल',
      tabGuides: 'सहेजे गए स्वास्थ्य गाइड',
      emptyQuestions: 'अभी तक कोई AI प्रश्न सहेजा नहीं गया है।',
      emptyFacilities: 'अभी तक कोई स्वास्थ्य केंद्र सहेजा नहीं गया है।',
      emptyGuides: 'अभी तक कोई स्वास्थ्य गाइड सहेजा नहीं गया है।',
      clearHistoryBtn: 'इतिहास साफ़ करें',
    },
  },
};
