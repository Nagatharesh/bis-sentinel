import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomTabBar } from './BottomTabBar';
import { OfflineBanner } from '../common/OfflineBanner';
import { ChatFAB } from '../chatbot/ChatFAB';
import { ChatPanel } from '../chatbot/ChatPanel';
import { DemoScenarioDrawer } from '../common/DemoScenarioDrawer';

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-32">
      <OfflineBanner />
      <Header />

      {/* Clean, centered consumer view with ample margin and zero unnecessary desktop side clutter */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-5 sm:py-7">
        <Outlet />
      </main>

      {/* Discreet Presenter Demo Scenarios Drawer (subtle pill in corner) */}
      <DemoScenarioDrawer />

      {/* Multilingual Voice Chatbot Assistant */}
      <ChatFAB />
      <ChatPanel />

      {/* Persistent Bottom Tab Navigation */}
      <BottomTabBar />
    </div>
  );
}
