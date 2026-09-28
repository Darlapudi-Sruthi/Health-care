import { HEALTH_KNOWLEDGE_BASE } from '../src/data/knowledgeBase';
import { HEALTHCARE_FACILITIES, EMERGENCY_REGIONS } from '../src/data/healthcareServices';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return res.status(200).json({
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
}
