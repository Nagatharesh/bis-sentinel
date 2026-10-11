import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  ArrowLeft,
  UserCheck,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { reportService } from '../services/reportService';
import { useCheckStore } from '../stores/checkStore';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from 'react-i18next';

export function ReportToBisPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const activeCheck = useCheckStore((state) => state.activeCheck);

  const [complaintType, setComplaintType] = useState('misuse_of_mark');
  const [summary, setSummary] = useState(
    activeCheck
      ? `Observed inconsistency during consumer verification of ${activeCheck.title}. The packaging displays licence ${activeCheck.licenceNumber}; official BIS registry query indicates a different product scope or manufacturer.`
      : 'Observed inconsistency regarding standard mark claim on consumer goods.'
  );
  const [shareConsent, setShareConsent] = useState(true);
  const [phone, setPhone] = useState('+91 98421 XXXXX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedTicket, setAssignedTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await reportService.submitReport({
        checkId: activeCheck?.id || id,
        productTitle: activeCheck?.title || 'Reported Consumer Item',
        licenceNumber: activeCheck?.licenceNumber || 'Not Stated',
        complaintType,
        summary,
        shareContactConsent: shareConsent,
        contactDetails: shareConsent ? { phone } : null,
        evidenceFiles: activeCheck?.evidenceTrail || [],
      });
      setAssignedTicket(res);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadBisCarePacket = () => {
    const packet = {
      portal: 'BIS Care Grievance Redressal System',
      formatVersion: '2026.3',
      trackingReference: assignedTicket?.trackingNumber || 'BIS-CARE-DRAFT',
      complaintType,
      productTitle: activeCheck?.title,
      licenceNumber: activeCheck?.licenceNumber,
      summary,
      evidenceHashes: activeCheck?.evidenceTrail?.map((e) => ({
        file: e.fileName,
        sha256: e.sha256,
      })),
      filedBy: shareConsent ? phone : 'Anonymous Consumer Check',
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bis_care_complaint_${activeCheck?.licenceNumber || 'evidence'}.json`;
    a.click();
  };

  if (isSubmitted && assignedTicket) {
    return (
      <div className="space-y-5 py-6 text-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Inquiry Logged Successfully
        </h2>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle text-left space-y-3 max-w-sm mx-auto text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-500">Tracking Reference:</span>
            <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
              {assignedTicket.trackingNumber}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Submitted to BIS Queue
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Review Officer:</span>
            <span className="text-slate-700">Coimbatore Branch Office</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
            You can track this inquiry and provide additional proof from your My Checks tab anytime.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Button
            onClick={handleDownloadBisCarePacket}
            variant="secondary"
            className="w-full text-sm"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download BIS Care Form (JSON)</span>
          </Button>

          <Button
            onClick={() => navigate('/history')}
            variant="primary"
            className="w-full text-base h-14"
          >
            <span>View in My Reports Tracker</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          BIS Care Format
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('report.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {t('report.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pre-filled Product Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
          <div className="font-bold text-slate-900 text-sm">
            {activeCheck?.title || 'Reported Consumer Item'}
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-mono">
            <span>Licence: {activeCheck?.licenceNumber || 'Not Stated'}</span>
            <span>•</span>
            <span>{activeCheck?.standardNumber || 'IS Standard'}</span>
          </div>
          <div className="text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-100 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Cryptographic evidence hashes will be attached automatically.</span>
          </div>
        </div>

        {/* Complaint Type Radio / Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t('report.complaintType')}
          </label>
          <div className="space-y-2">
            {[
              { id: 'misuse_of_mark', label: t('report.typeMisuse') },
              { id: 'misleading_advertisement', label: t('report.typeMisleading') },
              { id: 'product_quality', label: t('report.typeQuality') },
            ].map((ct) => (
              <label
                key={ct.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer text-xs font-medium ${
                  complaintType === ct.id
                    ? 'border-indigo-700 bg-indigo-50/70 text-indigo-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="complaintType"
                  value={ct.id}
                  checked={complaintType === ct.id}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="accent-indigo-900"
                />
                <span>{ct.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Neutral Summary Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t('report.neutralSummary')}
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent leading-relaxed"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Keep description objective and strictly factual without accusatory terms.
          </p>
        </div>

        {/* Contact sharing consent */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={shareConsent}
              onChange={(e) => setShareConsent(e.target.checked)}
              className="mt-1 accent-indigo-900 w-4 h-4 rounded"
            />
            <span className="text-xs text-slate-700 font-medium leading-relaxed">
              {t('report.consentLabel')}
            </span>
          </label>

          {shareConsent && (
            <div className="pt-2">
              <label className="block text-[11px] text-slate-500 mb-1">
                Complainant Phone / WhatsApp:
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91..."
                className="h-10 text-xs"
              />
            </div>
          )}
        </div>

        {/* Human Review Note */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>{t('report.humanReviewNote')}</p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          variant="primary"
          className="w-full text-base h-14"
        >
          <Send className="w-4 h-4 mr-1.5" />
          <span>{t('report.submitBtn')}</span>
        </Button>
      </form>
    </div>
  );
}
