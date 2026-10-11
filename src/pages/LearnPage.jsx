import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MANDATORY_CATEGORIES, OFFICIAL_ASSETS } from '../services/mockData';
import { useTranslation } from 'react-i18next';

export function LearnPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = MANDATORY_CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.standard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-36 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t('learn.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Visual handbook to understand Indian standard marks, registration codes, and consumer rights
        </p>
      </div>

      {/* Official BIS Government Seal Header */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
          <img
            src={OFFICIAL_ASSETS.bisLogo}
            alt="Bureau of Indian Standards"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            National Standards Body
          </span>
          <h3 className="font-extrabold text-slate-900 text-sm mt-1">
            Bureau of Indian Standards (BIS)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Ministry of Consumer Affairs, Food & Public Distribution
          </p>
        </div>
      </div>

      {/* Methodology CTA Card */}
      <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white p-5 rounded-3xl shadow-subtle flex items-center justify-between gap-3 border-2 border-indigo-700/50">
        <div>
          <h3 className="font-extrabold text-sm">
            {t('learn.methodologyTitle')}
          </h3>
          <p className="text-xs text-indigo-200 mt-0.5 font-medium">
            Read about registry lookups, blind spots, and human review
          </p>
        </div>
        <Button
          onClick={() => navigate('/learn/methodology')}
          size="sm"
          className="bg-white text-indigo-950 hover:bg-slate-100 shrink-0 text-xs font-bold"
        >
          <span>Read Limits</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>

      {/* Explainer 1: The REAL ISI Mark from Wikimedia */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src={OFFICIAL_ASSETS.isiMark}
              alt="Official ISI Mark"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t('learn.isiTitle')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Mandatory Quality & Safety Mark</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          The ISI mark is the oldest and most trusted certification mark in India, established under the Indian Standards Institution (now BIS). Over 600 product categories cannot be legally sold without it under government Quality Control Orders (QCO).
        </p>

        {/* Real Mark Anatomy Guide */}
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-xs space-y-3">
          <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Required Three-Part Anatomy:
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col items-center text-center space-y-2">
            <div className="font-bold text-indigo-900 text-sm">IS 302-2-15</div>
            <div className="w-20 h-20 p-1 flex items-center justify-center">
              <img
                src={OFFICIAL_ASSETS.isiMark}
                alt="ISI Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="font-mono font-bold text-indigo-950 text-sm">CM/L - 8400123</div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-700 font-medium pt-1">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-950 block">Top Line:</span>
              Indian Standard code specifying technical tests.
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-950 block">Bottom Line:</span>
              7 or 8-digit unique factory licence number.
            </div>
          </div>
        </div>
      </div>

      {/* Explainer 2: CRS Mark for Electronics */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-900 flex items-center justify-center font-extrabold text-xl shrink-0">
            R
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t('learn.crsTitle')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Electronics & IT Registration Scheme</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Found on phone chargers, power adapters, laptops, and LED lamps. Instead of CM/L, displays a unique registration number beginning with "R-" (e.g. <code>R-41001234</code>) verified on crsbis.in.
        </p>
      </div>

      {/* Explainer 3: BIS Hallmark for Gold */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t('learn.hallmarkTitle')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Gold & Silver Purity Standard</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          All gold jewellery in India must carry 3 marks: BIS triangular emblem, Karatage/Purity (e.g., 22K916), and a 6-digit alphanumeric HUID code traceable to the assaying center.
        </p>
      </div>

      {/* Explainer 4: BEE Star Rating Energy Label */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            <img
              src={OFFICIAL_ASSETS.beeStarLabel}
              alt="BEE Star Rating Label"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = OFFICIAL_ASSETS.beeStarLabelInternet;
              }}
            />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              BEE Star Energy Rating
            </h3>
            <p className="text-xs text-slate-500 font-medium">Bureau of Energy Efficiency (BEE)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Mandatory on air conditioners, refrigerators, geysers, and ceiling fans. Certified appliances display 1 to 5 stars denoting electricity efficiency, along with appliance model and annual kWh consumption registered on beestarlabel.com.
        </p>
      </div>

      {/* Category Lookup */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Mandatory Certification Lookup
          </h3>
          <span className="text-[11px] text-slate-500 font-bold">Active QCOs</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category or standard (e.g. helmets, IS 302)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition"
          />
        </div>

        <div className="space-y-2 pt-1 max-h-60 overflow-y-auto no-scrollbar">
          {filteredCategories.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-[11px] text-slate-500">{c.count}</div>
              </div>
              <span className="font-mono text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                {c.standard}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
