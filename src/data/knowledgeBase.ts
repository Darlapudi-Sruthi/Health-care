import { SupportedLanguage } from './translations';

export type HealthCategoryId =
  | 'fever'
  | 'nutrition'
  | 'mental_wellbeing'
  | 'first_aid'
  | 'common_illnesses'
  | 'vaccination'
  | 'womens_health'
  | 'childrens_health'
  | 'preventive_healthcare';

export interface OfficialReference {
  organization: string;
  documentTitle: string;
  url: string;
  lastReviewed: string;
}

export interface LocalizedHealthContent {
  categoryName: string;
  headline: string;
  summary: string;
  keyFacts: string[];
  generalSelfCareAndPrevention: string[];
  whenToSeeDoctor: string[];
}

export interface HealthKnowledgeEntry {
  id: HealthCategoryId;
  keywords: string[];
  recommendedServiceType: string;
  references: OfficialReference[];
  content: Record<SupportedLanguage, LocalizedHealthContent>;
}

export const HEALTH_KNOWLEDGE_BASE: HealthKnowledgeEntry[] = [
  {
    id: 'fever',
    keywords: [
      'fever',
      'temperature',
      'chills',
      'body ache',
      'sweating',
      'pyrexia',
      'viral fever',
      'జ్వరం',
      'చలి',
      'ఒళ్ళు నొప్పులు',
      'बुखार',
      'तापमान',
      'ठंड लगना',
    ],
    recommendedServiceType: 'Clinic',
    references: [
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Integrated Management of Adolescent and Adult Illness – Fever Guidelines',
        url: 'https://www.who.int/health-topics',
        lastReviewed: '2026',
      },
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW), Govt. of India',
        documentTitle: 'National Vector Borne Disease Control & Acute Febrile Illness Patient Guidance',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2026',
      },
      {
        organization: 'Indian Council of Medical Research (ICMR)',
        documentTitle: 'Standard Treatment Workflow: Evaluation of Acute Fever in Primary Care',
        url: 'https://www.icmr.gov.in/',
        lastReviewed: '2025',
      },
    ],
    content: {
      en: {
        categoryName: 'Fever',
        headline: 'Understanding Fever, Hydration, and When to Seek Medical Evaluation',
        summary:
          'A fever is a temporary rise in body temperature—typically above 38°C (100.4°F)—that usually indicates your body’s natural immune system is responding to an infection or inflammation. Fever itself is a sign, not a standalone disease.',
        keyFacts: [
          'Normal human body temperature ranges around 36.5°C to 37.5°C (97.7°F to 99.5°F) and varies slightly by time of day.',
          'Common reasons for a fever include seasonal viral infections (flu, common cold), bacterial infections, mosquito-borne illnesses (such as dengue or malaria in endemic regions), heat exhaustion, or recent immunization.',
          'Accompanying signs often include sweating, chills, headache, muscle aches, fatigue, and reduced appetite.',
          'Never self-medicate with leftover antibiotics or unprescribed medications, as inappropriate drugs can mask symptoms or cause harm.',
        ],
        generalSelfCareAndPrevention: [
          'Drink plenty of safe fluids such as clean water, Oral Rehydration Solution (ORS), clear soups, or coconut water to prevent dehydration.',
          'Rest in a well-ventilated, comfortable room and wear light, breathable cotton clothing.',
          'Monitor body temperature with a reliable digital thermometer every 4 to 6 hours and keep a note of readings.',
          'Use a lukewarm sponge bath if temperature feels uncomfortable—avoid ice-cold water, which can cause shivering.',
        ],
        whenToSeeDoctor: [
          'Fever lasts longer than 48 to 72 hours or keeps rising above 39.4°C (103°F).',
          'Any fever in an infant under 3 months of age requires immediate medical attention.',
          'Warning signs appear: severe headache, stiff neck, confusion, difficulty breathing, persistent vomiting, skin rash, or tiny red spots.',
          'The person has underlying chronic conditions, is pregnant, or is an elderly adult showing weakness or dizziness.',
        ],
      },
      te: {
        categoryName: 'జ్వరం (Fever)',
        headline: 'జ్వరం గురించి సాధారణ అవగాహన, జాగ్రత్తలు మరియు డాక్టర్‌ను ఎప్పుడు సంప్రదించాలి',
        summary:
          'జ్వరం అనేది శరీర ఉష్ణోగ్రత తాత్కాలికంగా పెరగడం (సాధారణంగా 38°C లేదా 100.4°F కంటే ఎక్కువ). ఇది మన శరీర రోగనిరోధక శక్తి ఏదైనా ఇన్ఫెక్షన్‌తో పోరాడుతోందని సూచించే ఒక లక్షణం మాత్రమే, అది స్వయంగా ఒక వ్యాధి కాదు.',
        keyFacts: [
          'మనిషి సాధారణ శరీర ఉష్ణోగ్రత సుమారు 36.5°C నుండి 37.5°C (97.7°F – 99.5°F) మధ్య ఉంటుంది.',
          'జ్వరం రావడానికి సాధారణ కారణాలు: వైరల్ ఇన్ఫెక్షన్లు (జలుబు, ఫ్లూ), బ్యాక్టీరియా ఇన్ఫెక్షన్లు, దోమల ద్వారా వచ్చే వ్యాధులు (డెంగ్యూ, మలేరియా), ఎండదెబ్బ లేదా టీకా వేయించుకున్న తర్వాత వచ్చే సాధారణ ప్రతిస్పందన.',
          'జ్వరంతో పాటు చలి, తలనొప్పి, ఒళ్ళు నొప్పులు, అలసట మరియు ఆకలి తగ్గడం వంటివి కనిపించవచ్చు.',
          'డాక్టర్ సలహా లేకుండా యాంటీబయాటిక్స్ లేదా పాత మందులను సొంతంగా వేసుకోకూడదు.',
        ],
        generalSelfCareAndPrevention: [
          'డీహైడ్రేషన్ (నిర్జలీకరణం) నివారించడానికి కాచి చల్లార్చిన నీరు, ORS ద్రావణం, కొబ్బరి నీరు లేదా సూప్ తరచుగా తాగాలి.',
          'గాలి బాగా ఆడే గదిలో తగినంత విశ్రాంతి తీసుకోవాలి మరియు తేలికపాటి నూలు దుస్తులు ధరించాలి.',
          'డిజిటల్ థర్మామీటర్‌తో ప్రతి 4-6 గంటలకు ఉష్ణోగ్రతను పరిశీలించి నమోదు చేసుకోవాలి.',
          'గోరువెచ్చని నీటితో తడిపిన గుడ్డతో శరీరాన్ని తుడవవచ్చు; ఐస్ నీటిని ఉపయోగించకూడదు.',
        ],
        whenToSeeDoctor: [
          'జ్వరం 2 నుండి 3 రోజుల కంటే ఎక్కువగా కొనసాగినా లేదా 103°F (39.4°C) దాటినా వెంటనే డాక్టర్‌ను కలవాలి.',
          '3 నెలల లోపు పసిపిల్లలకు జ్వరం వస్తే ఆలస్యం చేయకుండా ఆసుపత్రికి తీసుకెళ్లాలి.',
          'తీవ్రమైన తలనొప్పి, మెడ పట్టేయడం, శ్వాస తీసుకోవడంలో ఇబ్బంది, వరుసగా వాంతులు, చర్మంపై దద్దుర్లు కనిపిస్తే అత్యవసర వైద్యం అవసరం.',
          'గర్భిణీ స్త్రీలు, వృద్ధులు లేదా దీర్ఘకాలిక వ్యాధులు ఉన్నవారికి జ్వరం వస్తే వైద్య సలహా తప్పనిసరి.',
        ],
      },
      hi: {
        categoryName: 'बुखार (Fever)',
        headline: 'बुखार की समझ, पानी की कमी से बचाव और डॉक्टर से कब मिलें',
        summary:
          'बुखार शरीर के तापमान में एक अस्थायी वृद्धि है—आमतौर पर 38°C (100.4°F) से ऊपर—जो दर्शाता है कि आपके शरीर की प्रतिरक्षा प्रणाली किसी संक्रमण से लड़ रही है। बुखार स्वयं कोई बीमारी नहीं बल्कि एक संकेत है।',
        keyFacts: [
          'शरीर का सामान्य तापमान 36.5°C से 37.5°C (97.7°F से 99.5°F) के बीच होता है।',
          'बुखार के सामान्य कारणों में मौसमी वायरल संक्रमण (फ्लू, जुकाम), बैक्टीरियल संक्रमण, मच्छर जनित रोग (जैसे डेंगू या मलेरिया), गर्मी लगना या टीकाकरण के बाद की सामान्य प्रतिक्रिया शामिल हैं।',
          'इसके साथ अक्सर ठंड लगना, सिरदर्द, बदन दर्द, पसीना आना और कमजोरी महसूस हो सकती है।',
          'बिना डॉक्टर की सलाह के कभी भी एंटीबायोटिक या पुरानी दवाएं न लें।',
        ],
        generalSelfCareAndPrevention: [
          'शरीर में पानी की कमी (डिहाइड्रेशन) से बचने के लिए साफ पानी, ORS घोल, नारियल पानी या सूप पर्याप्त मात्रा में पिएं।',
          'हवादार कमरे में आराम करें और हल्के सूती कपड़े पहनें।',
          'डिजिटल थर्मामीटर से हर 4 से 6 घंटे में तापमान जांचें और नोट करें।',
          'तेज़ तापमान होने पर सामान्य या गुनगुने पानी की पट्टी रखें; बर्फ के ठंडे पानी का उपयोग न करें।',
        ],
        whenToSeeDoctor: [
          'यदि बुखार 2 से 3 दिनों से अधिक रहे या 103°F (39.4°C) से ऊपर चला जाए।',
          '3 महीने से कम उम्र के शिशु को बुखार होने पर तुरंत डॉक्टर को दिखाएं।',
          'गंभीर सिरदर्द, गर्दन में अकड़न, सांस लेने में तकलीफ, लगातार उल्टी, चकत्ते (रैश) या बेहोशी जैसे लक्षण दिखें।',
          'गर्भवती महिलाओं, बुजुर्गों या पुरानी बीमारी से पीड़ित व्यक्तियों को बुखार होने पर तुरंत चिकित्सकीय परामर्श लें।',
        ],
      },
    },
  },
  {
    id: 'nutrition',
    keywords: [
      'nutrition',
      'diet',
      'food',
      'protein',
      'vitamins',
      'iron',
      'anemia',
      'hydration',
      'balanced meal',
      'పోషకాహారం',
      'ఆహారం',
      'విటమిన్లు',
      'पोषण',
      'आहार',
      'संतुलित भोजन',
    ],
    recommendedServiceType: 'Clinic',
    references: [
      {
        organization: 'ICMR – National Institute of Nutrition (NIN), Hyderabad',
        documentTitle: 'Dietary Guidelines for Indians (2024–2026 Edition)',
        url: 'https://www.nin.res.in/',
        lastReviewed: '2026',
      },
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Healthy Diet Fact Sheet & Micronutrient Recommendations',
        url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
        lastReviewed: '2025',
      },
    ],
    content: {
      en: {
        categoryName: 'Nutrition',
        headline: 'Balanced Daily Nutrition, Hydration, and Micronutrient Wellbeing',
        summary:
          'A balanced diet provides the energy, proteins, healthy fats, vitamins, and minerals your body needs to maintain immunity, support growth, and reduce the risk of non-communicable conditions.',
        keyFacts: [
          'ICMR-NIN recommends filling half of your daily plate with vegetables, greens, and seasonal fruits.',
          'Combine whole grains (millets like ragi/jowar, brown rice, whole wheat) with protein sources such as pulses, lentils, curd, eggs, nuts, or fish.',
          'Limit ultra-processed foods, sugary beverages, trans fats, and excess dietary salt (keep salt under 5 grams per day as advised by WHO).',
          'Iron-rich foods (leafy greens, pulses, jaggery, dates) paired with Vitamin C (lemon, amla, orange) improve natural iron absorption.',
        ],
        generalSelfCareAndPrevention: [
          'Drink 8 to 10 glasses of clean drinking water daily, increasing intake during hot weather or physical activity.',
          'Wash fruits and vegetables thoroughly under running water before cooking or eating raw.',
          'Read nutrition labels on packaged items to check hidden sugars, sodium, and saturated fats.',
          'Prefer home-cooked meals with diverse seasonal produce over deep-fried snacks.',
        ],
        whenToSeeDoctor: [
          'Unexplained weight loss or persistent loss of appetite lasting more than two weeks.',
          'Persistent fatigue, pale skin, or shortness of breath (which may require a professional blood test for nutritional deficiencies).',
          'Difficulty swallowing, severe food allergies, or ongoing digestive distress.',
          'Before starting specialized diets or high-dose vitamin supplements, especially during pregnancy or chronic illness.',
        ],
      },
      te: {
        categoryName: 'పోషకాహారం (Nutrition)',
        headline: 'సమతుల్య ఆహారం, రోగనిరోధక శక్తి మరియు పోషకాహార మార్గదర్శకాలు',
        summary:
          'సమతుల్య ఆహారం మన శరీరానికి అవసరమైన శక్తి, ప్రోటీన్లు, విటమిన్లు మరియు ఖనిజాలను అందిస్తుంది. ఇది వ్యాధుల నుండి రక్షణ కల్పించడంలో కీలక పాత్ర పోషిస్తుంది.',
        keyFacts: [
          'ICMR-NIN (హైదరాబాద్) ప్రకారం మన రోజువారీ భోజన పళ్లెంలో సగం భాగం ఆకుకూరలు, కూరగాయలు మరియు తాజా పండ్లతో ఉండాలి.',
          'రాగులు, జొన్నలు, సజ్జలు వంటి చిరుధాన్యాలతో పాటు పప్పుధాన్యాలు, పెరుగు, గుడ్లు, గింజలు వంటి ప్రోటీన్ ఆహారాన్ని తీసుకోవాలి.',
          'ప్యాకెట్ ఆహారాలు, అధిక చక్కెర పానీయాలు మరియు నూనెలో వేయించిన పదార్థాలను తగ్గించాలి. రోజుకు ఉప్పు వినియోగం 5 గ్రాముల లోపు ఉండాలి.',
          'ఆకుకూరలు, బెల్లం, ఖర్జూరం వంటి ఐరన్ ఉన్న ఆహారంతో పాటు నిమ్మరసం, ఉసిరి వంటి విటమిన్-C ఉండే పదార్థాలు తీసుకుంటే రక్తహీనత తగ్గుతుంది.',
        ],
        generalSelfCareAndPrevention: [
          'రోజుకు కనీసం 8 నుండి 10 గ్లాసుల శుభ్రమైన నీరు తాగాలి.',
          'కూరగాయలు మరియు పండ్లను వండే ముందు శుభ్రమైన నీటితో బాగా కడగాలి.',
          'ప్యాక్ చేసిన ఆహార పదార్థాలపై ఉండే పోషక వివరాల లేబుల్‌ను చదివి చక్కెర, ఉప్పు శాతాన్ని గమనించాలి.',
          'ఇంట్లో తాజాగా వండిన ఆహారానికి ప్రాధాన్యత ఇవ్వాలి.',
        ],
        whenToSeeDoctor: [
          'కారణం లేకుండా బరువు తగ్గడం లేదా రెండు వారాల కంటే ఎక్కువగా ఆకలి లేకపోవడం.',
          'తీవ్రమైన నీరసం, అలసట లేదా రక్తహీనత లక్షణాలు కనిపిస్తే డాక్టర్ సలహాతో రక్త పరీక్ష చేయించుకోవాలి.',
          'ఆహారం మింగడంలో ఇబ్బంది లేదా ఏదైనా ఆహారం పడకపోవడం (అలెర్జీ) ఉన్నప్పుడు.',
          'గర్భిణీలు లేదా మధుమేహం/బీపీ ఉన్నవారు ప్రత్యేక డైట్ లేదా విటమిన్ మాత్రలు వాడే ముందు డాక్టర్‌ను సంప్రదించాలి.',
        ],
      },
      hi: {
        categoryName: 'पोषण (Nutrition)',
        headline: 'संतुलित दैनिक आहार, जल सेवन और सूक्ष्म पोषक तत्व',
        summary:
          'संतुलित आहार शरीर को ऊर्जा, प्रोटीन, विटामिन और खनिज प्रदान करता है जो रोग प्रतिरोधक क्षमता बनाए रखने और स्वस्थ जीवन के लिए आवश्यक हैं।',
        keyFacts: [
          'ICMR-NIN के अनुसार, आपकी दैनिक थाली का आधा हिस्सा हरी सब्जियों और मौसमी फलों से भरा होना चाहिए।',
          'साबुत अनाज (रागी, ज्वार, बाजरा, गेहूं) के साथ दालें, दही, चना, अंडे या मेवे जैसे प्रोटीन स्रोतों को शामिल करें।',
          'अत्यधिक प्रसंस्कृत (पैकेज्ड) भोजन, मीठे पेय और अधिक नमक से बचें (WHO के अनुसार प्रतिदिन 5 ग्राम से कम नमक लें)।',
          'आयरन युक्त भोजन (पालक, दालें, गुड़) के साथ विटामिन-सी (नींबू, आंवला) लेने से आयरन का अवशोषण बेहतर होता है।',
        ],
        generalSelfCareAndPrevention: [
          'प्रतिदिन 8 से 10 गिलास स्वच्छ पानी पिएं, विशेषकर गर्मी के मौसम में।',
          'फलों और सब्जियों को पकाने या खाने से पहले साफ बहते पानी से अच्छी तरह धोएं।',
          'पैकेज्ड खाद्य पदार्थों के लेबल पर चीनी और सोडियम की मात्रा अवश्य जांचें।',
          'ताजे घर के बने भोजन को प्राथमिकता दें।',
        ],
        whenToSeeDoctor: [
          'बिना किसी स्पष्ट कारण के वजन कम होना या दो सप्ताह से अधिक समय तक भूख न लगना।',
          'लगातार थकान, त्वचा में पीलापन या कमजोरी महसूस होना (जिसके लिए डॉक्टर की सलाह से जांच आवश्यक हो सकती है)।',
          'भोजन निगलने में कठिनाई या किसी खाद्य पदार्थ से गंभीर एलर्जी होना।',
          'कोई भी विटामिन सप्लीमेंट या विशेष डाइट शुरू करने से पहले चिकित्सक या आहार विशेषज्ञ से सलाह लें।',
        ],
      },
    },
  },
  {
    id: 'mental_wellbeing',
    keywords: [
      'mental wellbeing',
      'mental health',
      'stress',
      'anxiety',
      'sleep',
      'insomnia',
      'sadness',
      'burnout',
      'emotional health',
      'మానసిక ఆరోగ్యం',
      'ఒత్తిడి',
      'నిద్రలేమి',
      'ఆందోళన',
      'मानसिक स्वास्थ्य',
      'तनाव',
      'नींद',
      'चिंता',
    ],
    recommendedServiceType: 'Clinic',
    references: [
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Mental Health: Strengthening Our Response & Stress Management Guide',
        url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response',
        lastReviewed: '2026',
      },
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW) – Tele-MANAS',
        documentTitle: 'National Tele Mental Health Programme (14416 / 1800-891-4416)',
        url: 'https://telemanas.mohfw.gov.in/',
        lastReviewed: '2026',
      },
    ],
    content: {
      en: {
        categoryName: 'Mental Wellbeing',
        headline: 'Supporting Emotional Wellbeing, Sleep Hygiene, and Stress Resilience',
        summary:
          'Mental wellbeing is an integral part of overall health. Managing daily stress, maintaining healthy sleep routines, and staying socially connected help build emotional resilience.',
        keyFacts: [
          'Experiencing temporary stress, worry, or low mood during challenging life events is a normal human response.',
          'Chronic sleep deprivation and prolonged work or academic pressure can affect both physical energy and emotional balance.',
          'In India, the National Tele-MANAS helpline (14416) offers free, confidential 24/7 mental health support in multiple regional languages.',
          'Seeking support from a counselor, psychologist, or healthcare professional is a positive, proactive step—just like visiting a doctor for physical health.',
        ],
        generalSelfCareAndPrevention: [
          'Maintain a consistent sleep schedule of 7 to 8 hours per night and reduce screen exposure 45 minutes before bedtime.',
          'Practice slow, deep breathing exercises (such as box breathing or mindfulness) for 10 minutes daily.',
          'Engage in regular physical movement—such as a 30-minute brisk walk outdoors—and stay connected with trusted family or friends.',
          'Break large overwhelming tasks into smaller, manageable daily steps.',
        ],
        whenToSeeDoctor: [
          'Persistent sadness, anxiety, or emptiness that lasts more than two weeks and interferes with daily work, studies, or relationships.',
          'Severe insomnia, panic episodes, or inability to carry out routine daily self-care.',
          'If you or someone you know experiences thoughts of self-harm or hopelessness, contact emergency services or a crisis helpline (such as Tele-MANAS 14416 or 988) immediately.',
        ],
      },
      te: {
        categoryName: 'మానసిక ఆరోగ్యం (Mental Wellbeing)',
        headline: 'మానసిక ప్రశాంతత, ఒత్తిడి నియంత్రణ మరియు మంచి నిద్ర అలవాట్లు',
        summary:
          'శారీరక ఆరోగ్యంతో పాటు మానసిక ఆరోగ్యం కూడా చాలా ముఖ్యం. రోజువారీ ఒత్తిడిని తగ్గించుకోవడం, తగినంత నిద్ర మరియు కుటుంబ సభ్యులతో మాట్లాడటం మానసిక ఉల్లాసాన్ని ఇస్తాయి.',
        keyFacts: [
          'జీవితంలో ఎదురయ్యే సవాళ్ల వల్ల తాత్కాలికంగా ఒత్తిడి లేదా ఆందోళన కలగడం సహజం.',
          'నిద్ర లేకపోవడం మరియు నిరంతర పని ఒత్తిడి శారీరక మరియు మానసిక ఆరోగ్యంపై ప్రభావం చూపుతాయి.',
          'భారత ప్రభుత్వం ఉచిత 24/7 మానసిక ఆరోగ్య సహాయం కోసం "టెలి-మానస్" (Tele-MANAS: 14416 లేదా 1800-891-4416) హెల్ప్‌లైన్‌ను తెలుగులో కూడా అందిస్తోంది.',
          'మానసిక నిపుణులు లేదా కౌన్సిలర్ సలహా తీసుకోవడం పూర్తిగా సహజమైన మరియు ఆరోగ్యకరమైన విషయం.',
        ],
        generalSelfCareAndPrevention: [
          'ప్రతిరోజూ రాత్రి 7 నుండి 8 గంటల నిద్ర ఉండేలా చూసుకోవాలి మరియు నిద్రకు ముందు మొబైల్/టీవీ వాడకం తగ్గించాలి.',
          'రోజుకు 10 నిమిషాలు ప్రాణాయామం, లోతైన శ్వాస వ్యాయామాలు లేదా ధ్యానం చేయడం అలవాటు చేసుకోవాలి.',
          'ప్రతిరోజూ 30 నిమిషాల నడక లేదా వ్యాయామం చేయాలి మరియు ఆత్మీయులతో మీ భావాలను పంచుకోవాలి.',
          'పెద్ద పనులను చిన్న చిన్న భాగాలుగా విభజించుకుని ప్రశాంతంగా పూర్తి చేయాలి.',
        ],
        whenToSeeDoctor: [
          'రెండు వారాల కంటే ఎక్కువ కాలం పాటు నిరంతర విచారం, ఆందోళన లేదా నిరాశ కొనసాగితే డాక్టర్‌ను సంప్రదించాలి.',
          'తీవ్రమైన నిద్రలేమి లేదా రోజువారీ పనులు చేసుకోలేకపోవడం వంటి లక్షణాలు ఉన్నప్పుడు.',
          'ఎవరికైనా తీవ్రమైన నిరాశ లేదా హానికర ఆలోచనలు వస్తే వెంటనే 14416 (Tele-MANAS) లేదా 112 కు కాల్ చేయాలి.',
        ],
      },
      hi: {
        categoryName: 'मानसिक स्वास्थ्य (Mental Wellbeing)',
        headline: 'मानसिक शांति, तनाव प्रबंधन और अच्छी नींद की आदतें',
        summary:
          'मानसिक स्वास्थ्य संपूर्ण स्वास्थ्य का एक अभिन्न अंग है। दैनिक तनाव को प्रबंधित करना, पर्याप्त नींद लेना और अपनों से जुड़े रहना भावनात्मक मजबूती प्रदान करता है।',
        keyFacts: [
          'जीवन की कठिन परिस्थितियों में अस्थायी तनाव या चिंता महसूस होना एक सामान्य मानवीय प्रतिक्रिया है।',
          'नींद की कमी और लगातार काम का दबाव शारीरिक और मानसिक ऊर्जा दोनों को प्रभावित कर सकता है।',
          'भारत सरकार की राष्ट्रीय टेली-मानस (Tele-MANAS: 14416 / 1800-891-4416) सेवा 24/7 निःशुल्क और गोपनीय परामर्श प्रदान करती है।',
          'मानसिक स्वास्थ्य विशेषज्ञ या काउंसलर से सलाह लेना उतना ही सामान्य और महत्वपूर्ण है जितना शारीरिक स्वास्थ्य के लिए डॉक्टर से मिलना।',
        ],
        generalSelfCareAndPrevention: [
          'प्रतिदिन 7 से 8 घंटे की नियमित नींद लें और सोने से 45 मिनट पहले मोबाइल स्क्रीन से दूरी बनाएं।',
          'रोजाना 10 मिनट गहरी सांस लेने के व्यायाम या ध्यान (मेडिटेशन) का अभ्यास करें।',
          'प्रतिदिन 30 मिनट पैदल चलें या व्यायाम करें और परिवार व मित्रों के साथ संवाद बनाए रखें।',
          'बड़े कार्यों को छोटे और आसान हिस्सों में बांटकर पूरा करें।',
        ],
        whenToSeeDoctor: [
          'यदि लगातार उदासी, चिंता या खालीपन दो सप्ताह से अधिक समय तक बना रहे और दैनिक जीवन को प्रभावित करे।',
          'गंभीर अनिद्रा, घबराहट के दौरे या दैनिक कार्यों को करने में असमर्थता महसूस हो।',
          'गंभीर निराशा या आत्म-नुकसान के विचार आने पर तुरंत आपातकालीन हेल्पलाइन 14416 या 112 पर संपर्क करें।',
        ],
      },
    },
  },
  {
    id: 'first_aid',
    keywords: [
      'first aid',
      'burn',
      'cut',
      'bleeding',
      'wound',
      'sprain',
      'nosebleed',
      'heatstroke',
      'choking',
      'ప్రథమ చికిత్స',
      'గాయం',
      'కాలిన గాయం',
      'రక్తస్రావం',
      'प्राथमिक उपचार',
      'जलना',
      'चोट',
      'खून बहना',
    ],
    recommendedServiceType: 'Emergency Department',
    references: [
      {
        organization: 'World Health Organization (WHO) & International Red Cross',
        documentTitle: 'Basic First Aid Principles for Community Responders',
        url: 'https://www.ifrc.org/our-work/health-and-care/first-aid',
        lastReviewed: '2026',
      },
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW)',
        documentTitle: 'Standard First Aid & Trauma Care Awareness Module',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2025',
      },
    ],
    content: {
      en: {
        categoryName: 'First Aid',
        headline: 'Safe, Evidence-Based First Aid for Minor Injuries and Burns',
        summary:
          'First aid provides immediate, temporary care for minor injuries until professional medical evaluation is obtained. Always prioritize scene safety and avoid harmful home remedies.',
        keyFacts: [
          'For minor burns: Immediately hold the burned area under cool (not ice-cold) running tap water for 10 to 20 minutes.',
          'Never apply toothpaste, butter, oil, turmeric powder, or raw ice directly onto a burn or open wound, as these trap heat and introduce infection.',
          'For minor cuts and scrapes: Wash gently with clean water and mild soap, apply gentle pressure with a clean sterile cloth to stop bleeding, and cover with a clean dressing.',
          'For nosebleeds: Sit upright, lean slightly forward (not backward), and pinch the soft part of the nose for 10–15 minutes.',
        ],
        generalSelfCareAndPrevention: [
          'Keep a stocked home first-aid kit containing sterile gauze, adhesive bandages, antiseptic wipes, ORS packets, and a digital thermometer.',
          'Wash your hands thoroughly with soap and water before touching or dressing any wound.',
          'For minor ankle or wrist sprains, rest the joint, apply a wrapped cold pack for 15 minutes, and keep it gently elevated.',
          'Verify whether tetanus immunization is up to date after any skin puncture or outdoor injury.',
        ],
        whenToSeeDoctor: [
          'Bleeding does not stop after 10 minutes of firm, direct pressure, or the wound is deep, jagged, or caused by a rusty object.',
          'Burns involve the face, hands, feet, joints, or cover a large area, or show blistering and charring.',
          'Animal bites (dog, cat, monkey, snake) require immediate hospital visit for wound washing and official immunization/anti-venom care.',
          'Any head injury accompanied by dizziness, vomiting, confusion, or drowsiness.',
        ],
      },
      te: {
        categoryName: 'ప్రథమ చికిత్స (First Aid)',
        headline: 'చిన్న గాయాలు మరియు కాలిన గాయాలకు సురక్షితమైన ప్రథమ చికిత్స',
        summary:
          'ప్రథమ చికిత్స అనేది డాక్టర్ సహాయం అందే వరకు చేసే తక్షణ ప్రాథమిక సంరక్షణ. గాయాలపై హానికరమైన ఇంటి చిట్కాలను వాడకుండా సరైన పద్ధతులను పాటించాలి.',
        keyFacts: [
          'చిన్న కాలిన గాయాలకు: వెంటనే కాలిన భాగాన్ని చల్లని (ఐస్ నీరు కాకుండా) కుళాయి నీటి కింద 10 నుండి 20 నిమిషాల పాటు ఉంచాలి.',
          'కాలిన గాయాలపై టూత్‌పేస్ట్, నూనె, వెన్న, పసుపు లేదా ఐస్ రుద్దకూడదు; ఇవి వేడిని లోపలే ఉంచి ఇన్ఫెక్షన్ కలిగిస్తాయి.',
          'చిన్న కోతలు/గాయాలకు: శుభ్రమైన నీటితో కడిగి, స్టెరైల్ దూది లేదా శుభ్రమైన గుడ్డతో సున్నితంగా నొక్కి రక్తస్రావాన్ని ఆపి, బ్యాండేజ్ వేయాలి.',
          'ముక్కు నుండి రక్తం వస్తే: నిటారుగా కూర్చుని కొద్దిగా ముందుకు వంగాలి (వెనక్కి వంగకూడదు), ముక్కు మెత్తని భాగాన్ని 10 నిమిషాలు వేళ్లతో పట్టుకోవాలి.',
        ],
        generalSelfCareAndPrevention: [
          'ఇంట్లో ఎప్పుడూ ఫస్ట్-ఎయిడ్ కిట్ (స్టెరైల్ గాజ్, బ్యాండేజీలు, యాంటీసెప్టిక్ లిక్విడ్, ORS ప్యాకెట్లు, థర్మామీటర్) అందుబాటులో ఉంచుకోవాలి.',
          'ఏదైనా గాయాన్ని తాకే ముందు చేతులను సబ్బుతో శుభ్రంగా కడుక్కోవాలి.',
          'ఇనుప వస్తువులు గుచ్చుకున్నప్పుడు టెటనస్ (TT) టీకా అవసరమో లేదో డాక్టర్‌ను అడిగి తెలుసుకోవాలి.',
        ],
        whenToSeeDoctor: [
          '10 నిమిషాల పాటు అదిమి పట్టినా రక్తస్రావం ఆగకపోతే లేదా గాయం లోతుగా ఉంటే వెంటనే ఆసుపత్రికి వెళ్లాలి.',
          'ముఖం, చేతులు, కీళ్లపై కాలిన గాయాలు ఉన్నా లేదా బొబ్బలు ఏర్పడినా డాక్టర్‌ను సంప్రదించాలి.',
          'కుక్క, పిల్లి, కోతి లేదా పాము కాటుకు గురైతే నాటు వైద్యం చేయకుండా తక్షణమే ప్రభుత్వ లేదా సమీప ఆసుపత్రికి వెళ్లాలి.',
          'తలకు దెబ్బ తగిలి తలతిరగడం, వాంతులు లేదా మత్తుగా అనిపిస్తే అత్యవసర విభాగానికి వెళ్లాలి.',
        ],
      },
      hi: {
        categoryName: 'प्राथमिक उपचार (First Aid)',
        headline: 'मामूली चोटों और जलने पर सुरक्षित प्राथमिक उपचार',
        summary:
          'प्राथमिक उपचार चिकित्सकीय सहायता मिलने से पहले दी जाने वाली तत्काल प्रारंभिक देखभाल है। चोट या जलन पर असुरक्षित घरेलू नुस्खों से बचें।',
        keyFacts: [
          'हल्के जलने पर: जले हुए हिस्से को तुरंत 10 से 20 मिनट तक सामान्य ठंडे बहते नल के पानी के नीचे रखें।',
          'जले हुए स्थान या खुले घाव पर टूथपेस्ट, मक्खन, तेल, हल्दी या सीधे बर्फ न लगाएं—इससे संक्रमण का खतरा बढ़ता है।',
          'मामूली कटने या छिलने पर: साफ पानी से धोएं, साफ कपड़े या गॉज से हल्का दबाव देकर खून रोकें और पट्टी बांधें।',
          'नाक से खून आने पर: सीधे बैठें, थोड़ा आगे की ओर झुकें (पीछे नहीं) और नाक के नरम हिस्से को 10–15 मिनट तक दबाकर रखें।',
        ],
        generalSelfCareAndPrevention: [
          'घर में प्राथमिक उपचार किट (स्टेराइल गॉज, बैंडेज, एंटीसेप्टिक, ORS पैकेट, थर्मामीटर) हमेशा तैयार रखें।',
          'किसी भी घाव को छूने से पहले अपने हाथों को साबुन और पानी से अच्छी तरह धोएं।',
          'चोट लगने पर टेटनस (TT) के टीके के बारे में डॉक्टर से सलाह अवश्य लें।',
        ],
        whenToSeeDoctor: [
          '10 मिनट तक दबाव देने के बाद भी खून बहना बंद न हो या घाव गहरा हो।',
          'चेहरे, हाथ, पैर या जोड़ों पर जलन हो या बड़े छाले पड़ गए हों।',
          'कुत्ते, बंदर, बिल्ली या सांप के काटने पर तुरंत निकटतम अस्पताल या सरकारी स्वास्थ्य केंद्र जाएं।',
          'सिर में चोट लगने के बाद चक्कर आना, उल्टी या बेहोशी महसूस हो।',
        ],
      },
    },
  },
  {
    id: 'common_illnesses',
    keywords: [
      'common illnesses',
      'cold',
      'cough',
      'sore throat',
      'flu',
      'diarrhea',
      'stomach ache',
      'headache',
      'seasonal allergy',
      'జలుబు',
      'దగ్గు',
      'గొంతు నొప్పి',
      'విరేచనాలు',
      'सर्दी',
      'खांसी',
      'गले में खराश',
      'दस्त',
    ],
    recommendedServiceType: 'Clinic',
    references: [
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Pocket Book of Primary Health Care for Common Respiratory & GI Illnesses',
        url: 'https://www.who.int/',
        lastReviewed: '2026',
      },
      {
        organization: 'Indian Council of Medical Research (ICMR)',
        documentTitle: 'Antimicrobial Stewardship: Avoiding Unnecessary Antibiotics in Viral Cold & Cough',
        url: 'https://www.icmr.gov.in/',
        lastReviewed: '2025',
      },
    ],
    content: {
      en: {
        categoryName: 'Common Illnesses',
        headline: 'Navigating Seasonal Cold, Cough, Sore Throat, and Mild Stomach Upset',
        summary:
          'Most seasonal colds, mild coughs, and sore throats are caused by viruses and resolve naturally with rest and hydration. Understanding safe supportive care helps avoid unnecessary antibiotic misuse.',
        keyFacts: [
          'Antibiotics only work against bacteria—they do NOT cure viral colds, seasonal flu, or simple viral sore throats.',
          'For acute watery diarrhea, the single most critical supportive measure recommended by WHO is immediate fluid replacement using WHO-formulated Oral Rehydration Salts (ORS).',
          'Respiratory droplets spread easily in crowded spaces; covering coughs and handwashing protect household members.',
        ],
        generalSelfCareAndPrevention: [
          'Sip warm fluids, herbal teas, or warm water with a pinch of salt for soothing throat irritation (gargling).',
          'Use steam inhalation cautiously or a cool-mist humidifier to ease nasal congestion.',
          'During mild stomach upset or diarrhea, take frequent sips of prepared ORS and eat light, easily digestible foods (rice gruel, curd rice, banana).',
          'Wash hands frequently with soap for at least 20 seconds.',
        ],
        whenToSeeDoctor: [
          'Cough lasts more than 2 weeks (which requires evaluation at a clinic or government hospital, including screening for chronic respiratory conditions).',
          'Shortness of breath, wheezing, chest pain, or coughing up blood-tinged mucus.',
          'Signs of dehydration during diarrhea: very dry mouth, sunken eyes, dark/reduced urine, or dizziness when standing.',
          'High persistent fever accompanying a sore throat or ear pain.',
        ],
      },
      te: {
        categoryName: 'సాధారణ వ్యాధులు (Common Illnesses)',
        headline: 'జలుబు, దగ్గు, గొంతు నొప్పి మరియు విరేచనాలకు సాధారణ జాగ్రత్తలు',
        summary:
          'సాధారణ జలుబు, దగ్గు మరియు గొంతు నొప్పి ఎక్కువగా వైరస్ వల్ల వస్తాయి. తగినంత విశ్రాంతి మరియు ద్రవ పదార్థాలతో ఇవి తగ్గుముఖం పడతాయి.',
        keyFacts: [
          'వైరల్ జలుబు మరియు సాధారణ దగ్గుకు యాంటీబయాటిక్స్ పనిచేయవు; డాక్టర్ సలహా లేకుండా యాంటీబయాటిక్స్ వాడకూడదు.',
          'విరేచనాలు (Diarrhea) అయినప్పుడు శరీరంలో నీరు, లవణాలు తగ్గకుండా WHO సూచించిన ORS ద్రావణం తాగడం అత్యంత ముఖ్యం.',
          'దగ్గినప్పుడు లేదా తుమ్మినప్పుడు చేతి రుమాలు అడ్డుపెట్టుకోవడం మరియు చేతులు కడుక్కోవడం వల్ల ఇతరులకు వ్యాపించదు.',
        ],
        generalSelfCareAndPrevention: [
          'గొంతు నొప్పికి గోరువెచ్చని నీటిలో చిటికెడు ఉప్పు వేసి పుక్కిలించడం (Gargling) ఉపశమనాన్ని ఇస్తుంది.',
          'ముక్కు దిబ్బడగా ఉన్నప్పుడు గోరువెచ్చని నీటి ఆవిరి పట్టడం సహాయపడుతుంది.',
          'విరేచనాలు ఉన్నప్పుడు ORS ద్రావణంతో పాటు మజ్జిగ అన్నం, జావ, అరటిపండు వంటి తేలికగా జీర్ణమయ్యే ఆహారం తీసుకోవాలి.',
        ],
        whenToSeeDoctor: [
          'దగ్గు 2 వారాల కంటే ఎక్కువ రోజులు కొనసాగితే సమీప ప్రభుత్వ ఆసుపత్రి లేదా క్లినిక్‌లో పరీక్ష చేయించుకోవాలి.',
          'శ్వాస తీసుకోవడంలో ఇబ్బంది, ఛాతీ నొప్పి లేదా కఫంలో రక్తం కనిపిస్తే వెంటనే డాక్టర్‌ను కలవాలి.',
          'విరేచనాలతో పాటు తీవ్రమైన దాహం, మూత్రం తగ్గడం, కళ్లు లోతుకు పోవడం లేదా తలతిరగడం వంటి డీహైడ్రేషన్ లక్షణాలు కనిపిస్తే ఆసుపత్రికి వెళ్లాలి.',
        ],
      },
      hi: {
        categoryName: 'सामान्य बीमारियां (Common Illnesses)',
        headline: 'मौसमी सर्दी, खांसी, गले में खराश और पेट खराब होने पर देखभाल',
        summary:
          'अधिकांश मौसमी सर्दी, खांसी और गले की खराश वायरल संक्रमण के कारण होती हैं और आराम तथा तरल पदार्थों से ठीक हो जाती हैं।',
        keyFacts: [
          'एंटीबायोटिक दवाएं वायरल सर्दी या फ्लू पर काम नहीं करती हैं; बिना डॉक्टर की सलाह के एंटीबायोटिक न लें।',
          'दस्त (Diarrhea) होने पर शरीर में पानी की कमी रोकने के लिए WHO द्वारा अनुशंसित ORS घोल सबसे महत्वपूर्ण उपाय है।',
          'खांसते या छींकते समय मुंह ढकना और बार-बार हाथ धोना संक्रमण को फैलने से रोकता है।',
        ],
        generalSelfCareAndPrevention: [
          'गले में खराश होने पर गुनगुने पानी में चुटकी भर नमक डालकर गरारे करें और गर्म तरल पदार्थ पिएं।',
          'नाक बंद होने पर सावधानी से भाप (Steam) लेना आराम दे सकता है।',
          'पेट खराब होने पर ORS का घोल थोड़ी-थोड़ी देर में पिएं और खिचड़ी, दही-चावल या केला जैसा हल्का भोजन लें।',
        ],
        whenToSeeDoctor: [
          'यदि खांसी 2 सप्ताह से अधिक समय तक बनी रहे, तो तुरंत नजदीकी स्वास्थ्य केंद्र में जांच कराएं।',
          'सांस फूलना, सीने में दर्द या बलगम में खून आना।',
          'दस्त के दौरान अत्यधिक प्यास, पेशाब कम होना, चक्कर आना या सुस्ती जैसे डिहाइड्रेशन के लक्षण दिखें।',
        ],
      },
    },
  },
  {
    id: 'vaccination',
    keywords: [
      'vaccination',
      'vaccine',
      'immunization',
      'polio',
      'tetanus',
      'measles',
      'hepatitis',
      'hpv',
      'flu shot',
      'టీకా',
      'వ్యాక్సిన్',
      'ఇమ్యునైజేషన్',
      'टीकाकरण',
      'टीका',
      'वैक्सीन',
    ],
    recommendedServiceType: 'Government Hospital',
    references: [
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW), Govt. of India',
        documentTitle: 'Universal Immunization Programme (UIP) & Mission Indradhanush Schedule',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2026',
      },
      {
        organization: 'World Health Organization (WHO) & UNICEF',
        documentTitle: 'Vaccines and Immunization: What You Need to Know',
        url: 'https://www.who.int/health-topics/vaccines-and-immunization',
        lastReviewed: '2026',
      },
    ],
    content: {
      en: {
        categoryName: 'Vaccination',
        headline: 'Routine Immunization Schedules and Life-Course Protection',
        summary:
          'Vaccines safely train your immune system to recognize and fight serious infectious diseases before they can cause severe illness or complications.',
        keyFacts: [
          'India’s Universal Immunization Programme (UIP) provides essential vaccines free of cost at Government Hospitals, Primary Health Centres (PHCs), and Anganwadi sessions.',
          'Core childhood vaccines protect against Tuberculosis (BCG), Polio (OPV/IPV), Hepatitis B, Diphtheria, Pertussis, Tetanus, Hib, Rotavirus, Pneumococcal disease, and Measles-Rubella (MR).',
          'Pregnant women are advised to receive Tetanus and adult Diphtheria (Td) immunization as guided by their antenatal care provider.',
          'Mild soreness at the injection site or a low-grade fever for 24–48 hours after vaccination is a common, expected immune response.',
        ],
        generalSelfCareAndPrevention: [
          'Keep your family’s physical or digital immunization card (such as U-WIN or Mother & Child Protection card) safe and bring it to every clinic visit.',
          'If a scheduled vaccine dose is missed, consult your local health worker or pediatrician—you usually do not need to restart the entire series.',
          'Continue breastfeeding infants normally after vaccination and keep them comfortable.',
        ],
        whenToSeeDoctor: [
          'High fever, persistent crying for more than 3 hours in an infant, or unusual lethargy after a vaccine.',
          'Signs of an immediate allergic reaction (swelling of face/lips, hives, or difficulty breathing) shortly after immunization.',
          'To plan adult booster vaccines (such as Tetanus, Influenza, Hepatitis B, or HPV) based on age and occupation.',
        ],
      },
      te: {
        categoryName: 'టీకాలు (Vaccination)',
        headline: 'సార్వత్రిక టీకా కార్యక్రమం మరియు వ్యాధుల నుండి రక్షణ',
        summary:
          'టీకాలు (వ్యాక్సిన్లు) ప్రాణాంతక అంటువ్యాధుల నుండి మన శరీరానికి రక్షణ కల్పిస్తాయి. ప్రభుత్వ ఆసుపత్రులు మరియు ప్రాథమిక ఆరోగ్య కేంద్రాలలో (PHC) ముఖ్యమైన టీకాలు ఉచితంగా వేయబడతాయి.',
        keyFacts: [
          'భారత ప్రభుత్వ యూనివర్సల్ ఇమ్యునైజేషన్ ప్రోగ్రామ్ (UIP) కింద BCG, పోలియో, హెపటైటిస్-B, పెంటావాలెంట్, రోటావైరస్ మరియు మీజిల్స్-రుబెల్లా (MR) టీకాలు ఉచితంగా అందిస్తారు.',
          'గర్భిణీ స్త్రీలకు వైద్యుల సూచన మేరకు Td (టెటనస్ & డిఫ్తీరియా) టీకాలు వేస్తారు.',
          'టీకా వేసిన చోట స్వల్ప నొప్పి లేదా ఒక రోజు పాటు తేలికపాటి జ్వరం రావడం సాధారణమే.',
        ],
        generalSelfCareAndPrevention: [
          'పిల్లల ఇమ్యునైజేషన్ కార్డును (MCP కార్డు / U-WIN) భద్రంగా ఉంచుకుని ప్రతిసారి ఆసుపత్రికి తీసుకెళ్లాలి.',
          'ఏదైనా టీకా సమయానికి వేయించడం మర్చిపోతే, వెంటనే సమీప ఆరోగ్య కార్యకర్త (ANM/ASHA) లేదా పిల్లల డాక్టర్‌ను సంప్రదించాలి.',
          'టీకా వేసిన తర్వాత పసిపిల్లలకు తల్లిపాలు సాధారణంగానే పట్టాలి.',
        ],
        whenToSeeDoctor: [
          'టీకా వేసిన తర్వాత తీవ్రమైన జ్వరం, శిశువు 3 గంటల కంటే ఎక్కువసేపు ఆపకుండా ఏడవడం లేదా నీరసంగా ఉండటం.',
          'ముఖం వాపు, దద్దుర్లు లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది వంటి అలెర్జీ లక్షణాలు కనిపిస్తే వెంటనే ఆసుపత్రికి వెళ్లాలి.',
        ],
      },
      hi: {
        categoryName: 'टीकाकरण (Vaccination)',
        headline: 'नियमित टीकाकरण अनुसूची और गंभीर रोगों से सुरक्षा',
        summary:
          'टीके (वैक्सीन) आपके शरीर की रोग प्रतिरोधक क्षमता को गंभीर संक्रामक बीमारियों से लड़ने के लिए सुरक्षित रूप से तैयार करते हैं।',
        keyFacts: [
          'भारत के सार्वभौमिक टीकाकरण कार्यक्रम (UIP) के तहत सरकारी अस्पतालों और प्राथमिक स्वास्थ्य केंद्रों (PHC) में आवश्यक टीके निःशुल्क लगाए जाते हैं।',
          'बच्चों के प्रमुख टीकों में BCG, पोलियो, हेपेटाइटिस-B, पेंटावैलेंट, रोटावायरस और खसरा-रूबेला (MR) शामिल हैं।',
          'टीका लगने के बाद इंजेक्शन वाली जगह पर हल्का दर्द या 1-2 दिन हल्का बुखार आना एक सामान्य प्रक्रिया है।',
        ],
        generalSelfCareAndPrevention: [
          'अपने बच्चे का टीकाकरण कार्ड (MCP कार्ड / U-WIN) सुरक्षित रखें और हर बार स्वास्थ्य केंद्र ले जाएं।',
          'यदि कोई टीका समय पर छूट गया हो, तो नजदीकी आशा/ANM कार्यकर्ता या बाल रोग विशेषज्ञ से मिलकर अगली खुराक लगवाएं।',
          'टीकाकरण के बाद शिशु को सामान्य रूप से स्तनपान कराना जारी रखें।',
        ],
        whenToSeeDoctor: [
          'टीका लगने के बाद बहुत तेज़ बुखार हो या बच्चा 3 घंटे से अधिक समय तक लगातार रोता रहे।',
          'चेहरे पर सूजन, सांस लेने में तकलीफ या तेज़ एलर्जी के लक्षण दिखने पर तुरंत डॉक्टर से संपर्क करें।',
        ],
      },
    },
  },
  {
    id: 'womens_health',
    keywords: [
      'womens health',
      'pregnancy',
      'maternal',
      'menstrual',
      'periods',
      'anemia',
      'breast screening',
      'cervical',
      'prenatal',
      'మహిళల ఆరోగ్యం',
      'గర్భిణీ',
      'నెలసరి',
      'రక్తహీనత',
      'महिला स्वास्थ्य',
      'गर्भावस्था',
      'मासिक धर्म',
      'एनीमिया',
    ],
    recommendedServiceType: 'Government Hospital',
    references: [
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Maternal, Reproductive, and Women’s Health Guidelines',
        url: 'https://www.who.int/health-topics/women-s-health',
        lastReviewed: '2026',
      },
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW), Govt. of India',
        documentTitle: 'Surakshit Matritva Aashwasan (SUMAN) & Anemia Mukt Bharat Guidelines',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2026',
      },
    ],
    content: {
      en: {
        categoryName: "Women's Health",
        headline: 'Menstrual Hygiene, Maternal Care, Nutrition, and Preventive Screenings',
        summary:
          'Women have unique nutritional and preventive healthcare needs across adolescence, reproductive years, pregnancy, and menopause. Early routine checkups support lifelong health.',
        keyFacts: [
          'Iron and folic acid nutrition is vital for adolescent girls and women to prevent nutritional anemia and chronic fatigue.',
          'During pregnancy, WHO and MoHFW recommend at least 4 to 8 scheduled Antenatal Care (ANC) checkups to monitor blood pressure, hemoglobin, and fetal growth.',
          'Routine preventive screenings—including clinical breast examinations and cervical health screenings after age 30—help detect changes early.',
          'Safe menstrual hygiene includes using clean sanitary pads or boiled/sanitized reusable cloths and changing them every 4 to 6 hours.',
        ],
        generalSelfCareAndPrevention: [
          'Include iron-, calcium-, and protein-rich foods (milk, curd, ragi, leafy vegetables, pulses, nuts) in daily meals.',
          'Maintain menstrual hygiene by washing with clean water and drying undergarments in direct sunlight.',
          'Register pregnancies early at your local health center or hospital for scheduled checkups and maternal support.',
        ],
        whenToSeeDoctor: [
          'Danger signs during pregnancy: severe headache, blurred vision, swelling of face/hands, vaginal bleeding, high fever, or reduced fetal movement.',
          'Unusually heavy, prolonged, or severely painful menstrual bleeding, or bleeding between periods or after menopause.',
          'Any new lump, skin dimpling, or unusual discharge noticed in the breast.',
        ],
      },
      te: {
        categoryName: 'మహిళల ఆరోగ్యం (Women’s Health)',
        headline: 'నెలసరి పరిశుభ్రత, గర్భిణీ సంరక్షణ మరియు మహిళల పోషకాహారం',
        summary:
          'కౌమారదశ నుండి గర్భధారణ మరియు మెనోపాజ్ వరకు మహిళలకు ప్రత్యేక పోషకాహారం మరియు ముందస్తు ఆరోగ్య పరీక్షలు ఎంతో అవసరం.',
        keyFacts: [
          'రక్తహీనత (Anemia) నివారించడానికి కిశోర బాలికలు మరియు మహిళలకు ఐరన్, ఫోలిక్ యాసిడ్ మరియు కాల్షియం ఉన్న ఆహారం చాలా ముఖ్యం.',
          'గర్భధారణ సమయంలో తల్లి మరియు బిడ్డ ఆరోగ్యం కోసం కనీసం 4 నుండి 8 సార్లు వైద్య పరీక్షలు (ANC Checkups) చేయించుకోవాలి.',
          '30 ఏళ్లు దాటిన మహిళలు క్రమం తప్పకుండా రొమ్ము మరియు గర్భాశయ ముఖద్వార (Cervical) స్క్రీనింగ్ పరీక్షల గురించి డాక్టర్ సలహా తీసుకోవాలి.',
        ],
        generalSelfCareAndPrevention: [
          'రోజువారీ ఆహారంలో రాగులు, ఆకుకూరలు, పప్పులు, పాలు, పెరుగు, బెల్లం మరియు పండ్లను చేర్చుకోవాలి.',
          'నెలసరి సమయంలో శుభ్రమైన శానిటరీ ప్యాడ్లను ఉపయోగించాలి మరియు ప్రతి 4-6 గంటలకు మార్చాలి.',
          'గర్భం దాల్చిన వెంటనే సమీప ప్రభుత్వ ఆరోగ్య కేంద్రం లేదా ఆసుపత్రిలో నమోదు చేసుకోవాలి.',
        ],
        whenToSeeDoctor: [
          'గర్భిణీలలో ప్రమాద లక్షణాలు: తీవ్రమైన తలనొప్పి, చూపు మసకబారడం, ముఖం/చేతుల వాపు, రక్తస్రావం లేదా శిశువు కదలికలు తగ్గడం.',
          'నెలసరి సమయంలో అధిక రక్తస్రావం, భరించలేని కడుపునొప్పి లేదా మెనోపాజ్ తర్వాత రక్తస్రావం కనిపించడం.',
          'రొమ్ములో ఏదైనా కొత్త గడ్డ లేదా మార్పు కనిపిస్తే వెంటనే గైనకాలజిస్ట్ లేదా డాక్టర్‌ను కలవాలి.',
        ],
      },
      hi: {
        categoryName: 'महिला स्वास्थ्य (Women’s Health)',
        headline: 'मासिक धर्म स्वच्छता, मातृ देखभाल और निवारक स्वास्थ्य जांच',
        summary:
          'किशोरावस्था, गर्भावस्था और रजोनिवृत्ति (मेनोपॉज) के दौरान महिलाओं को विशेष पोषण और नियमित स्वास्थ्य जांच की आवश्यकता होती है।',
        keyFacts: [
          'एनीमिया (खून की कमी) से बचाव के लिए आयरन, फोलिक एसिड और कैल्शियम युक्त आहार अत्यंत आवश्यक है।',
          'गर्भावस्था के दौरान मां और शिशु की सुरक्षा के लिए कम से कम 4 से 8 बार प्रसवपूर्व जांच (ANC Checkups) करानी चाहिए।',
          '30 वर्ष की आयु के बाद नियमित स्तन और सर्वाइकल स्वास्थ्य जांच से बीमारियों की समय पर पहचान संभव होती है।',
        ],
        generalSelfCareAndPrevention: [
          'अपने दैनिक आहार में हरी पत्तेदार सब्जियां, दालें, रागी, दूध, दही और मौसमी फल शामिल करें।',
          'मासिक धर्म के दौरान स्वच्छ सैनिटरी पैड का उपयोग करें और हर 4 से 6 घंटे में बदलें।',
          'गर्भावस्था का पता चलते ही नजदीकी स्वास्थ्य केंद्र या अस्पताल में पंजीकरण कराएं।',
        ],
        whenToSeeDoctor: [
          'गर्भावस्था में खतरे के संकेत: तेज सिरदर्द, धुंधला दिखना, चेहरे या हाथों में सूजन, रक्तस्राव या शिशु की हलचल कम होना।',
          'मासिक धर्म के दौरान अत्यधिक रक्तस्राव, असहनीय दर्द या अनियमितता होना।',
          'स्तन में कोई नई गांठ या असामान्य बदलाव महसूस होने पर तुरंत डॉक्टर से परामर्श लें।',
        ],
      },
    },
  },
  {
    id: 'childrens_health',
    keywords: [
      'childrens health',
      'child',
      'baby',
      'infant',
      'pediatric',
      'growth',
      'breastfeeding',
      'newborn',
      'పిల్లల ఆరోగ్యం',
      'శిశువు',
      'తల్లిపాలు',
      'बच्चों का स्वास्थ्य',
      'शिशु',
      'स्तनपान',
    ],
    recommendedServiceType: 'Hospital',
    references: [
      {
        organization: 'World Health Organization (WHO) & UNICEF',
        documentTitle: 'Infant and Young Child Feeding & Integrated Management of Childhood Illness',
        url: 'https://www.who.int/health-topics/child-health',
        lastReviewed: '2026',
      },
      {
        organization: 'Indian Academy of Pediatrics (IAP) & MoHFW',
        documentTitle: 'Parental Guidelines for Child Growth, Nutrition, and Warning Signs',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2025',
      },
    ],
    content: {
      en: {
        categoryName: "Children's Health",
        headline: 'Early Childhood Nutrition, Growth Milestones, and Pediatric Safety',
        summary:
          'The first years of life lay the foundation for physical growth and brain development. Exclusive breastfeeding for the first 6 months, timely complementary feeding, and routine immunization protect children.',
        keyFacts: [
          'WHO and UNICEF recommend exclusive breastfeeding for the first 6 months of life—no other food, water, or honey is needed.',
          'From 6 months onward, introduce soft, nutrient-dense home-cooked complementary foods while continuing breastfeeding up to 2 years or beyond.',
          'Young children breathe faster than adults; fast breathing or chest indrawing during a cough is a key sign that requires prompt medical evaluation.',
        ],
        generalSelfCareAndPrevention: [
          'Track your child’s height, weight, and developmental milestones regularly using the Mother & Child Protection (MCP) growth chart.',
          'Ensure safe drinking water and handwashing before preparing baby food or feeding.',
          'Keep medicines, cleaning liquids, button batteries, and small choking hazards strictly out of children’s reach.',
        ],
        whenToSeeDoctor: [
          'Danger signs in any newborn or child: inability to breastfeed or drink, vomiting everything, convulsions, fast/difficult breathing, or unusual sleepiness.',
          'Any fever in a baby younger than 3 months old.',
          'Signs of dehydration during diarrhea or fever: no wet diapers for 6+ hours, crying without tears, or sunken soft spot (fontanelle).',
        ],
      },
      te: {
        categoryName: 'పిల్లల ఆరోగ్యం (Children’s Health)',
        headline: 'శిశు పోషణ, ఎదుగుదల మరియు పిల్లల ఆరోగ్య సంరక్షణ',
        summary:
          'మొదటి 6 నెలలు కేవలం తల్లిపాలు మాత్రమే ఇవ్వడం, ఆ తర్వాత పోషకాహారం మరియు సకాలంలో టీకాలు వేయించడం పిల్లల శారీరక, మానసిక ఎదుగుదలకు పునాది.',
        keyFacts: [
          'WHO మరియు UNICEF ప్రకారం పుట్టినప్పటి నుండి 6 నెలల వరకు శిశువుకు తల్లిపాలు మాత్రమే ఇవ్వాలి (నీరు, తేనె వంటివి ఇవ్వకూడదు).',
          '6 నెలల తర్వాత తల్లిపాలతో పాటు మెత్తగా వండిన పోషకాహారం (అన్నం, పప్పు, కూరగాయల గుజ్జు, రాగి జావ) అలవాటు చేయాలి.',
          'పిల్లలలో దగ్గుతో పాటు వేగంగా శ్వాస తీసుకోవడం లేదా డొక్కలు ఎగరేయడం కనిపిస్తే అది న్యుమోనియా సంకేతం కావచ్చు—వెంటనే డాక్టర్‌కు చూపించాలి.',
        ],
        generalSelfCareAndPrevention: [
          'పిల్లల బరువు మరియు ఎత్తును ప్రతి నెలా గ్రోత్ చార్ట్‌లో నమోదు చేస్తూ పరిశీలించాలి.',
          'పిల్లలకు ఆహారం తినిపించే ముందు చేతులను సబ్బుతో శుభ్రంగా కడుక్కోవాలి.',
          'మందులు, నాణేలు, చిన్న బొమ్మలు మరియు క్లీనింగ్ లిక్విడ్లను పిల్లలకు అందకుండా భద్రపరచాలి.',
        ],
        whenToSeeDoctor: [
          'శిశువు పాలు తాగలేకపోవడం, తిన్నది ప్రతిదీ వాంతి చేసుకోవడం, ఫిట్స్ రావడం లేదా బాగా నీరసంగా ఉండటం.',
          '3 నెలల లోపు పసిపిల్లలకు జ్వరం రావడం.',
          '6 గంటలకు పైగా మూత్రం పోయకపోవడం లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది కనిపించడం.',
        ],
      },
      hi: {
        categoryName: 'बच्चों का स्वास्थ्य (Children’s Health)',
        headline: 'शिशु पोषण, विकास के चरण और बाल सुरक्षा',
        summary:
          'जीवन के शुरुआती वर्ष बच्चे के शारीरिक और मानसिक विकास की नींव रखते हैं। पहले 6 महीने केवल स्तनपान और समय पर टीकाकरण बच्चों को बीमारियों से बचाता है।',
        keyFacts: [
          'WHO और UNICEF के अनुसार जन्म से पहले 6 महीने तक शिशु को केवल मां का दूध ही पिलाना चाहिए (पानी या शहद भी नहीं)।',
          '6 महीने पूरे होने के बाद स्तनपान के साथ-साथ घर का बना नरम और पौष्टिक पूरक आहार (दाल का पानी, खिचड़ी, मसला हुआ केला) शुरू करें।',
          'खांसी के साथ तेज़ सांस चलना या पसली चलना गंभीर संक्रमण का संकेत हो सकता है, जिसके लिए तुरंत डॉक्टर को दिखाना आवश्यक है।',
        ],
        generalSelfCareAndPrevention: [
          'बच्चे के वजन और लंबाई की नियमित जांच स्वास्थ्य कार्ड के माध्यम से कराते रहें।',
          'बच्चे को खाना खिलाने से पहले अपने और बच्चे के हाथ साबुन से धोएं।',
          'दवाइयों, छोटे सिक्कों, बैटरी और सफाई के रसायनों को बच्चों की पहुंच से दूर रखें।',
        ],
        whenToSeeDoctor: [
          'खतरे के संकेत: बच्चा दूध न पी पा रहा हो, हर चीज की उल्टी कर रहा हो, दौरे (झटके) आ रहे हों या अत्यधिक सुस्त हो।',
          '3 महीने से छोटे शिशु को बुखार आना।',
          'तेज़ सांस चलना या 6 घंटे से अधिक समय तक पेशाब न करना।',
        ],
      },
    },
  },
  {
    id: 'preventive_healthcare',
    keywords: [
      'preventive healthcare',
      'checkup',
      'screening',
      'blood pressure',
      'diabetes',
      'hypertension',
      'exercise',
      'hygiene',
      'mosquito',
      'dengue prevention',
      'నివారణ ఆరోగ్యం',
      'బీపీ',
      'షుగర్',
      'వ్యాయామం',
      'निवारक स्वास्थ्य',
      'ब्लड प्रेशर',
      'मधुमेह',
      'जांच',
    ],
    recommendedServiceType: 'Diagnostic Center',
    references: [
      {
        organization: 'World Health Organization (WHO)',
        documentTitle: 'Preventing Noncommunicable Diseases (NCDs) & Physical Activity Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases',
        lastReviewed: '2026',
      },
      {
        organization: 'Ministry of Health & Family Welfare (MoHFW) – NP-NCD',
        documentTitle: 'National Programme for Prevention and Control of Non-Communicable Diseases',
        url: 'https://main.mohfw.gov.in/',
        lastReviewed: '2026',
      },
    ],
    content: {
      en: {
        categoryName: 'Preventive Healthcare',
        headline: 'Routine Screenings, Lifestyle Habits, and Disease Prevention',
        summary:
          'Preventive healthcare focuses on staying healthy and detecting silent conditions—such as high blood pressure or elevated blood sugar—early through regular screenings and daily healthy habits.',
        keyFacts: [
          'High blood pressure (hypertension) and early Type 2 diabetes often have NO obvious symptoms for years; periodic screening after age 30 is recommended under India’s NP-NCD guidelines.',
          'WHO recommends at least 150 minutes of moderate physical activity (such as brisk walking or cycling) per week for adults.',
          'Avoiding tobacco in all forms (smoking and smokeless/chewing tobacco) and limiting alcohol significantly reduces cardiovascular and cancer risks.',
          'Preventing mosquito breeding around homes (emptying stagnant water in coolers, pots, and tires weekly) protects communities from dengue and malaria.',
        ],
        generalSelfCareAndPrevention: [
          'Check your blood pressure and fasting blood glucose periodically at a nearby clinic, diagnostic center, or Ayushman Arogya Mandir / Health & Wellness Centre.',
          'Practice daily hand hygiene, drink safe water, and use mosquito nets or repellents during monsoon seasons.',
          'Schedule regular dental and eye checkups every 12 months.',
        ],
        whenToSeeDoctor: [
          'If a routine screening shows elevated blood pressure (e.g., ≥140/90 mmHg) or elevated blood sugar—Always consult a doctor for proper confirmation before taking any medication.',
          'If you have a strong family history of heart disease, diabetes, or cancer and want a personalized screening schedule.',
          'Unexplained fatigue, frequent urination, excessive thirst, or slow-healing sores.',
        ],
      },
      te: {
        categoryName: 'నివారణ ఆరోగ్య సంరక్షణ (Preventive Healthcare)',
        headline: 'ముందస్తు ఆరోగ్య పరీక్షలు, జీవనశైలి మార్పులు మరియు వ్యాధుల నివారణ',
        summary:
          'వ్యాధులు రాకముందే నివారించడం మరియు అధిక రక్తపోటు (BP), మధుమేహం (Sugar) వంటి నిశ్శబ్ద సమస్యలను ప్రాథమిక దశలోనే గుర్తించడం నివారణ ఆరోగ్య సంరక్షణ ముఖ్య ఉద్దేశ్యం.',
        keyFacts: [
          'అధిక రక్తపోటు (BP) మరియు ప్రారంభ దశ షుగర్ వ్యాధికి బయటకు ఎలాంటి లక్షణాలు కనిపించకపోవచ్చు; కాబట్టి 30 ఏళ్లు దాటిన ప్రతి ఒక్కరూ క్రమం తప్పకుండా పరీక్షలు చేయించుకోవాలి.',
          'WHO ప్రకారం పెద్దలు వారానికి కనీసం 150 నిమిషాలు (రోజుకు 30 నిమిషాలు) వేగంగా నడవడం లేదా వ్యాయామం చేయాలి.',
          'పొగాకు (ధూమపానం, గుట్కా) మరియు మద్యానికి దూరంగా ఉండటం వల్ల గుండె జబ్బులు, క్యాన్సర్ ముప్పు తగ్గుతుంది.',
          'ఇంటి పరిసరాల్లో నీరు నిల్వ ఉండకుండా చూసుకోవడం ద్వారా డెంగ్యూ, మలేరియా దోమలను నివారించవచ్చు.',
        ],
        generalSelfCareAndPrevention: [
          'సమీప ప్రభుత్వ ఆరోగ్య కేంద్రం (ఆయుష్మాన్ ఆరోగ్య మందిర్), క్లినిక్ లేదా డయాగ్నస్టిక్ సెంటర్‌లో BP మరియు షుగర్ పరీక్షలు చేయించుకోవాలి.',
          'వర్షాకాలంలో కాచి చల్లార్చిన నీరు తాగాలి మరియు దోమతెరలు వాడాలి.',
          'సంవత్సరానికి ఒకసారి కంటి మరియు దంత పరీక్షలు చేయించుకోవడం మంచిది.',
        ],
        whenToSeeDoctor: [
          'సాధారణ పరీక్షలో BP లేదా షుగర్ ఎక్కువగా ఉన్నట్లు తేలితే, సొంతంగా మందులు వాడకుండా డాక్టర్‌ను సంప్రదించి నిర్ధారణ చేసుకోవాలి.',
          'విపరీతమైన దాహం, తరచుగా మూత్ర విసర్జన, గాయాలు త్వరగా మానకపోవడం లేదా అలసట ఉన్నప్పుడు.',
        ],
      },
      hi: {
        categoryName: 'निवारक स्वास्थ्य देखभाल (Preventive Healthcare)',
        headline: 'नियमित स्वास्थ्य जांच, स्वस्थ जीवनशैली और रोगों से बचाव',
        summary:
          'निवारक स्वास्थ्य देखभाल का उद्देश्य स्वस्थ रहना और उच्च रक्तचाप (BP) या मधुमेह (Sugar) जैसी समस्याओं को नियमित जांच के माध्यम से शुरुआती चरण में ही पहचानना है।',
        keyFacts: [
          'उच्च रक्तचाप और प्रारंभिक मधुमेह के अक्सर कोई बाहरी लक्षण नहीं होते; इसलिए 30 वर्ष की आयु के बाद नियमित जांच की सलाह दी जाती है।',
          'WHO वयस्कों के लिए सप्ताह में कम से कम 150 मिनट मध्यम शारीरिक गतिविधि (जैसे तेज़ चलना या योग) की सिफारिश करता है।',
          'तंबाकू (धूम्रपान और गुटखा) तथा शराब से दूरी हृदय रोग और कैंसर के जोखिम को बहुत कम करती है।',
          'घर के आसपास कूलर, गमलों या टायरों में पानी जमा न होने दें ताकि डेंगू और मलेरिया के मच्छर न पनपें।',
        ],
        generalSelfCareAndPrevention: [
          'नजदीकी आयुष्मान आरोग्य मंदिर, क्लिनिक या डायग्नोस्टिक सेंटर में नियमित अंतराल पर BP और शुगर की जांच कराएं।',
          'हाथों की स्वच्छता बनाए रखें, सुरक्षित पानी पिएं और मच्छरदानी का प्रयोग करें।',
          'वर्ष में एक बार आंखों और दांतों की जांच अवश्य कराएं।',
        ],
        whenToSeeDoctor: [
          'यदि जांच में ब्लड प्रेशर या ब्लड शुगर बढ़ा हुआ आए, तो स्वयं दवा शुरू करने के बजाय डॉक्टर से मिलकर सलाह लें।',
          'अत्यधिक प्यास लगना, बार-बार पेशाब आना, घाव देरी से भरना या लगातार थकान महसूस होना।',
        ],
      },
    },
  },
];
