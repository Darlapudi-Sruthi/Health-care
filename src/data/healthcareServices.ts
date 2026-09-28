export type ServiceFacilityType =
  | 'Hospital'
  | 'Clinic'
  | 'Government Hospital'
  | 'Pharmacy'
  | 'Diagnostic Center'
  | 'Emergency Department';

export type FacilitySector = 'Government' | 'Private';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: ServiceFacilityType;
  sector: FacilitySector;
  city: string;
  address: string;
  phone: string;
  emergencyPhone?: string;
  services: string[];
  openingHours: string;
  isOpen24Hours: boolean;
  isOpenNow: boolean;
  lat: number;
  lng: number;
  mapUrl?: string;
  source?: string;
}

export interface CityCoordinates {
  name: string;
  stateOrCountry: string;
  lat: number;
  lng: number;
}

export const SUPPORTED_CITIES: CityCoordinates[] = [
  { name: 'Hyderabad', stateOrCountry: 'Telangana, India', lat: 17.3850, lng: 78.4867 },
  { name: 'Visakhapatnam', stateOrCountry: 'Andhra Pradesh, India', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada', stateOrCountry: 'Andhra Pradesh, India', lat: 16.5062, lng: 80.6480 },
  { name: 'New Delhi', stateOrCountry: 'Delhi NCR, India', lat: 28.6139, lng: 77.2090 },
  { name: 'Bengaluru', stateOrCountry: 'Karnataka, India', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', stateOrCountry: 'Maharashtra, India', lat: 19.0760, lng: 72.8777 },
  { name: 'Chennai', stateOrCountry: 'Tamil Nadu, India', lat: 13.0827, lng: 80.2707 },
];

export const HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  // Hyderabad
  {
    id: 'hyd-nims',
    name: "Nizam's Institute of Medical Sciences (NIMS)",
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Hyderabad',
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    phone: '+91-40-23489000',
    emergencyPhone: '108',
    services: ['General Medicine', 'Emergency Trauma Care', 'Cardiology', 'Neurology', 'Outpatient Clinics', 'Blood Bank'],
    openingHours: 'Open 24 Hours (OPD: 8:30 AM – 4:00 PM)',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.4226,
    lng: 78.4526,
  },
  {
    id: 'hyd-osmania',
    name: 'Osmania General Hospital – Emergency & Trauma Wing',
    type: 'Emergency Department',
    sector: 'Government',
    city: 'Hyderabad',
    address: 'Afzal Gunj, Hyderabad, Telangana 500012',
    phone: '+91-40-24600146',
    emergencyPhone: '108',
    services: ['24/7 Emergency Triage', 'Acute Trauma Care', 'Poison Control', 'General Surgery', 'ICU'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.3730,
    lng: 78.4747,
  },
  {
    id: 'hyd-gandhi',
    name: 'Gandhi Hospital & Medical College',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Hyderabad',
    address: 'Musheerabad, Secunderabad, Telangana 500003',
    phone: '+91-40-27505566',
    services: ['Maternal & Child Health', 'Infectious Disease Unit', 'Vaccination Center', 'Emergency Care', 'Pediatrics'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.4244,
    lng: 78.5032,
  },
  {
    id: 'hyd-apollo',
    name: 'Apollo Health City Jubilee Hills',
    type: 'Hospital',
    sector: 'Private',
    city: 'Hyderabad',
    address: 'Road No. 72, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033',
    phone: '+91-40-23607777',
    emergencyPhone: '1066',
    services: ['24/7 Emergency Room', 'Internal Medicine', 'Pediatrics', 'Women’s Health', 'Preventive Checkups'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.4156,
    lng: 78.4116,
  },
  {
    id: 'hyd-basti-clinic',
    name: 'Basti Dawakhana & Urban Primary Health Centre (UPHC)',
    type: 'Clinic',
    sector: 'Government',
    city: 'Hyderabad',
    address: 'Ameerpet Main Road, Hyderabad, Telangana 500016',
    phone: '104',
    services: ['Outpatient Consultation', 'Routine Immunization', 'Maternal Antenatal Checkups', 'BP & Diabetes Screening'],
    openingHours: '9:00 AM – 4:00 PM (Mon–Sat)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 17.4375,
    lng: 78.4482,
  },
  {
    id: 'hyd-vijaya-diag',
    name: 'Vijaya Diagnostic Centre – Himayatnagar',
    type: 'Diagnostic Center',
    sector: 'Private',
    city: 'Hyderabad',
    address: '3-6-16 & 17, Street No. 19, Himayatnagar, Hyderabad, Telangana 500029',
    phone: '+91-40-21000000',
    services: ['Complete Blood Count (CBC)', 'Fever Profile Panel', 'Ultrasound & X-Ray', 'ECG', 'Preventive Health Packages'],
    openingHours: '6:30 AM – 9:00 PM (Daily)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 17.4021,
    lng: 78.4840,
  },
  {
    id: 'hyd-janaushadhi',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Kendra – Koti',
    type: 'Pharmacy',
    sector: 'Government',
    city: 'Hyderabad',
    address: 'Sultan Bazar, Koti, Hyderabad, Telangana 500095',
    phone: '1800-180-8080',
    services: ['Generic Essential Medicines', 'WHO-ORS Packets', 'First Aid Supplies', 'Surgical Dressings', 'Thermometers'],
    openingHours: '8:00 AM – 9:30 PM (Daily)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 17.3854,
    lng: 78.4819,
  },

  // Visakhapatnam
  {
    id: 'vizag-kgh',
    name: 'King George Hospital (KGH)',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Visakhapatnam',
    address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh 530002',
    phone: '+91-891-2564891',
    emergencyPhone: '108',
    services: ['24/7 Emergency & Casualty', 'General Medicine', 'Maternity & Pediatrics', 'Immunization Clinic', 'Blood Bank'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.7077,
    lng: 83.3048,
  },
  {
    id: 'vizag-kgh-emergency',
    name: 'KGH Acute Trauma & Emergency Care Department',
    type: 'Emergency Department',
    sector: 'Government',
    city: 'Visakhapatnam',
    address: 'Collector Office Junction, Maharanipeta, Visakhapatnam, AP 530002',
    phone: '108',
    services: ['Immediate Emergency Triage', 'Snakebite & Poison Care', 'Cardiac & Respiratory Emergency', 'Ambulance Dispatch'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.7082,
    lng: 83.3055,
  },
  {
    id: 'vizag-care',
    name: 'CARE Hospitals – Ramnagar',
    type: 'Hospital',
    sector: 'Private',
    city: 'Visakhapatnam',
    address: 'AS Raja Complex, Waltair Main Road, Ramnagar, Visakhapatnam, AP 530002',
    phone: '+91-891-6165656',
    services: ['24/7 Emergency Services', 'Internal Medicine', 'Cardiology', 'Diagnostics', 'Outpatient Care'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.7205,
    lng: 83.3092,
  },
  {
    id: 'vizag-uphc',
    name: 'Dr. YSR Urban Primary Health Centre – MVP Colony',
    type: 'Clinic',
    sector: 'Government',
    city: 'Visakhapatnam',
    address: 'Sector 7, MVP Colony, Visakhapatnam, Andhra Pradesh 530017',
    phone: '104',
    services: ['Family Medicine', 'Childhood Vaccination', 'Maternal Checkups', 'Non-Communicable Disease Screening'],
    openingHours: '8:30 AM – 4:30 PM (Mon–Sat)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 17.7412,
    lng: 83.3370,
  },
  {
    id: 'vizag-apollopharm',
    name: '24/7 Community Hospital Pharmacy – Dwaraka Nagar',
    type: 'Pharmacy',
    sector: 'Private',
    city: 'Visakhapatnam',
    address: '1st Lane, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016',
    phone: '+91-891-2745522',
    services: ['24/7 Prescription Dispensing', 'First Aid Kits', 'ORS & Hydration Salts', 'Maternal & Infant Care Supplies'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 17.7285,
    lng: 83.3014,
  },
  {
    id: 'vizag-diag',
    name: 'Visakha Clinical & Imaging Diagnostic Center',
    type: 'Diagnostic Center',
    sector: 'Private',
    city: 'Visakhapatnam',
    address: 'Jagadamba Junction, Visakhapatnam, Andhra Pradesh 530002',
    phone: '+91-891-2523344',
    services: ['Pathology Lab', 'Dengue & Malaria Rapid Testing', 'Thyroid & Lipid Panels', 'Digital X-Ray', 'Ultrasound'],
    openingHours: '7:00 AM – 8:30 PM (Daily)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 17.7121,
    lng: 83.3019,
  },

  // Vijayawada
  {
    id: 'vja-ggh',
    name: 'Government General Hospital (GGH) Vijayawada',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Vijayawada',
    address: 'Eluru Road, Gunadala, Vijayawada, Andhra Pradesh 520008',
    phone: '+91-866-2452244',
    emergencyPhone: '108',
    services: ['24/7 Casualty & Trauma', 'General Medicine', 'Pediatrics', 'Obstetrics & Gynecology', 'Free Diagnostics'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 16.5175,
    lng: 80.6625,
  },

  // New Delhi
  {
    id: 'del-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '+91-11-26588500',
    emergencyPhone: '112',
    services: ['24/7 Emergency Medicine', 'General OPD', 'Pediatrics', 'Women’s Health', 'National Poison Information Centre'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 28.5672,
    lng: 77.2100,
  },
  {
    id: 'del-safdarjung-er',
    name: 'Safdarjung Hospital – Super Specialty Emergency Block',
    type: 'Emergency Department',
    sector: 'Government',
    city: 'New Delhi',
    address: 'Ring Road, Ansari Nagar West, New Delhi 110029',
    phone: '+91-11-26730000',
    emergencyPhone: '102',
    services: ['24/7 Acute Trauma & Burn Unit', 'Emergency Resuscitation', 'Rabies & Bite Clinic', 'Critical Care'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 28.5681,
    lng: 77.2058,
  },
  {
    id: 'del-mohalla',
    name: 'Aam Aadmi Mohalla Clinic – Connaught Place',
    type: 'Clinic',
    sector: 'Government',
    city: 'New Delhi',
    address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
    phone: '1031',
    services: ['Primary Care Consultation', 'Essential Diagnostic Tests', 'Preventive Screening', 'First Aid'],
    openingHours: '8:00 AM – 2:00 PM (Mon–Sat)',
    isOpen24Hours: false,
    isOpenNow: true,
    lat: 28.6304,
    lng: 77.2177,
  },

  // Bengaluru
  {
    id: 'blr-victoria',
    name: 'Victoria Hospital (Bangalore Medical College)',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Bengaluru',
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru, Karnataka 560002',
    phone: '+91-80-26701150',
    emergencyPhone: '108',
    services: ['24/7 Emergency & Burn Care', 'General Medicine', 'Outpatient Clinics', 'Vaccination Center'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 12.9636,
    lng: 77.5740,
  },
  {
    id: 'blr-nimhans',
    name: 'NIMHANS – National Institute of Mental Health and Neuro Sciences',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Bengaluru',
    address: 'Hosur Road, Lakkasandra, Bengaluru, Karnataka 560029',
    phone: '+91-80-26995000',
    emergencyPhone: '14416',
    services: ['Mental Wellbeing & Counseling', 'Neurology Emergency', 'Child & Adolescent Guidance', '24/7 Tele-MANAS Hub'],
    openingHours: 'Open 24 Hours (OPD: 8:00 AM – 11:30 AM)',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 12.9431,
    lng: 77.5963,
  },

  // Mumbai
  {
    id: 'mum-kem',
    name: 'King Edward Memorial (KEM) Hospital',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    phone: '+91-22-24107000',
    emergencyPhone: '108',
    services: ['24/7 Emergency Services', 'General Medicine', 'Maternal & Neonatal Care', 'Diagnostics & Blood Bank'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 19.0022,
    lng: 72.8417,
  },

  // Chennai
  {
    id: 'che-rgggh',
    name: 'Rajiv Gandhi Government General Hospital',
    type: 'Government Hospital',
    sector: 'Government',
    city: 'Chennai',
    address: 'Poonamallee High Road, Park Town, Opposite Central Station, Chennai, TN 600003',
    phone: '+91-44-25305000',
    emergencyPhone: '108',
    services: ['24/7 Zero-Delay Trauma Care', 'General Medicine', 'Fever Clinic', 'Diagnostics', 'Pharmacy'],
    openingHours: 'Open 24 Hours',
    isOpen24Hours: true,
    isOpenNow: true,
    lat: 13.0818,
    lng: 80.2772,
  },
];

export interface EmergencyRegionInfo {
  regionId: string;
  regionName: string;
  primaryEmergencyNumber: string;
  ambulanceNumber: string;
  healthHelplineNumber: string;
  mentalHealthHelpline: string;
  childAndWomenHelpline: string;
  poisonControlInfo: string;
  officialAgency: string;
}

export const EMERGENCY_REGIONS: EmergencyRegionInfo[] = [
  {
    regionId: 'india_ap_tg',
    regionName: 'India – Andhra Pradesh & Telangana (108 / 104 / 112)',
    primaryEmergencyNumber: '112',
    ambulanceNumber: '108',
    healthHelplineNumber: '104 (Aarogyasri / Health Information Helpline)',
    mentalHealthHelpline: '14416 (Tele-MANAS 24/7 Multilingual)',
    childAndWomenHelpline: '1098 (Childline) · 181 (Women Helpline)',
    poisonControlInfo: '1800-425-1213 / 1066 (National Poison Information)',
    officialAgency: 'Ministry of Health & Family Welfare (MoHFW) & State EMRI 108 Services',
  },
  {
    regionId: 'india_national',
    regionName: 'India – All States National Emergency Directory',
    primaryEmergencyNumber: '112',
    ambulanceNumber: '108 / 102',
    healthHelplineNumber: '104 / 1075 (National Health Helpline)',
    mentalHealthHelpline: '14416 / 1800-891-4416 (Tele-MANAS)',
    childAndWomenHelpline: '1098 (Childline) · 1091 / 181 (Women Helpline)',
    poisonControlInfo: '1800-11-6117 (AIIMS National Poison Information Centre, 24/7)',
    officialAgency: 'Emergency Response Support System (ERSS India) & MoHFW',
  },
  {
    regionId: 'us_canada',
    regionName: 'United States & Canada (911 / 988)',
    primaryEmergencyNumber: '911',
    ambulanceNumber: '911',
    healthHelplineNumber: '211 (Community Health & Social Services)',
    mentalHealthHelpline: '988 (Suicide & Crisis Lifeline)',
    childAndWomenHelpline: '1-800-799-7233 (National Domestic Support)',
    poisonControlInfo: '1-800-222-1222 (Poison Help Line)',
    officialAgency: '911 Emergency Dispatch & Department of Health and Human Services',
  },
  {
    regionId: 'uk_europe',
    regionName: 'United Kingdom & European Union (999 / 112)',
    primaryEmergencyNumber: '112 / 999',
    ambulanceNumber: '999 / 112',
    healthHelplineNumber: '111 (NHS Non-Emergency Medical Helpline)',
    mentalHealthHelpline: '111 (Option 2) / 116 123',
    childAndWomenHelpline: '0800 1111 (Childline)',
    poisonControlInfo: '111 (National Poisons Information Service)',
    officialAgency: 'NHS 111 / 999 & European 112 Emergency Network',
  },
];

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
