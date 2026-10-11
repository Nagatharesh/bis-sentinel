import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight, Info, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export function LicenceInputPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [licence, setLicence] = useState('CM/L-8400123');
  const [error, setError] = useState('');

  const quickSamples = [
    { label: 'Kettle (Valid)', val: 'CM/L-8400123' },
    { label: 'Helmet (Mismatch)', val: 'CM/L-7200456' },
    { label: 'Charger (Partial)', val: 'CM/L-72??914' },
    { label: 'Fridge (Eco)', val: 'CM/L-9100234' },
  ];

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!licence.trim()) {
      setError('Please enter a licence or registration number');
      return;
    }
    setError('');
    navigate(`/check/analysis/licence-${encodeURIComponent(licence.trim())}`);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bubble Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 px-4 py-2.5 rounded-full shadow-2xs active:scale-95 transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border-2 border-indigo-200 px-4 py-2 rounded-full shadow-2xs">
          Manual Licence Mode
        </span>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t('licence.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {t('licence.subtitle')}
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Licence Number (CM/L or R-number)
          </label>
          <input
            type="text"
            value={licence}
            onChange={(e) => {
              setLicence(e.target.value);
              if (error) setError('');
            }}
            placeholder={t('licence.placeholder')}
            className={`w-full min-h-[54px] px-5 rounded-full border-2 bg-white text-slate-900 font-mono text-base uppercase focus:outline-none focus:ring-4 transition shadow-xs ${
              error
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-200'
            }`}
          />
          {error && <p className="text-xs font-bold text-rose-600 mt-1.5 ml-4">{error}</p>}
          <p className="text-xs text-slate-500 mt-2 font-medium ml-2">{t('licence.helper')}</p>
        </div>

        {/* Quick test bubble chips */}
        <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-700">
            Quick Pre-loaded Cases:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSamples.map((sample) => (
              <button
                type="button"
                key={sample.val}
                onClick={() => setLicence(sample.val)}
                className={`text-xs px-4 py-2 rounded-full border-2 transition-all cursor-pointer active:scale-95 font-bold shadow-2xs ${
                  licence === sample.val
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Bubble Button */}
        <Button type="submit" variant="primary" size="lg" className="w-full">
          <Search className="w-5 h-5 mr-1" />
          <span>{t('licence.verifyBtn')}</span>
        </Button>
      </form>
    </div>
  );
}
