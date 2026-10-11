import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Clock,
  Lock,
  Leaf,
  ChevronRight,
  ExternalLink,
  Share2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Edit3,
} from 'lucide-react';
import { OutcomeBanner } from '../components/common/OutcomeBanner';
import { StatusChip } from '../components/common/StatusChip';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { checkService } from '../services/checkService';
import { useCheckStore } from '../stores/checkStore';
import { truncateHash, formatDate } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { OFFICIAL_ASSETS } from '../services/mockData';

export function ResultSummaryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editedLicence, setEditedLicence] = useState('');
  const [isEditingLicence, setIsEditingLicence] = useState(false);

  const activeCheckFromStore = useCheckStore((state) => state.activeCheck);
  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await checkService.getCheckById(id || activeCheckFromStore?.id || 'check-kettle-101');
        setCheck(data);
        setActiveCheck(data);
        setEditedLicence(data.licenceNumber);
      } catch (err) {
        if (activeCheckFromStore) {
          setCheck(activeCheckFromStore);
          setEditedLicence(activeCheckFromStore.licenceNumber);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading || !check) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-14 h-14 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-700 font-bold">Querying official SQLite database...</p>
      </div>
    );
  }

  const { scope4, recordComparison, timeline, evidenceTrail, ecoData } = check;

  const handleRecheckLicence = () => {
    setIsEditingLicence(false);
    navigate(`/check/analysis/licence-${encodeURIComponent(editedLicence)}`);
  };

  return (
    <div className="space-y-5 pb-36 max-w-lg mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 px-4 py-2.5 rounded-full shadow-2xs active:scale-95 transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Check</span>
        </button>
        <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full">
          ID: {check.id}
        </span>
      </div>

      {/* Outcome Banner */}
      <OutcomeBanner outcome={check.outcome} />

      {/* Product Details Card with REAL Product Photo & Real ISI Mark */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-subtle space-y-4">
        <div className="flex gap-4 items-start">
          {/* Real Product Image from Internet */}
          {check.productImage && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-50 shadow-xs">
              <img
                src={check.productImage}
                alt={check.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              {check.category}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5 leading-snug line-clamp-2">
              {check.title}
            </h2>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              <span className="font-bold text-indigo-950">Licence: {check.licenceNumber}</span>
            </div>
          </div>
        </div>

        {/* Real ISI Mark Badge from Wikimedia Commons */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={OFFICIAL_ASSETS.isiMark}
                alt="Official BIS ISI Mark"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = OFFICIAL_ASSETS.isiMarkInternet;
                }}
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Official BIS Standard Mark</div>
              <div className="text-[11px] text-slate-500 font-mono">{check.standardNumber}</div>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            Standard Format
          </span>
        </div>

        {/* SCOPE-4 ASSESSMENT CHIPS (Clean 2x2 Grid with NO Overlapping text) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              {t('scope4.title')}
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Click to inspect</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <StatusChip
              label={t('scope4.claim')}
              status={scope4.claim.status}
              onClick={() => setActiveTab('claim')}
              isSelected={activeTab === 'claim'}
            />
            <StatusChip
              label={t('scope4.identity')}
              status={scope4.identity.status}
              onClick={() => setActiveTab('comparison')}
              isSelected={activeTab === 'comparison'}
            />
            <StatusChip
              label={t('scope4.scope')}
              status={scope4.scope.status}
              onClick={() => setActiveTab('comparison')}
              isSelected={activeTab === 'comparison'}
            />
            <StatusChip
              label={t('scope4.time')}
              status={scope4.time.status}
              onClick={() => setActiveTab('timeline')}
              isSelected={activeTab === 'timeline'}
            />
          </div>
        </div>

        {/* Plain-Language Explanation */}
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <p className="font-extrabold text-slate-900 mb-0.5">Plain-Language Summary:</p>
          <p>{check.summarySentence}</p>
        </div>

        {/* Next Step Bubble Alert */}
        <div className="flex items-start gap-2.5 bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-200 text-xs text-indigo-950">
          <div className="w-2 h-2 rounded-full bg-indigo-700 mt-1.5 shrink-0" />
          <p>
            <span className="font-bold">Recommended Next Step: </span>
            {check.nextAction}
          </p>
        </div>
      </div>

      {/* Sub-view Navigation Bubble Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'summary', label: t('result.summaryTab') },
          { key: 'claim', label: t('result.claimTab') },
          { key: 'comparison', label: t('result.comparisonTab') },
          { key: 'timeline', label: t('result.timeTab') },
          { key: 'evidence', label: t('result.evidenceTab') },
          ...(check.ecoData ? [{ key: 'eco', label: t('result.ecoTab') }] : []),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 border-2 ${
              activeTab === tab.key
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-md ring-2 ring-indigo-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Claim Detail (Real Images + OCR Verification) */}
      {activeTab === 'claim' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Detected Standard Mark & Optical Recognition
            </h3>
            <span className="text-xs bg-teal-50 text-teal-800 border-2 border-teal-200 px-3 py-1 rounded-full font-bold">
              Confidence: {check.ocrData?.confidence}%
            </span>
          </div>

          {/* Visual comparison of real product photo & real official mark */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex flex-col items-center justify-center p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Item Evidence Photo</span>
              <img
                src={check.productImage}
                alt="Product Evidence"
                className="w-24 h-24 object-contain rounded-xl"
              />
            </div>
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white flex flex-col items-center justify-center p-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Official ISI Mark (BIS)</span>
              <img
                src={OFFICIAL_ASSETS.isiMark}
                alt="Official ISI Mark"
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.currentTarget.src = OFFICIAL_ASSETS.isiMarkInternet;
                }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Extracted Licence Digits:
              </span>
              <button
                onClick={() => setIsEditingLicence(!isEditingLicence)}
                className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingLicence ? 'Cancel' : t('result.editLicenceDigits')}</span>
              </button>
            </div>

            {isEditingLicence ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedLicence}
                  onChange={(e) => setEditedLicence(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full border-2 border-indigo-500 font-mono text-sm uppercase bg-white focus:outline-none"
                />
                <Button onClick={handleRecheckLicence} size="sm" variant="primary">
                  Re-check
                </Button>
              </div>
            ) : (
              <div className="font-mono text-sm font-extrabold text-slate-900 bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>{check.licenceNumber}</span>
                <span className="text-[11px] font-medium text-slate-500">From optical read</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Comparison */}
      {activeTab === 'comparison' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Product Evidence vs. Official BIS Register
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700">Specification</th>
                  <th className="p-3 font-bold text-slate-700">{t('result.productCol')}</th>
                  <th className="p-3 font-bold text-slate-700">{t('result.officialCol')}</th>
                  <th className="p-3 font-bold text-slate-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recordComparison?.map((row, idx) => {
                  const isMatch = row.match === 'match';
                  const isDiff = row.match === 'differing';
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{row.field}</td>
                      <td className="p-3 text-slate-700">{row.product}</td>
                      <td className="p-3 font-medium text-slate-800">{row.official}</td>
                      <td className="p-3 text-center">
                        {isMatch ? (
                          <span className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Match</span>
                          </span>
                        ) : isDiff ? (
                          <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Differs</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-full font-bold">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>No record</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Licence Validity vs. Production Timeline
          </h3>

          <div className="space-y-3 p-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shadow-2xs mt-0.5">
                1
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Licence Granted: {timeline?.licenceGranted ? formatDate(timeline.licenceGranted) : 'Unrecorded'}
                </p>
                <p className="text-xs text-slate-500">Initial certification issued by BIS.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shadow-2xs mt-0.5">
                2
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Item Batch Date: {timeline?.itemManufactureDate ? formatDate(timeline.itemManufactureDate) : 'Not stated'}
                </p>
                <p className="text-xs text-slate-500">Manufacture stamp on product carton.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shadow-2xs mt-0.5">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Valid Through: {timeline?.licenceExpires ? formatDate(timeline.licenceExpires) : 'Unable to verify'}
                </p>
                <p className="text-xs text-slate-500">Registered renewal expiry in database.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Evidence Trail */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>{t('evidence.title')}</span>
          </div>

          <div className="space-y-3">
            {evidenceTrail?.map((ev, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{ev.fileName}</span>
                  <span className="text-[11px] text-slate-500">{ev.size}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl font-mono text-[10px] text-slate-700 break-all border border-slate-200">
                  SHA-256: {ev.sha256}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EcoLoop (With Real BEE Star Label from Wikimedia) */}
      {activeTab === 'eco' && ecoData && (
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>{t('eco.title')}</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 space-y-3 text-xs">
            <div className="flex gap-3 items-center">
              <img
                src={OFFICIAL_ASSETS.beeStarLabel}
                alt="Official BEE Star Rating Label"
                className="w-16 h-20 object-contain rounded-lg border border-emerald-300 bg-white p-1 shrink-0"
                onError={(e) => {
                  e.currentTarget.src = OFFICIAL_ASSETS.beeStarLabelInternet;
                }}
              />
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm">
                  {ecoData.beeLabelClaimed}
                </h4>
                <p className="text-emerald-800 mt-0.5">
                  Standard: {ecoData.beeLabelStandard}
                </p>
                <p className="text-slate-700 mt-0.5">
                  Annual Consumption: {ecoData.annualEnergyConsumption}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/eco/${check.id}`)}
            variant="teal"
            size="lg"
            className="w-full text-xs"
          >
            <span>View Coimbatore Collection Points</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Primary Bubble Action Buttons */}
      <div className="space-y-3 pt-2">
        {check.outcomeKey === 'INCONSISTENCY' && (
          <Button
            onClick={() => navigate(`/report/new/${check.id}`)}
            variant="danger"
            size="lg"
            className="w-full"
          >
            <AlertTriangle className="w-5 h-5 mr-1" />
            <span>{t('result.reportAction')}</span>
          </Button>
        )}

        {check.outcomeKey === 'ECO_SEPARATE' && (
          <Button
            onClick={() => navigate(`/eco/${check.id}`)}
            variant="teal"
            size="lg"
            className="w-full"
          >
            <Leaf className="w-5 h-5 mr-1" />
            <span>Open EcoLoop Verification & Disposal Guide</span>
          </Button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate(`/report/new/${check.id}`)}
            variant="secondary"
            className="text-xs sm:text-sm"
          >
            <span>File Inquiry</span>
          </Button>
          <Button
            onClick={() => navigate('/history')}
            variant="outline"
            className="text-xs sm:text-sm"
          >
            <span>Saved Checks (8)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
