import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Leaf,
  Zap,
  MapPin,
  List,
  Phone,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { COLLECTION_POINTS_COIMBATORE, OFFICIAL_ASSETS } from '../services/mockData';
import { useTranslation } from 'react-i18next';

export function EcoLoopPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedPoint, setSelectedPoint] = useState(COLLECTION_POINTS_COIMBATORE[0]);

  return (
    <div className="space-y-5 pb-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5" />
          <span>EcoLoop Hub</span>
        </span>
      </div>

      {/* Header banner */}
      <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white rounded-3xl p-5 shadow-elevated">
        <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold mb-1">
          <Zap className="w-4 h-4" />
          <span>BEE Energy & Responsible Lifecycle</span>
        </div>
        <h2 className="text-xl font-bold leading-tight">
          {t('eco.title')}
        </h2>
        <p className="text-xs text-teal-100/90 mt-1.5 leading-relaxed">
          {t('eco.beeDesc')}
        </p>
      </div>

      {/* Section 1: BEE Energy Label Verification */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t('eco.beeTitle')}</span>
          </h3>
          <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">
            Independent Registry
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="w-20 h-24 rounded-2xl bg-white border-2 border-emerald-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            <img
              src={OFFICIAL_ASSETS.beeStarLabel}
              alt="BEE Star Rating Label"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = OFFICIAL_ASSETS.beeStarLabelInternet;
              }}
            />
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs flex-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Registry Authority:</span>
              <span className="font-semibold text-slate-800">Bureau of Energy Efficiency (BEE)</span>
            </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Claimed Star Rating:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              5 Star Rating (2024 Table)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Standard Test Method:</span>
            <span className="font-mono text-slate-800">BEE/REF/2024/089</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Verified Consumption:</span>
            <span className="text-slate-800 font-semibold">198 kWh/Year</span>
          </div>
        </div>
      </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Note: BEE energy labels are certified independently of the mandatory BIS electrical safety mark (IS 302-2-24).
        </p>
      </div>

      {/* Section 2: Responsible E-Waste Disposal Notice */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>{t('eco.disposalTitle')}</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('eco.disposalDesc')} Cooling appliances contain high-efficiency R600a hydrocarbon refrigerant and cyclopentane insulation blowing agents requiring certified recovery.
        </p>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
          <p className="font-semibold">Statutory Consumer Rights:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-700">
            <li>Doorstep recycling exchange on delivery of new appliance</li>
            <li>Free handover at registered municipal e-waste depository</li>
            <li>Formal receipt validating responsible end-of-life channelization</li>
          </ul>
        </div>
      </div>

      {/* Section 3: Collection Points Finder (Coimbatore) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Authorized Collection Centers
            </h3>
            <p className="text-[11px] text-slate-500">Coimbatore District, Tamil Nadu</p>
          </div>

          {/* Toggle List vs Map */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-indigo-900 text-white' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5 inline mr-1" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                viewMode === 'map' ? 'bg-indigo-900 text-white' : 'text-slate-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Map
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-3">
            {COLLECTION_POINTS_COIMBATORE.map((cp) => (
              <div
                key={cp.id}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {cp.name}
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {cp.distance}
                  </span>
                </div>
                <p className="text-slate-600">{cp.address}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-semibold text-indigo-900">
                    <Phone className="w-3 h-3" />
                    {cp.contact}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cp.timing}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  <span className="font-medium text-slate-700">Accepts: </span>
                  {cp.accepts.join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Simulated Map-Style View */
          <div className="space-y-3">
            <div className="aspect-16/10 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-700 p-4 flex flex-col justify-between">
              {/* Decorative map grid lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-teal-200 self-start z-10">
                Coimbatore Center (11.0168° N, 76.9558° E)
              </div>

              {/* Pin 1 */}
              <button
                onClick={() => setSelectedPoint(COLLECTION_POINTS_COIMBATORE[0])}
                className="absolute top-[35%] left-[40%] group cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg group-hover:scale-125 transition">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded shadow mt-1 inline-block whitespace-nowrap">
                  RS Puram (2.4 km)
                </span>
              </button>

              {/* Pin 2 */}
              <button
                onClick={() => setSelectedPoint(COLLECTION_POINTS_COIMBATORE[1])}
                className="absolute bottom-[25%] right-[25%] group cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg group-hover:scale-125 transition">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded shadow mt-1 inline-block whitespace-nowrap">
                  SIDCO Kurichi (6.8 km)
                </span>
              </button>

              {/* Pin 3 */}
              <button
                onClick={() => setSelectedPoint(COLLECTION_POINTS_COIMBATORE[2])}
                className="absolute top-[20%] right-[30%] group cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg group-hover:scale-125 transition">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded shadow mt-1 inline-block whitespace-nowrap">
                  Gandhipuram (3.1 km)
                </span>
              </button>
            </div>

            {/* Selected Pin Details */}
            {selectedPoint && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{selectedPoint.name}</div>
                <div className="text-slate-600">{selectedPoint.address}</div>
                <div className="font-semibold text-indigo-900 pt-1">
                  Helpline: {selectedPoint.contact} • {selectedPoint.distance} away
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
