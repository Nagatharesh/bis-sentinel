import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Link as LinkIcon,
  Clipboard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';

export function ListingLinkPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [url, setUrl] = useState('https://amazon.in/dp/B09KETTLE15');
  const [selectedPlatform, setSelectedPlatform] = useState('Amazon');

  const platforms = [
    { name: 'Amazon India', domain: 'amazon.in', sample: 'https://amazon.in/dp/B09KETTLE15' },
    { name: 'Flipkart', domain: 'flipkart.com', sample: 'https://flipkart.com/p/aeroride-helmet-v2' },
    { name: 'JioMart', domain: 'jiomart.com', sample: 'https://jiomart.com/p/groceries/water-bottle-isi' },
    { name: 'Tata CLiQ', domain: 'tatacliq.com', sample: 'https://tatacliq.com/appliances/frostfree-fridge' },
    { name: 'Meesho', domain: 'meesho.com', sample: 'https://meesho.com/p/electric-kettle-15l' },
  ];

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) setUrl(text);
      }
    } catch (err) {
      console.warn('Clipboard read permission denied:', err);
    }
  };

  const handleSelectPlatform = (p) => {
    setSelectedPlatform(p.name);
    setUrl(p.sample);
  };

  const handleStartAnalysis = () => {
    navigate('/check/analysis/listing-url');
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
        <span className="text-xs font-bold text-teal-800 bg-teal-50 border-2 border-teal-200 px-4 py-2 rounded-full shadow-2xs">
          E-Commerce Link Mode
        </span>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t('listing.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {t('listing.subtitle')}
        </p>
      </div>

      {/* URL Input Box with Bubble Paste Button */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('listing.inputPlaceholder')}
            className="w-full min-h-[54px] px-5 pr-28 rounded-full border-2 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-600 transition text-sm font-medium shadow-xs"
          />
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer active:scale-90 transition shadow-2xs"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>
        </div>
      </div>

      {/* Supported Platforms Bubble Chips */}
      <div>
        <div className="text-xs font-bold text-slate-700 mb-2.5">
          {t('listing.supportedPlatforms')}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPlatform(p)}
              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0 ${
                url.includes(p.domain)
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-md ring-2 ring-indigo-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Preview Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-700" />
            <h4 className="font-extrabold text-slate-900 text-sm">
              {t('listing.previewTitle')}
            </h4>
          </div>
          <span className="text-[11px] bg-teal-50 text-teal-800 border-2 border-teal-200 px-3 py-1 rounded-full font-bold">
            Parsed from link
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3.5 items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-500 shrink-0 font-bold text-xs shadow-inner">
              Preview
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-bold text-slate-900 text-sm line-clamp-2">
                {url.includes('helmet')
                  ? 'AeroRide Full Face Motorcyclist Helmet (IS 4151)'
                  : url.includes('fridge')
                  ? 'FrostFree 265L Double Door Refrigerator'
                  : 'Prestige 1.5L Stainless Steel Electric Kettle'}
              </h5>
              <p className="text-xs text-slate-500 mt-1">
                Seller: RetailDirect India • Verified marketplace URL
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Claimed Standard Mark:</span>
              <span className="font-bold text-slate-800">ISI Standard Mark</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Stated Licence:</span>
              <span className="font-mono font-bold text-indigo-900">
                {url.includes('helmet') ? 'CM/L-7200456' : url.includes('fridge') ? 'CM/L-9100234' : 'CM/L-8400123'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Bubble Action Button */}
      <Button
        onClick={handleStartAnalysis}
        variant="primary"
        size="lg"
        className="w-full"
      >
        <span>{t('listing.analyzeNow')}</span>
        <ArrowRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}
