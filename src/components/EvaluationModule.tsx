import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, MessageSquareQuote, Award, ArrowRight, CheckSquare, HelpCircle, BookOpen, UserCheck } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuizResult } from '../types';
import { Certificate } from './Certificate';

interface EvaluationModuleProps {
  onGoToTutor: () => void;
  onGoToSimulators: () => void;
  onResultCalculated?: (score: number) => void;
}

export const EvaluationModule: React.FC<EvaluationModuleProps> = ({
  onGoToTutor,
  onGoToSimulators,
  onResultCalculated,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const [studentName, setStudentName] = useState<string>('Jesús Ixta');
  const [institution, setInstitution] = useState<string>('Instituto Tecnológico Superior de Comalcalco');
  const [nameError, setNameError] = useState<string | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmit = () => {
    if (!studentName.trim()) {
      setNameError('Por favor ingresa el nombre del alumno para la constancia antes de enviar la evaluación.');
      const el = document.getElementById('student-info-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setNameError(null);

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `Has respondido ${answeredCount} de las ${totalQuestions} preguntas. ¿Deseas enviar la evaluación con las preguntas restantes en blanco?`
      );
      if (!confirmSubmit) return;
    }

    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 80;

    const quizRes: QuizResult = {
      score,
      totalQuestions,
      percentage: score,
      passed,
      userAnswers,
      completedAt: new Date().toISOString(),
    };

    setResult(quizRes);
    setSubmitted(true);
    if (onResultCalculated) {
      onResultCalculated(score);
    }

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If passed (score >= 80), show certificate with option to review answers
  if (submitted && result && result.passed) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <Certificate
          score={result.score}
          onReturnToApp={handleReset}
          studentName={studentName}
          institution={institution}
        />

        {/* Detailed Question Review Accordion */}
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-600" />
              Revisión Detallada de Respuestas ({result.score}/100 pts)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
              Evaluación Aprobada con Honores
            </span>
          </div>

          <div className="space-y-5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-teal-50/30 border-teal-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Pregunta {idx + 1} • {q.topicTitle}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta (+5 pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> Incorrecta (0 pts)
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm text-slate-800 mb-3">{q.question}</p>

                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctAnswer;
                      const isOptionSelected = oIdx === selected;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border ${
                            isOptionCorrect
                              ? 'bg-teal-100/70 border-teal-300 font-bold text-teal-900'
                              : isOptionSelected && !isCorrect
                              ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)})</span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                    <strong className="text-slate-800">Justificación pedagógica:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If failed (score < 80) and submitted
  if (submitted && result && !result.passed) {
    // Topic breakdown
    let score31 = 0;
    let total31 = 0;
    let score32 = 0;
    let total32 = 0;

    QUIZ_QUESTIONS.forEach((q) => {
      if (q.topic === '3.1') {
        total31 += 1;
        if (userAnswers[q.id] === q.correctAnswer) score31 += 1;
      } else {
        total32 += 1;
        if (userAnswers[q.id] === q.correctAnswer) score32 += 1;
      }
    });

    const percent31 = Math.round((score31 / total31) * 100);
    const percent32 = Math.round((score32 / total32) * 100);

    return (
      <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
        {/* Failed Feedback Card */}
        <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Retroalimentación Formativa
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Calificación Obtenida: {result.score} / 100 puntos
                </h2>
                <p className="text-xs text-slate-500">
                  Se requiere un mínimo de <strong>80 puntos</strong> para acreditar y desbloquear la Constancia Oficial Digital.
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Intentar de Nuevo</span>
            </button>
          </div>

          {/* Breakdown by Topic */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">
              Diagnóstico por Subtema para Reforzar:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-700">Tema 3.1: Fuerza Armónica Directa</span>
                  <span className="font-bold text-xs text-blue-700">{percent31}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${percent31 >= 80 ? 'bg-teal-600' : 'bg-amber-500'}`}
                    style={{ width: `${percent31}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {score31} de {total31} reactivos correctos. Revisa el factor de amplificación M(r, ζ), resonancia y el ángulo de desfase ϕ.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-700">Tema 3.2: Desbalanceo y Cabeceo</span>
                  <span className="font-bold text-xs text-teal-700">{percent32}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${percent32 >= 80 ? 'bg-teal-600' : 'bg-amber-500'}`}
                    style={{ width: `${percent32}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {score32} de {total32} reactivos correctos. Revisa la fuerza centrífuga me·e·ω², velocidad crítica ωc y cabeceo supercrítico.
                </p>
              </div>
            </div>
          </div>

          {/* Action Navigation Recommendations */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <p className="font-bold text-blue-900">¿Necesitas ayuda para comprender los conceptos fallidos?</p>
              <p className="text-slate-600">
                Interactúa con el <strong>Tutor Socrático</strong> para que te guíe paso a paso o vuelve a experimentar en el <strong>Simulador</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onGoToTutor}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Consultar Tutor</span>
              </button>
              <button
                onClick={onGoToSimulators}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ir al Simulador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Review of Answers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Revisión Pregunta por Pregunta y Explicaciones
          </h3>

          <div className="space-y-5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-teal-50/30 border-teal-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Pregunta {idx + 1} • {q.topicTitle}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta (+5 pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> Incorrecta (0 pts)
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm text-slate-800 mb-3">{q.question}</p>

                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctAnswer;
                      const isOptionSelected = oIdx === selected;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border ${
                            isOptionCorrect
                              ? 'bg-teal-100/70 border-teal-300 font-bold text-teal-900'
                              : isOptionSelected && !isCorrect
                              ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)})</span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                    <strong className="text-slate-800">Explicación oficial:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View (Not yet submitted)
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Quiz Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <CheckSquare className="w-3.5 h-3.5" />
              Evaluación Sumativa Oficial
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Examen de Unidad 3: 20 Reactivos Teórico-Prácticos
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Cubre los subtemas 3.1 (Excitación Armónica) y 3.2 (Desbalanceo y Cabeceo de Flechas). Ponderación: 5 pts por reactivo (Total: 100 pts).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Progreso</span>
            <span className="text-lg font-extrabold text-blue-600 font-mono">
              {answeredCount} / {totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Student Data Registration Card for Certificate */}
      <div
        id="student-info-section"
        className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs transition-all ${
          nameError ? 'border-rose-400 ring-2 ring-rose-200' : 'border-blue-200 ring-1 ring-blue-50/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Datos del Alumno para la Constancia Oficial
              </h3>
              <p className="text-xs text-slate-500">
                Escribe tu nombre completo para emitir automáticamente tu diploma de acreditación al aprobar.
              </p>
            </div>
          </div>
          {studentName.trim() ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Nombre registrado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Requerido para constancia
            </span>
          )}
        </div>

        {nameError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{nameError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre Completo del Alumno <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="Ej. Jesús Ixta / Ing. Juan Pérez"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-800 bg-white placeholder:font-normal placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Este nombre figurará en el encabezado oficial y folio criptográfico.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Institución / Carrera / Matrícula (Opcional):
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Ej. TecNM Comalcalco - Ingeniería Mecatrónica"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-800 bg-white placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Aparecerá como subtítulo institucional en la constancia.
            </p>
          </div>
        </div>
      </div>

      {/* 20 Questions List */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;

          return (
            <div
              key={q.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs transition-all ${
                isAnswered ? 'border-blue-200 ring-1 ring-blue-50' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                  Reactivo {idx + 1} de {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {q.topicTitle}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-relaxed">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-950 font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Bottom Submit Card */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600 space-y-0.5">
          <div>
            Respondidas: <strong className="text-slate-900">{answeredCount}</strong> de <strong>{totalQuestions}</strong> preguntas.
            {answeredCount === totalQuestions && (
              <span className="text-teal-600 font-bold ml-2">✓ ¡Cuestionario completo!</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">
            Alumno para constancia: <strong className={studentName.trim() ? "text-blue-700 font-bold" : "text-amber-600 font-bold"}>
              {studentName.trim() || '⚠️ Sin registrar'}
            </strong>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Calificar y Enviar Evaluación</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
