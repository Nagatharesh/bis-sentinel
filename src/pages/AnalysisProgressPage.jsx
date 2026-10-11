import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { StepTracker } from '../components/common/StepTracker';
import { Button } from '../components/ui/Button';
import { useCheckStore } from '../stores/checkStore';
import { PRELOADED_SCENARIOS } from '../services/mockData';
import { checkService } from '../services/checkService';
import { useTranslation } from 'react-i18next';

export function AnalysisProgressPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkId } = useParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([
    { id: 'step1', title: t('analysis.step1'), detail: 'Extracting optical boundaries and lighting balance' },
    { id: 'step2', title: t('analysis.step2'), detail: 'Locating ISI or CRS certification symbol' },
    { id: 'step3', title: t('analysis.step3'), detail: 'Recognizing CM/L or R-number string' },
    { id: 'step4', title: t('analysis.step4'), detail: 'Connecting to central BIS public records database' },
    { id: 'step5', title: t('analysis.step5'), detail: 'Evaluating Claim, Identity, Scope, and Validity' },
  ]);

  const setActiveCheck = useCheckStore((state) => state.setActiveCheck);

  // Determine target scenario based on checkId or payload
  let targetScenario = PRELOADED_SCENARIOS[0]; // default kettle
  if (checkId?.includes('helmet') || checkId?.includes('7200456')) {
    targetScenario = PRELOADED_SCENARIOS[1];
  } else if (checkId?.includes('charger') || checkId?.includes('??') || checkId?.includes('partial')) {
    targetScenario = PRELOADED_SCENARIOS[2];
  } else if (checkId?.includes('fridge') || checkId?.includes('9100234')) {
    targetScenario = PRELOADED_SCENARIOS[3];
  }

  useEffect(() => {
    // If it's Scenario 3 (charger), simulate partial failure on step 3
    const isPartialScenario = targetScenario.scenarioId === 3;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          if (isPartialScenario && prev === 2) {
            // Step 3 blurred
            setSteps((old) => {
              const updated = [...old];
              updated[2] = {
                ...updated[2],
                status: 'failed',
                detail: 'Digits partly obscured by glare. Only partial string (CM/L-72??914) recovered.',
              };
              return updated;
            });
          }
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete
          setTimeout(() => {
            setActiveCheck(targetScenario);
            navigate(`/result/${targetScenario.id}`, { replace: true });
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [targetScenario]);

  const handleSkip = () => {
    setActiveCheck(targetScenario);
    navigate(`/result/${targetScenario.id}`, { replace: true });
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="text-center pt-2">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <ShieldCheck className="w-8 h-8 animate-pulse text-indigo-800" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t('analysis.title')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto">
          {t('analysis.subtitle')}
        </p>
      </div>

      {/* Vertical Step Tracker */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-subtle">
        <StepTracker steps={steps} currentStepIndex={currentStepIndex} />

        {/* Honest note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <p>{t('analysis.honestNote')}</p>
        </div>
      </div>

      {/* Skip button for fast previewing */}
      <div className="text-center">
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
        >
          Skip animation and view result summary →
        </button>
      </div>
    </div>
  );
}
