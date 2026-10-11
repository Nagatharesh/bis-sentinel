import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Zap,
  ZapOff,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PhotoQualityMeter } from '../components/common/PhotoQualityMeter';
import { useTranslation } from 'react-i18next';

export function CaptureGuidePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedCount, setCapturedCount] = useState(1);
  const [quality, setQuality] = useState(88);
  const [flashOn, setFlashOn] = useState(false);
  const [isCapturingAnim, setIsCapturingAnim] = useState(false);

  const steps = [
    { id: 'front', title: t('capture.stepFront'), guide: 'Hold phone 30cm away to frame entire product body.' },
    { id: 'mark', title: t('capture.stepMark'), guide: 'Get close to the ISI or CRS mark symbol. Avoid direct flash.' },
    { id: 'plate', title: t('capture.stepPlate'), guide: 'Ensure the 7-digit CM/L or R-number text is in sharp focus.' },
    { id: 'box', title: t('capture.stepBox'), guide: 'Capture manufacturer MRP label & plant address on the carton.' },
  ];

  const currentStep = steps[currentStepIndex];

  const handleCapture = () => {
    setIsCapturingAnim(true);
    setTimeout(() => {
      setIsCapturingAnim(false);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setCapturedCount(capturedCount + 1);
        setQuality(Math.min(95, quality + 2));
      } else {
        navigate('/check/analysis/live-capture');
      }
    }, 250);
  };

  const handleGalleryUpload = () => {
    navigate('/check/analysis/live-capture');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bubble Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 px-4 py-2.5 rounded-full shadow-2xs active:scale-95 transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Step indicator bubble */}
        <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 border-2 border-indigo-200 px-4 py-2 rounded-full shadow-2xs">
          Step {currentStepIndex + 1}/4: {currentStep.title}
        </span>
      </div>

      {/* Simulated Camera Viewfinder */}
      <div className="relative aspect-4/3 w-full bg-slate-950 rounded-3xl overflow-hidden shadow-card flex flex-col justify-between p-4 border-2 border-slate-800">
        {/* Real camera feed preview from authentic photo */}
        <img
          src="/assets/kettle.jpg"
          alt="Live Camera Viewfinder Feed"
          className="absolute inset-0 w-full h-full object-cover opacity-50 filter contrast-105"
        />

        {/* Shutter flash animation overlay */}
        {isCapturingAnim && (
          <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200 pointer-events-none" />
        )}

        {/* Top overlay bubble controls */}
        <div className="flex items-center justify-between z-10">
          <div className="bg-black/60 backdrop-blur text-white text-xs px-3.5 py-1.5 rounded-full border border-white/20 font-bold flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Live Camera</span>
          </div>

          {/* Glare / Flash bubble button */}
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`text-xs px-4 py-1.5 rounded-full border-2 transition-all active:scale-95 cursor-pointer font-bold flex items-center gap-1.5 shadow-sm ${
              flashOn
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
            }`}
          >
            {flashOn ? <Zap className="w-3.5 h-3.5 fill-current" /> : <ZapOff className="w-3.5 h-3.5" />}
            <span>Glare Guard: {flashOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Viewfinder Target Framing Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-10">
          <div className="w-full h-full border-2 border-dashed border-teal-400/80 rounded-3xl relative flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />

            <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-full border border-teal-400/50 text-xs text-teal-200 text-center font-bold shadow-lg">
              Frame {currentStep.title} in center
            </div>
          </div>
        </div>

        {/* Bottom guidance prompt bubble */}
        <div className="z-10 bg-black/80 backdrop-blur p-3.5 rounded-2xl border border-white/15 text-white text-xs leading-relaxed shadow-lg">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
            <p className="font-semibold text-amber-100">{currentStep.guide}</p>
          </div>
        </div>
      </div>

      {/* Quality Meter */}
      <PhotoQualityMeter quality={quality} />

      {/* Multi-step Bubble Progress Indicator Pills */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStepIndex(idx)}
            className={`p-2.5 rounded-2xl border-2 text-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
              idx === currentStepIndex
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-md ring-2 ring-indigo-300'
                : idx < currentStepIndex
                ? 'bg-teal-50 text-teal-900 border-teal-300 font-bold'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="text-[10px] font-extrabold uppercase">Shot {idx + 1}</div>
            <div className="text-xs truncate font-bold mt-0.5">{s.title}</div>
          </button>
        ))}
      </div>

      {/* TACTILE BUBBLE CAMERA SHUTTER & CONTROLS */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-card flex items-center justify-around gap-4">
        {/* Left: Gallery Upload Bubble Button */}
        <label className="cursor-pointer group flex flex-col items-center gap-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleGalleryUpload}
          />
          <div className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 border-2 border-slate-300 text-slate-700 flex items-center justify-center transition shadow-2xs group-hover:border-slate-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-slate-600">Gallery</span>
        </label>

        {/* Center: BIG BUBBLE SHUTTER BUTTON (Like phone camera) */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleCapture}
            aria-label="Snap photo"
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-800 border-4 border-white shadow-float active:scale-90 flex items-center justify-center ring-4 ring-indigo-900/40 hover:ring-indigo-900/60 transition-all duration-200 cursor-pointer group"
          >
            {/* Inner bubble lens ring */}
            <div className="w-14 h-14 rounded-full bg-white group-active:scale-95 transition-transform flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7 text-indigo-900" />
            </div>
          </button>
          <span className="text-xs font-extrabold text-indigo-950">
            {currentStepIndex === steps.length - 1 ? 'Finish & Check' : 'Tap to Snap'}
          </span>
        </div>

        {/* Right: Quick Advance / Finish Bubble Button */}
        <button
          onClick={() => navigate('/check/analysis/live-capture')}
          className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition group"
        >
          <div className="w-14 h-14 rounded-full bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 text-teal-800 flex items-center justify-center shadow-2xs group-hover:border-teal-400">
            <Check className="w-6 h-6 font-bold" />
          </div>
          <span className="text-[11px] font-bold text-teal-800">Analyze</span>
        </button>
      </div>
    </div>
  );
}
