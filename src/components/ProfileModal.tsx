import React, { useState } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';
import {
  SupportedLanguage,
  LANGUAGE_OPTIONS,
  UI_TRANSLATIONS,
} from '../data/translations';
import { SUPPORTED_CITIES } from '../data/healthcareServices';

export interface UserProfilePreferences {
  ageGroup: string;
  preferredLanguage: SupportedLanguage;
  location: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfilePreferences;
  onSaveProfile: (updated: UserProfilePreferences) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup);
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(
    profile.preferredLanguage
  );
  const [location, setLocation] = useState(profile.location);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[preferredLanguage];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ageGroup,
      preferredLanguage,
      location: location.trim() || 'Hyderabad',
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t.profile.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.profile.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
            aria-label="Close profile preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Privacy Assurance Notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>{t.profile.privacyNotice}</span>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.profile.preferredLanguageLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.code)}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors text-center ${
                    preferredLanguage === lang.code
                      ? 'border-teal-700 bg-teal-50/40 text-teal-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>{lang.nativeLabel}</div>
                  <div className="text-[11px] font-normal text-slate-500">{lang.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Age Group */}
          <div>
            <label
              htmlFor="profile-age-group"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {t.profile.ageGroupLabel}
            </label>
            <select
              id="profile-age-group"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-teal-700"
            >
              {t.profile.ageGroups.map((ag) => (
                <option key={ag.value} value={ag.value}>
                  {ag.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Location */}
          <div>
            <label
              htmlFor="profile-location"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {t.profile.locationLabel}
            </label>
            <select
              id="profile-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-teal-700"
            >
              {SUPPORTED_CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.stateOrCountry})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.profile.savedConfirmation}</span>
                </>
              ) : (
                <span>{t.profile.saveProfileBtn}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
