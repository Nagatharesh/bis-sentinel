import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CaptureGuidePage } from './pages/CaptureGuidePage';
import { ListingLinkPage } from './pages/ListingLinkPage';
import { LicenceInputPage } from './pages/LicenceInputPage';
import { AnalysisProgressPage } from './pages/AnalysisProgressPage';
import { ResultSummaryPage } from './pages/ResultSummaryPage';
import { EcoLoopPage } from './pages/EcoLoopPage';
import { ReportToBisPage } from './pages/ReportToBisPage';
import { HistoryPage } from './pages/HistoryPage';
import { LearnPage } from './pages/LearnPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAppStore } from './stores/appStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route
        path="/"
        element={
          !hasCompletedOnboarding ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <AppShell />
          )
        }
      >
        <Route index element={<HomePage />} />
        <Route path="check/capture" element={<CaptureGuidePage />} />
        <Route path="check/listing" element={<ListingLinkPage />} />
        <Route path="check/licence" element={<LicenceInputPage />} />
        <Route path="check/analysis/:checkId" element={<AnalysisProgressPage />} />
        <Route path="result/:id" element={<ResultSummaryPage />} />
        <Route path="eco/:id" element={<EcoLoopPage />} />
        <Route path="report/new/:id" element={<ReportToBisPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/methodology" element={<MethodologyPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootNavigator />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
