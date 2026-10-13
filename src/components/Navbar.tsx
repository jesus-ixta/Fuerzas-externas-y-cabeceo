import React from 'react';
import { BookOpen, Activity, MessageSquareQuote, CheckSquare, Compass, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  evaluationCompleted?: boolean;
  score?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  evaluationCompleted,
  score,
}) => {
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'teoria',
      label: 'Teoría',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
    },
    {
      id: 'simulador',
      label: 'Simulador',
      icon: <Activity className="w-4 h-4 mr-2" />,
      badge: '3 Entornos',
    },
    {
      id: 'tutor',
      label: 'Tutor Socrático',
      icon: <MessageSquareQuote className="w-4 h-4 mr-2" />,
      badge: 'IA',
    },
    {
      id: 'evaluacion',
      label: 'Evaluación',
      icon: <CheckSquare className="w-4 h-4 mr-2" />,
      badge: evaluationCompleted ? `${score}/100` : '20 preguntas',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subject */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('teoria')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-800 tracking-tight">VibraLab</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Unidad 3
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Vibraciones Forzadas, Desbalanceo Rotatorio & Cabeceo de Flechas
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Navegación principal">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.id === 'evaluacion' && evaluationCompleted && (score ?? 0) >= 80
                          ? 'bg-teal-100 text-teal-800 font-extrabold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
