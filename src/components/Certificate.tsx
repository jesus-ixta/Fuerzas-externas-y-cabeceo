import React, { useState } from 'react';
import { Award, Printer, ArrowLeft, CheckCircle2, ShieldCheck, Calendar, Hash, UserCheck, Sparkles } from 'lucide-react';

interface CertificateProps {
  score: number;
  onReturnToApp: () => void;
  studentName?: string;
  institution?: string;
}

export const Certificate: React.FC<CertificateProps> = ({
  score,
  onReturnToApp,
  studentName: initialStudentName = 'Jesús Ixta',
  institution: initialInstitution = 'Instituto Tecnológico Superior de Comalcalco',
}) => {
  const [studentName, setStudentName] = useState(initialStudentName);
  const [institution, setInstitution] = useState(initialInstitution);

  // Formatted date in Spanish
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Unique digital folio
  const folio = React.useMemo(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `FOLIO-VM3-2026-${code}`;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              ¡Felicidades! Constancia Oficial de Acreditación Desbloqueada
            </h3>
            <p className="text-xs text-slate-500">
              Calificación aprobatoria obtenida: <strong className="text-teal-700">{score} / 100 puntos</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar Constancia en PDF / Imprimir</span>
          </button>

          <button
            onClick={onReturnToApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>⬅ Regresar a la Aplicación / Volver al Menú Principal</span>
          </button>
        </div>
      </div>

      {/* Editable Name Quick Prompt in Screen mode */}
      <div className="no-print bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900">
          <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Personalizar Nombre:</strong> Puedes modificar el nombre del alumno para que se imprima correctamente en tu constancia.
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Escribe tu nombre completo..."
            className="px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-slate-800 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* CERTIFICATE DOCUMENT (OPTIMIZED FOR PRINT AND DISPLAY)       */}
      {/* ============================================================ */}
      <div
        id="certificate-print-area"
        className="bg-white border-8 border-double border-slate-300 rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden text-slate-800"
      >
        {/* Decorative Guilloche Border Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-blue-600 rounded-br-2xl pointer-events-none" />

        {/* Watermark Emblem */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-[450px] h-[450px] text-blue-900" />
        </div>

        {/* Certificate Content Container */}
        <div className="relative z-10 text-center space-y-6">
          {/* Institution Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              ACADEMIA DE INGENIERÍA MECÁNICA Y MECATRÓNICA
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-wide text-slate-900 uppercase">
              Constancia de Acreditación Digital
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 tracking-wider uppercase font-medium">
              Vibraciones Mecánicas • Certificación de Competencias de Unidad
            </p>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 mx-auto rounded-full my-4" />

          {/* Recipient Text */}
          <div className="space-y-2 py-2">
            <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
              Se hace constar con honores que:
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-700 tracking-tight font-sans py-1 border-b-2 border-slate-200 inline-block min-w-[320px]">
              {studentName || 'Estudiante Evaluado'}
            </h2>
            {institution && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-1">
                {institution}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto pt-2 leading-relaxed font-serif">
              Ha demostrado dominio riguroso y aprobatorio en las competencias analíticas y prácticas de la asignatura:
            </p>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 font-sans tracking-tight">
              «Vibraciones Mecánicas — Unidad 3: Excitación Armónica Forzada, Desbalanceo Rotatorio y Cabeceo de Flechas»
            </h3>
          </div>

          {/* Academic Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto py-4 border-y border-slate-100">
            <div className="p-3 bg-slate-50/80 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Calificación Obtenida</span>
              <span className="text-xl sm:text-2xl font-extrabold text-teal-700 font-mono">
                {score} / 100 pts
              </span>
              <span className="text-[10px] text-teal-800 font-semibold block mt-0.5">ACREDITADO SATISFACTORIAMENTE</span>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Fecha de Expedición</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-1">
                {formattedDate}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sistema Oficial en Línea</span>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Folio de Verificación</span>
              <span className="text-xs font-mono font-bold text-blue-700 block mt-1 tracking-wider">
                {folio}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Criptográficamente Válido</span>
            </div>
          </div>

          {/* Signatures & Seal Area */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-3xl mx-auto text-xs text-slate-600">
            {/* Signature 1 */}
            <div className="text-center space-y-1 w-52">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center font-serif italic text-slate-700 text-sm">
                Dr. Ing. E. Ramos V.
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Dirección de Academia</p>
              <p className="text-[10px] text-slate-500">Dinámica de Máquinas y Vibraciones</p>
            </div>

            {/* Official Seal Badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-blue-600/40 p-1 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-white flex flex-col items-center justify-center shadow-md">
                  <Award className="w-6 h-6 mb-0.5" />
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-center leading-tight">
                    SELLO DIGITAL<br />ACREDITADO
                  </span>
                </div>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="text-center space-y-1 w-52">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center font-serif italic text-slate-700 text-sm">
                VibraLab Plataforma
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Sistema Automatizado</p>
              <p className="text-[10px] text-slate-500">Evaluación Rigurosa de 20 Reactivos</p>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="pt-4 text-[10px] text-slate-400">
            Documento digital emitido por el Entorno Virtual de Aprendizaje VibraLab para el programa de Vibraciones Mecánicas.
            Válido como constancia de acreditación técnica en temas 3.1 (Excitación Armónica) y 3.2 (Desbalanceo y Cabeceo).
          </div>
        </div>
      </div>
    </div>
  );
};
