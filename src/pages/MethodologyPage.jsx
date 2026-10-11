import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertCircle, Info, Scale, CheckCircle2, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export function MethodologyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-8">
      {/* Header Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learn</span>
        </button>
        <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          Methodology & Limits
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          How BIS Sentinel Works & Its Limits
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Understanding our record comparison methodology, technical blind spots, and consumer protection safeguards
        </p>
      </div>

      {/* Principle 1: Record Check, Not a Legal Finding */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
          <Scale className="w-5 h-5 text-indigo-700" />
          <span>Core Civic Principle: Evidence Verification Only</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          BIS Sentinel compares product mark claims, packaging photos, and seller links against the publicly accessible National Standards Register maintained by the Bureau of Indian Standards.
        </p>
        <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
          ⚖️ An inconsistency indicates that the claim does not correlate with available records. It does <strong>not</strong> constitute an accusation of counterfeiting or an administrative finding of illegality.
        </div>
      </div>

      {/* Principle 2: Missing Evidence Is Not Proof of Wrongdoing */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>Missing Evidence ≠ Proof of Wrongdoing</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          When an optical read fails, a licence number is partially blurred, or a newly licensed factory has not yet synced to the central database, we categorize the result as <strong>"Unable to verify with available records"</strong>.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          We never assign a negative verdict when evidence is incomplete. Shoppers are encouraged to take a sharper photo or check back once the database syncs.
        </p>
      </div>

      {/* Principle 3: Known Blind Spots */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
          <Info className="w-5 h-5 text-slate-600" />
          <span>{t('learn.blindspotsTitle')}</span>
        </div>

        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Registry Update Lag:</strong> Official BIS and BEE database renewals can take 24–48 hours to propagate across public endpoints.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Physical Mark Tampering:</strong> A valid licence number may theoretically be printed by an unauthorized seller on an uncertified product. This is why physical inspections by BIS enforcement officers remain essential.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <span><strong>Optical Distortions:</strong> Metallic curved surfaces or high reflectivity can introduce OCR inaccuracies. The manual digit correction tool prevents false errors.</span>
          </li>
        </ul>
      </div>

      {/* Principle 4: Human Review */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2.5 text-teal-900 font-bold text-sm">
          <UserCheck className="w-5 h-5 text-teal-700" />
          <span>Human-in-the-Loop Decision Making</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Reports submitted through BIS Sentinel are formatted strictly according to the BIS Care portal guidelines. Final regulatory actions, notices to manufacturers, and market sample seizures are decided solely by human technical officers at BIS branch offices.
        </p>
      </div>
    </div>
  );
}
