import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Phone,
  MapPin,
  ShieldAlert,
  Building2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/translations';
import {
  EMERGENCY_REGIONS,
  HEALTHCARE_FACILITIES,
  SUPPORTED_CITIES,
  ServiceFacilityType,
  calculateDistanceKm,
} from '../data/healthcareServices';

interface EmergencyViewProps {
  language: SupportedLanguage;
  userCity: string;
  onNavigateToEmergencyFacilities: (type: ServiceFacilityType) => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  language,
  userCity,
  onNavigateToEmergencyFacilities,
}) => {
  const t = UI_TRANSLATIONS[language];

  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => {
    if (
      userCity === 'Hyderabad' ||
      userCity === 'Visakhapatnam' ||
      userCity === 'Vijayawada'
    ) {
      return 'india_ap_tg';
    }
    return 'india_national';
  });

  const activeRegion =
    EMERGENCY_REGIONS.find((r) => r.regionId === selectedRegionId) || EMERGENCY_REGIONS[0];

  const nearestEmergencyFacilities = useMemo(() => {
    const cityObj =
      SUPPORTED_CITIES.find((c) => c.name === userCity) || SUPPORTED_CITIES[0];
    return HEALTHCARE_FACILITIES.filter(
      (f) => f.type === 'Emergency Department' || (f.isOpen24Hours && f.sector === 'Government')
    )
      .map((f) => ({
        ...f,
        distanceKm: calculateDistanceKm(cityObj.lat, cityObj.lng, f.lat, f.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 4);
  }, [userCity]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Primary High-Contrast Emergency Banner */}
      <div className="bg-red-700 text-white rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-7 h-7 text-white shrink-0 mt-1" />
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-red-100">
              {t.emergency.title}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">
              “{t.emergency.alertBanner}”
            </h1>
            <p className="text-sm text-red-100 leading-relaxed max-w-3xl">
              {t.emergency.nonDiagnosticNotice}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToEmergencyFacilities('Emergency Department')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-900 bg-white rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <Building2 className="w-4 h-4" />
                <span>{t.emergency.findNearbyEmergencyBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${activeRegion.primaryEmergencyNumber.split(' ')[0]}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-900/60 border border-red-400/50 rounded-lg hover:bg-red-900 transition-colors whitespace-nowrap font-mono-tabular"
              >
                <Phone className="w-4 h-4" />
                <span>Call {activeRegion.primaryEmergencyNumber}</span>
              </a>

              <a
                href={`tel:${activeRegion.ambulanceNumber.split(' ')[0]}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-900/60 border border-red-400/50 rounded-lg hover:bg-red-900 transition-colors whitespace-nowrap font-mono-tabular"
              >
                <Phone className="w-4 h-4" />
                <span>Ambulance {activeRegion.ambulanceNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector & Official Helplines Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {t.emergency.officialNumbersTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Source: {activeRegion.officialAgency}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="emergency-region" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              {t.emergency.selectRegionLabel}:
            </label>
            <select
              id="emergency-region"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-teal-700"
            >
              {EMERGENCY_REGIONS.map((reg) => (
                <option key={reg.regionId} value={reg.regionId}>
                  {reg.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Structured Official Directory Rows */}
        <div className="divide-y divide-slate-100 mt-2">
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                National Emergency Response Number
              </p>
              <p className="text-xs text-slate-500">
                Unified police, fire, and medical emergency dispatch
              </p>
            </div>
            <a
              href={`tel:${activeRegion.primaryEmergencyNumber.split(' ')[0]}`}
              className="text-base font-bold font-mono-tabular text-red-700 hover:underline"
            >
              {activeRegion.primaryEmergencyNumber}
            </a>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Emergency Ambulance & Trauma Dispatch
              </p>
              <p className="text-xs text-slate-500">
                24/7 emergency medical transport service
              </p>
            </div>
            <a
              href={`tel:${activeRegion.ambulanceNumber.split(' ')[0]}`}
              className="text-base font-bold font-mono-tabular text-red-700 hover:underline"
            >
              {activeRegion.ambulanceNumber}
            </a>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Public Health Information & Medical Advice Line
              </p>
              <p className="text-xs text-slate-500">
                Official public health helpline for non-emergency guidance
              </p>
            </div>
            <span className="text-sm font-semibold font-mono-tabular text-slate-900">
              {activeRegion.healthHelplineNumber}
            </span>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                24/7 Mental Health & Crisis Support
              </p>
              <p className="text-xs text-slate-500">
                Confidential multilingual psychological support
              </p>
            </div>
            <span className="text-sm font-semibold font-mono-tabular text-teal-800">
              {activeRegion.mentalHealthHelpline}
            </span>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Poison Information & Bite Triage Helpline
              </p>
              <p className="text-xs text-slate-500">
                Official toxicology and emergency poison guidance
              </p>
            </div>
            <span className="text-sm font-semibold font-mono-tabular text-slate-900">
              {activeRegion.poisonControlInfo}
            </span>
          </div>
        </div>
      </div>

      {/* Nearest 24/7 Emergency Healthcare Facilities */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              24/7 Emergency Departments & Government Trauma Hospitals ({userCity})
            </h2>
            <p className="text-xs text-slate-500">
              Direct navigation to emergency casualty units sorted by distance
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToEmergencyFacilities('Emergency Department')}
            className="text-xs font-semibold text-teal-700 hover:underline whitespace-nowrap self-start sm:self-center"
          >
            View All Emergency Units →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {nearestEmergencyFacilities.map((fac) => (
            <div
              key={fac.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-red-700">{fac.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{fac.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">{fac.distanceKm} km</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">Open 24 Hours</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{fac.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{fac.address}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${(fac.emergencyPhone || fac.phone).replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap font-mono-tabular"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{fac.emergencyPhone || fac.phone}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${fac.name} ${fac.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Non-Diagnostic Steps While Waiting */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
          <h2 className="text-base font-semibold text-slate-900">
            {t.emergency.whileWaitingTitle}
          </h2>
        </div>
        <ul className="space-y-2.5 text-sm text-slate-700">
          {t.emergency.whileWaitingSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="font-mono-tabular text-xs font-semibold text-teal-700 mt-1">
                0{idx + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
