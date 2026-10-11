import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, History, BookOpen, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export function BottomTabBar() {
  const { t } = useTranslation();

  const tabs = [
    { to: '/', label: t('nav.check'), icon: ShieldCheck },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/learn', label: t('nav.learn'), icon: BookOpen },
    { to: '/profile', label: t('nav.profile'), icon: UserCircle },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 shadow-elevated sm:max-w-md sm:mx-auto lg:max-w-lg"
    >
      <div className="grid grid-cols-4 h-18 px-2 py-1.5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-h-[50px] py-1 transition-all duration-200 select-none cursor-pointer rounded-2xl active:scale-95',
                  isActive
                    ? 'text-indigo-950 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 font-semibold'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Bubble icon pill */}
                  <div
                    className={cn(
                      'w-12 h-8 flex items-center justify-center rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-indigo-900 text-white shadow-md scale-105'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] leading-tight mt-1 tracking-tight truncate max-w-[76px]">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
