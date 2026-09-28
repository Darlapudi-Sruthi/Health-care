import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Bookmark,
  Check,
  ExternalLink,
  Globe,
  X,
  RefreshCw,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/translations';
import {
  HEALTHCARE_FACILITIES,
  SUPPORTED_CITIES,
  HealthcareFacility,
  ServiceFacilityType,
  calculateDistanceKm,
} from '../data/healthcareServices';

interface ServicesViewProps {
  language: SupportedLanguage;
  initialServiceType?: ServiceFacilityType | 'All';
  initialSortByNearby?: boolean;
  userCity: string;
  onUpdateUserCity: (city: string) => void;
  savedFacilities: HealthcareFacility[];
  onToggleSaveFacility: (facility: HealthcareFacility) => void;
}

const SERVICE_TYPES: (ServiceFacilityType | 'All')[] = [
  'All',
  'Hospital',
  'Clinic',
  'Government Hospital',
  'Pharmacy',
  'Diagnostic Center',
  'Emergency Department',
];

export const ServicesView: React.FC<ServicesViewProps> = ({
  language,
  initialServiceType = 'All',
  initialSortByNearby = false,
  userCity,
  onUpdateUserCity,
  savedFacilities,
  onToggleSaveFacility,
}) => {
  const t = UI_TRANSLATIONS[language];

  const [selectedType, setSelectedType] = useState<ServiceFacilityType | 'All'>(initialServiceType);
  const [selectedSector, setSelectedSector] = useState<'All' | 'Government' | 'Private'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'OpenNow' | '24Hours'>('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = Any distance
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>(userCity || 'Hyderabad');

  // GPS Coordinates (defaults to selected city center)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string }>(() => {
    const found = SUPPORTED_CITIES.find((c) => c.name === (userCity || 'Hyderabad')) || SUPPORTED_CITIES[0];
    return { lat: found.lat, lng: found.lng, label: found.name };
  });
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Live External API Facilities (OpenStreetMap + Gemini Maps Grounding)
  const [liveFacilities, setLiveFacilities] = useState<HealthcareFacility[]>([]);
  const [mapsGroundingLinks, setMapsGroundingLinks] = useState<{ title: string; uri: string }[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);

  // Interactive Map Modal state
  const [activeMapFacility, setActiveMapFacility] = useState<HealthcareFacility | null>(null);

  useEffect(() => {
    if (initialServiceType) {
      setSelectedType(initialServiceType);
    }
  }, [initialServiceType]);

  useEffect(() => {
    if (initialSortByNearby) {
      setMaxDistanceKm(25);
    }
  }, [initialSortByNearby]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    onUpdateUserCity(cityName);
    const cityObj = SUPPORTED_CITIES.find((c) => c.name === cityName);
    if (cityObj) {
      setUserCoords({ lat: cityObj.lat, lng: cityObj.lng, label: cityObj.name });
      setGpsStatus(null);
    }
  };

  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation is not supported by this browser.');
      return;
    }
    setGpsStatus('Locating via GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({
          lat: latitude,
          lng: longitude,
          label: `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
        });
        setSelectedCity('All');
        setGpsStatus('GPS location active');
      },
      () => {
        setGpsStatus('Unable to read GPS; using selected city center.');
      },
      { timeout: 8000 }
    );
  };

  const handleLiveExternalSearch = async () => {
    setLiveLoading(true);
    try {
      const targetQuery =
        searchQuery.trim() || (selectedCity !== 'All' ? selectedCity : userCoords.label);
      const targetType = selectedType === 'All' ? 'Hospital' : selectedType;
      const res = await fetch('/api/services/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityOrQuery: targetQuery,
          serviceType: targetType,
          lat: userCoords.lat,
          lng: userCoords.lng,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.facilities)) {
        setLiveFacilities(data.facilities);
      }
      if (Array.isArray(data.mapsGroundingLinks)) {
        setMapsGroundingLinks(data.mapsGroundingLinks);
      }
    } catch (err) {
      console.warn('Live search error:', err);
    } finally {
      setLiveLoading(false);
    }
  };

  const combinedFacilities = useMemo(() => {
    const all = [...liveFacilities, ...HEALTHCARE_FACILITIES];
    return all
      .map((fac) => {
        const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, fac.lat, fac.lng);
        return { ...fac, distanceKm: dist };
      })
      .filter((fac) => {
        if (
          selectedCity !== 'All' &&
          !fac.id.startsWith('osm-') &&
          fac.city.toLowerCase() !== selectedCity.toLowerCase()
        ) {
          return false;
        }
        if (selectedType !== 'All') {
          if (selectedType === 'Hospital') {
            if (fac.type !== 'Hospital' && fac.type !== 'Government Hospital') return false;
          } else if (fac.type !== selectedType) {
            return false;
          }
        }
        if (selectedSector !== 'All' && fac.sector !== selectedSector) {
          return false;
        }
        if (selectedStatus === 'OpenNow' && !fac.isOpenNow) {
          return false;
        }
        if (selectedStatus === '24Hours' && !fac.isOpen24Hours) {
          return false;
        }
        if (maxDistanceKm > 0 && fac.distanceKm > maxDistanceKm) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inName = fac.name.toLowerCase().includes(q);
          const inAddr = fac.address.toLowerCase().includes(q);
          const inCity = fac.city.toLowerCase().includes(q);
          const inServices = fac.services.some((s) => s.toLowerCase().includes(q));
          if (!inName && !inAddr && !inCity && !inServices) return false;
        }
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [
    liveFacilities,
    userCoords,
    selectedCity,
    selectedType,
    selectedSector,
    selectedStatus,
    maxDistanceKm,
    searchQuery,
  ]);

  const isSaved = (id: string) => savedFacilities.some((f) => f.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-700 mb-1">
            Verified Public & Private Directory · OpenStreetMap & Google Maps Grounded
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {t.services.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">{t.services.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUseGpsLocation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-700" />
            <span>{t.services.useMyLocation}</span>
          </button>

          <button
            type="button"
            onClick={handleLiveExternalSearch}
            disabled={liveLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${liveLoading ? 'animate-spin' : ''}`} />
            <span>{t.services.liveExternalSearch}</span>
          </button>
        </div>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-4">
        {/* Search Input & City Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.services.searchLocationPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700 text-slate-900"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              aria-label="Select City"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-teal-700"
            >
              <option value="All">All Regions / Cities</option>
              {SUPPORTED_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.stateOrCountry.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              aria-label="Filter by Distance"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-teal-700 font-mono-tabular"
            >
              <option value={0}>{t.services.anyDistance}</option>
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          </div>
        </div>

        {/* Interactive Segmented Filters: Facility Type */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type === 'All' ? t.services.allTypes : type}
              </button>
            ))}
          </div>

          {/* Sector & Status Segmented Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
              {(['All', 'Government', 'Private'] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedSector === sec
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sec === 'All'
                    ? t.services.allSectors
                    : sec === 'Government'
                    ? t.services.government
                    : t.services.private}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
              {(['All', 'OpenNow', '24Hours'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedStatus === st
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'All'
                    ? t.services.allStatuses
                    : st === 'OpenNow'
                    ? t.services.openNow
                    : t.services.open24Hours}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-mono-tabular text-slate-900">{combinedFacilities.length}</strong>{' '}
              verified healthcare facilities
            </span>
            <span aria-hidden="true">·</span>
            <span>Reference Center: {userCoords.label}</span>
            {gpsStatus && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-teal-700 font-medium">{gpsStatus}</span>
              </>
            )}
          </div>
          {(selectedType !== 'All' ||
            selectedSector !== 'All' ||
            selectedStatus !== 'All' ||
            maxDistanceKm > 0 ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedType('All');
                setSelectedSector('All');
                setSelectedStatus('All');
                setMaxDistanceKm(0);
                setSearchQuery('');
              }}
              className="text-teal-700 hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Gemini Maps Grounding Verified Links (when live search was triggered) */}
      {mapsGroundingLinks.length > 0 && (
        <div className="mb-6 p-4 bg-white border border-teal-200 rounded-xl">
          <p className="text-xs font-semibold text-teal-800 mb-2">
            Google Maps Grounded Place Links ({selectedCity === 'All' ? userCoords.label : selectedCity})
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {mapsGroundingLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-800 hover:text-teal-700 font-medium underline underline-offset-2"
              >
                <Globe className="w-3.5 h-3.5 text-teal-700" />
                <span>{link.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid (Single-Elevation Cards, Zero-Pill Metadata Discipline) */}
      {combinedFacilities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-base font-semibold text-slate-900 mb-1">
            No matching facilities found within current filter criteria
          </p>
          <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
            Try expanding the maximum distance filter, selecting &ldquo;All Regions / Cities&rdquo;, or clicking Live External Search to query OpenStreetMap.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedCity('All');
                setMaxDistanceKm(0);
                setSelectedType('All');
                setSelectedSector('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Show All Cities & Types
            </button>
            <button
              type="button"
              onClick={handleLiveExternalSearch}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              {t.services.liveExternalSearch}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {combinedFacilities.map((facility) => {
            const saved = isSaved(facility.id);

            return (
              <article
                key={facility.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Quiet 1-line unboxed metadata kicker (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-teal-800">{facility.type}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        facility.sector === 'Government'
                          ? 'text-slate-800 font-medium'
                          : 'text-slate-600'
                      }
                    >
                      {facility.sector} Sector
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular text-slate-700">
                      {facility.distanceKm} km away
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        facility.isOpen24Hours
                          ? 'text-emerald-700 font-medium'
                          : 'text-slate-600'
                      }
                    >
                      {facility.isOpen24Hours ? '24/7 Active' : 'Open'}
                    </span>
                  </div>

                  {/* Facility Name */}
                  <h2 className="text-lg font-semibold text-slate-900 leading-snug mb-3">
                    {facility.name}
                  </h2>

                  {/* Address, Contact, Hours */}
                  <div className="space-y-2 text-sm text-slate-700 border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{facility.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono-tabular font-medium text-slate-900">
                        {facility.phone}
                      </span>
                      {facility.emergencyPhone && (
                        <>
                          <span className="text-slate-300" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-xs text-red-700 font-mono-tabular font-semibold">
                            Emergency: {facility.emergencyPhone}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600 font-mono-tabular">
                        {facility.openingHours}
                      </span>
                    </div>
                  </div>

                  {/* Available Services (Unboxed separated list) */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      {t.services.availableServicesLabel}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {facility.services.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMapFacility(facility)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t.services.openMapBtn}</span>
                    </button>

                    <a
                      href={`tel:${facility.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.services.callFacilityBtn}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleSaveFacility(facility)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                      saved
                        ? 'border-teal-600 bg-teal-50/40 text-teal-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-700" />
                        <span>{t.services.bookmarkedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{t.services.bookmarkBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Map & Directions Modal */}
      {activeMapFacility && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-teal-700 font-medium">
                  {activeMapFacility.type} · {activeMapFacility.sector} Sector
                </p>
                <h3 className="text-base font-semibold text-slate-900">
                  {activeMapFacility.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMapFacility(null)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                aria-label="Close map"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded OpenStreetMap iframe */}
            <div className="w-full h-80 bg-slate-100 relative">
              <iframe
                title={`Map of ${activeMapFacility.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  activeMapFacility.lng - 0.012
                }%2C${activeMapFacility.lat - 0.012}%2C${
                  activeMapFacility.lng + 0.012
                }%2C${activeMapFacility.lat + 0.012}&layer=mapnik&marker=${
                  activeMapFacility.lat
                }%2C${activeMapFacility.lng}`}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <p className="font-medium text-slate-900">{activeMapFacility.address}</p>
                <p className="font-mono-tabular mt-0.5">
                  Coordinates: {activeMapFacility.lat.toFixed(4)}, {activeMapFacility.lng.toFixed(4)} · Phone:{' '}
                  {activeMapFacility.phone}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${activeMapFacility.name} ${activeMapFacility.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap"
                >
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${activeMapFacility.lat}&mlon=${activeMapFacility.lng}#map=16/${activeMapFacility.lat}/${activeMapFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
