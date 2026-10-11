import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Lock, ArrowRight, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AppLogo } from '../components/common/AppLogo';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from 'react-i18next';

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const setLanguage = useAppStore((state) => state.setLanguage);
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted);
  const selectedLang = useAppStore((state) => state.language);

  const languages = [
    { code: 'en', name: 'English', sample: 'Verify marks with official records' },
    { code: 'ta', name: 'தமிழ்', sample: 'அதிகாரப்பூர்வ பதிவுகளுடன் சரிபார்க்கவும்' },
    { code: 'hi', name: 'हिंदी', sample: 'आधिकारिक रिकॉर्ड से तुरंत पुष्टि करें' },
  ];

  const slides = [
    {
      title: t('onboarding.step1Title'),
      desc: t('onboarding.step1Desc'),
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: t('onboarding.step2Title'),
      desc: t('onboarding.step2Desc'),
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: t('onboarding.step3Title'),
      desc: t('onboarding.step3Desc'),
      icon: Lock,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  const handleFinish = () => {
    setOnboardingCompleted(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top branding with clear AppLogo */}
      <div className="pt-6 text-center flex flex-col items-center">
        <AppLogo size="xl" showText={false} className="justify-center mb-3" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          BIS Sentinel
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto font-medium">
          {t('onboarding.welcome')}
        </p>
      </div>

      {/* Main card */}
      <div className="my-6">
        {currentSlide === 0 ? (
          /* Language Selector Slide with Bubble Buttons */
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-indigo-700" />
              <span>{t('onboarding.selectLanguage')}</span>
            </div>

            <div className="space-y-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer active:scale-95 ${
                    selectedLang === l.code
                      ? 'border-indigo-700 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-500/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">{l.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{l.sample}</div>
                  </div>
                  {selectedLang === l.code && (
                    <div className="w-7 h-7 rounded-full bg-indigo-900 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Explainer Slide */
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-subtle space-y-4 text-center">
            {React.createElement(slides[currentSlide - 1].icon, {
              className: `w-16 h-16 p-3.5 rounded-3xl mx-auto border-2 ${slides[currentSlide - 1].color} shadow-sm`,
            })}
            <h3 className="text-lg font-extrabold text-slate-900">
              {slides[currentSlide - 1].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
              {slides[currentSlide - 1].desc}
            </p>
          </div>
        )}
      </div>

      {/* Bottom controls & bubble slide dots */}
      <div className="space-y-4 pb-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              onClick={() => setCurrentSlide(dot)}
              className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentSlide === dot ? 'w-8 bg-indigo-900 shadow-xs' : 'w-2.5 bg-slate-300'
              }`}
              aria-label={`Slide ${dot + 1}`}
            />
          ))}
        </div>

        {/* Bubble Action Button */}
        {currentSlide < 3 ? (
          <Button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <span>{t('onboarding.getStarted')}</span>
            <CheckCircle2 className="w-5 h-5 ml-1 text-teal-300" />
          </Button>
        )}

        <p className="text-[11px] text-center text-slate-500 font-semibold">
          No sign-in or account needed • Checks stored locally in SQLite
        </p>
      </div>
    </div>
  );
}
