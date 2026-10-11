import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  FileText,
  Filter,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { historyService } from '../services/historyService';
import { reportService } from '../services/reportService';
import { useCheckStore } from '../stores/checkStore';
import { formatDate } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export function HistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checks');
  const [filter, setFilter] = useState('ALL');
  const [checks, setChecks] = useState([]);
  const [reports, setReports] = useState([]);
  const [uploadingReportId, setUploadingReportId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);

  useEffect(() => {
    async function load() {
      const c = await historyService.getHistory();
      const r = await reportService.getReports();
      setChecks(c);
      setReports(r);
    }
    load();
  }, []);

  const handleOpenCheck = (item) => {
    setActiveCheck(item);
    navigate(`/result/${item.id}`);
  };

  const handleUploadMoreEvidence = async (reportId) => {
    setUploadingReportId(reportId);
    try {
      const updated = await reportService.uploadAdditionalEvidence(reportId, {
        name: 'invoice_and_packaging_photo.jpg',
      });
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      setUploadSuccess(`Evidence uploaded for ${updated.trackingNumber}`);
      setTimeout(() => setUploadSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingReportId(null);
    }
  };

  const filteredChecks = checks.filter((c) => {
    if (filter === 'INCONSISTENCY') return c.outcomeKey === 'INCONSISTENCY';
    if (filter === 'NO_MISMATCH') return c.outcomeKey === 'NO_MISMATCH';
    return true;
  });

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t('history.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review saved check records and official grievance tracker stages
        </p>
      </div>

      {uploadSuccess && (
        <div className="bg-teal-50 border-2 border-teal-200 text-teal-900 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Main Mode Bubble Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-full border-2 border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('checks')}
          className={`flex-1 py-3 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
            activeTab === 'checks'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('history.tabChecks')}</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-3 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
            activeTab === 'reports'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('history.tabReports')}</span>
        </button>
      </div>

      {/* CHECKS LIST */}
      {activeTab === 'checks' && (
        <div className="space-y-3">
          {/* Filter Bubble Chips */}
          <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar text-xs">
            {[
              { key: 'ALL', label: t('history.filterAll') },
              { key: 'INCONSISTENCY', label: t('history.filterInconsistency') },
              { key: 'NO_MISMATCH', label: t('history.filterSupported') },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full font-bold border-2 transition-all cursor-pointer active:scale-95 shadow-2xs ${
                  filter === f.key
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredChecks.map((item) => {
              const isMismatch = item.outcomeKey === 'INCONSISTENCY';
              const isEco = item.outcomeKey === 'ECO_SEPARATE';
              const isUnable = item.outcomeKey === 'UNABLE_TO_VERIFY';

              return (
                <button
                  key={item.id}
                  onClick={() => handleOpenCheck(item)}
                  className="w-full text-left bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 hover:border-indigo-400 shadow-subtle transition-all active:scale-[0.99] flex items-center justify-between gap-3.5 cursor-pointer group"
                >
                  {item.productImage && (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={item.productImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500 font-bold">
                        {item.licenceNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm mt-0.5 line-clamp-1 group-hover:text-indigo-900 transition">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-2">
                      {isMismatch ? (
                        <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                          Needs Review
                        </span>
                      ) : isEco ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                          EcoLoop Check
                        </span>
                      ) : isUnable ? (
                        <span className="text-[10px] bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                          Incomplete
                        </span>
                      ) : (
                        <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                          No Mismatch
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-900 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORTS LIST */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => {
            const isInfoRequested = rep.statusCode === 'INFO_REQUESTED';
            const isUnderReview = rep.statusCode === 'UNDER_REVIEW';

            return (
              <div
                key={rep.id}
                className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-subtle space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                      {rep.trackingNumber}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">
                      {rep.productTitle}
                    </h4>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border-2 shrink-0 ${
                      isInfoRequested
                        ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                        : isUnderReview
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {rep.summary}
                </p>

                {rep.reviewerNote && (
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>{t('history.reviewerNote')}:</span>
                    </div>
                    <p className="leading-relaxed">{rep.reviewerNote}</p>
                  </div>
                )}

                {/* Upload More Evidence Bubble Button */}
                {isInfoRequested && (
                  <div className="pt-2">
                    <Button
                      onClick={() => handleUploadMoreEvidence(rep.id)}
                      isLoading={uploadingReportId === rep.id}
                      variant="primary"
                      className="w-full text-xs"
                    >
                      <Upload className="w-4 h-4 mr-1.5" />
                      <span>{t('history.uploadEvidence')} (Receipt / Invoice)</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
