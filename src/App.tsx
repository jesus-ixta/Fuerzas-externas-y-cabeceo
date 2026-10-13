import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TheoryModule } from './components/TheoryModule';
import { SimulatorsModule } from './components/SimulatorsModule';
import { SocraticTutor } from './components/SocraticTutor';
import { EvaluationModule } from './components/EvaluationModule';
import { ActiveTab } from './types';
import { BookOpen, Activity, MessageSquareQuote, CheckSquare, Compass, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('teoria');
  const [evaluationScore, setEvaluationScore] = useState<number | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        evaluationCompleted={evaluationScore !== undefined}
        score={evaluationScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'teoria' && (
          <TheoryModule onGoToSimulator={() => setActiveTab('simulador')} />
        )}

        {activeTab === 'simulador' && (
          <SimulatorsModule />
        )}

        {activeTab === 'tutor' && (
          <SocraticTutor />
        )}

        {activeTab === 'evaluacion' && (
          <EvaluationModule
            onGoToTutor={() => setActiveTab('tutor')}
            onGoToSimulators={() => setActiveTab('simulador')}
            onResultCalculated={(s) => setEvaluationScore(s)}
          />
        )}
      </main>

      {/* Footer (hidden in print) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              V
            </div>
            <span className="font-semibold text-slate-700">VibraLab</span>
            <span className="text-slate-400">•</span>
            <span>Unidad 3: Vibración Forzada Armónica, Desbalanceo y Cabeceo</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('teoria')}
              className="text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              Teoría
            </button>
            <button
              onClick={() => setActiveTab('simulador')}
              className="text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className="text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              Tutor Socrático
            </button>
            <button
              onClick={() => setActiveTab('evaluacion')}
              className="text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              Evaluación (20 Preguntas)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
