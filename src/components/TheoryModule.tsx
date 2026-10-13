import React, { useState } from 'react';
import { BookOpen, Layers, Zap, RotateCw, AlertTriangle, ArrowRight, Gauge, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Latex } from './Latex';

export const TheoryModule: React.FC<{ onGoToSimulator?: () => void }> = ({ onGoToSimulator }) => {
  const [activeSubtopic, setActiveSubtopic] = useState<'3.1' | '3.2'>('3.1');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('deduccion');

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              Programa Académico Oficial de Vibraciones Mecánicas
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Unidad 3: Vibración Forzada y Desbalanceo en Sistemas Mecánicos
            </h1>
            <p className="text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
              Comprende la respuesta dinámica en régimen permanente de sistemas de un grado de libertad (1 GDL)
              sujetos a excitaciones armónicas directas y fuerzas centrífugas por desbalanceo rotatorio y cabeceo de ejes.
            </p>
          </div>
          {onGoToSimulator && (
            <button
              onClick={onGoToSimulator}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
            >
              <span>Abrir Simuladores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subtopic Selector Tabs */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <button
            onClick={() => setActiveSubtopic('3.1')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeSubtopic === '3.1'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Tema 3.1: Fuerza Armónica Externa</span>
          </button>
          <button
            onClick={() => setActiveSubtopic('3.2')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeSubtopic === '3.2'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Tema 3.2: Desbalanceo Rotatorio & Cabeceo (Whirling)</span>
          </button>
        </div>
      </div>

      {/* CONTENT FOR SUBTOPIC 3.1 */}
      {activeSubtopic === '3.1' && (
        <div className="space-y-6">
          {/* Card: Ecuación Gobernadora y Modelo Físico */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                3.1
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Modelo Físico y Ecuación Diferencial Gobernadora
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Consideremos un sistema masa-resorte-amortiguador con masa <Latex math="m" />, rigidez <Latex math="k" /> y coeficiente de amortiguamiento viscoso <Latex math="c" />, excitado por una fuerza externa armónica <Latex math="F(t) = F_0 \cos(\omega t)" />:
            </p>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl my-4 text-center">
              <Latex math="m \ddot{x}(t) + c \dot{x}(t) + k x(t) = F_0 \cos(\omega t)" displayMode />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">Frecuencia Natural</span>
                <Latex math="\omega_n = \sqrt{\frac{k}{m}}" displayMode />
                <p className="text-xs text-slate-600 text-center mt-1">Frecuencia propia no amortiguada (rad/s)</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Razón de Amortiguamiento</span>
                <Latex math="\zeta = \frac{c}{c_c} = \frac{c}{2\sqrt{km}} = \frac{c}{2m\omega_n}" displayMode />
                <p className="text-xs text-slate-600 text-center mt-1">Factor adimensional de disipación</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block mb-1">Relación de Frecuencias</span>
                <Latex math="r = \frac{\omega}{\omega_n}" displayMode />
                <p className="text-xs text-slate-600 text-center mt-1">Parámetro de sintonización de excitación</p>
              </div>
            </div>
          </div>

          {/* Accordion 1: Solución en Régimen Permanente y Factor M */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('deduccion')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">
                  Respuesta en Régimen Permanente (Estado Estable) y Factor de Amplificación M(r, ζ)
                </span>
              </div>
              {expandedAccordion === 'deduccion' ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedAccordion === 'deduccion' && (
              <div className="p-6 pt-0 border-t border-slate-100 space-y-5">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  La solución total consta de dos partes: la solución homogénea transitoria <Latex math="x_h(t)" /> (que decae a cero con el tiempo debido a la presencia de amortiguamiento viscoso) y la solución particular permanente <Latex math="x_p(t)" />, que permanece indefinidamente a la misma frecuencia <Latex math="\omega" /> de la fuerza externa pero desfasada un ángulo <Latex math="\phi" />:
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <Latex math="x_p(t) = X \cos(\omega t - \phi)" displayMode />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Amplitud de Vibración Permanente <Latex math="X" />
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      Sustituyendo <Latex math="x_p(t)" /> en la ecuación diferencial e igualando componentes armónicas:
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg text-center overflow-x-auto">
                      <Latex
                        math="X = \frac{F_0}{\sqrt{(k - m\omega^2)^2 + (c\omega)^2}} = \frac{F_0 / k}{\sqrt{(1 - r^2)^2 + (2\zeta r)^2}} = \delta_{st} \cdot M(r, \zeta)"
                        displayMode
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Donde <Latex math="\delta_{st} = \frac{F_0}{k}" /> es la <strong>deflexión estática</strong> provocada por una fuerza constante de magnitud <Latex math="F_0" />.
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      Ángulo de Fase <Latex math="\phi" />
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      El retardo de fase entre la fuerza armónica aplicada y la respuesta de desplazamiento:
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg text-center overflow-x-auto">
                      <Latex
                        math="\phi = \arctan\left(\frac{c\omega}{k - m\omega^2}\right) = \arctan\left(\frac{2\zeta r}{1 - r^2}\right)"
                        displayMode
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      El ángulo <Latex math="\phi" /> varía continuamente desde <Latex math="0^\circ" /> (para <Latex math="r \ll 1" />) hasta <Latex math="180^\circ" /> (para <Latex math="r \gg 1" />), cruzando exactamente por <Latex math="90^\circ" /> en resonancia (<Latex math="r = 1" />).
                    </p>
                  </div>
                </div>

                {/* Factor de Amplificación Dinámica M */}
                <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <h4 className="text-base font-bold text-blue-900 mb-2">
                    Factor de Amplificación Dinámica (Magnificación) <Latex math="M(r, \zeta)" />
                  </h4>
                  <Latex
                    math="M(r, \zeta) = \frac{X}{\delta_{st}} = \frac{1}{\sqrt{(1 - r^2)^2 + (2\zeta r)^2}}"
                    displayMode
                  />
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                    Representa cuántas veces la respuesta dinámica supera a la respuesta que tendría la estructura si la misma fuerza <Latex math="F_0" /> se aplicara de manera puramente estática.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card: Análisis Detallado de las 3 Zonas de Frecuencia y Resonancia */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Comportamiento por Zonas de Frecuencia y Resonancia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Zona 1: Rigidez */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                  Zona 1: Baja Frecuencia (<Latex math="r \ll 1" />)
                </div>
                <h4 className="font-bold text-slate-850 text-sm mb-2">Controlada por Rigidez</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>La fuerza elástica del resorte <Latex math="kx" /> domina sobre la inercia y amortiguamiento.</li>
                  <li><Latex math="M \approx 1" /> y por lo tanto <Latex math="X \approx \delta_{st} = F_0 / k" />.</li>
                  <li>El desplazamiento oscila prácticamente en fase con la fuerza: <Latex math="\phi \approx 0^\circ" />.</li>
                </ul>
              </div>

              {/* Zona 2: Resonancia */}
              <div className="p-5 border-2 border-rose-300 rounded-xl bg-rose-50/50 relative">
                <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  ¡Crítica!
                </span>
                <div className="inline-block px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold mb-2">
                  Zona 2: Resonancia (<Latex math="r \approx 1" />)
                </div>
                <h4 className="font-bold text-rose-900 text-sm mb-2">Controlada por Amortiguamiento</h4>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                  <li>La inercia cancela la rigidez (<Latex math="k - m\omega^2 \approx 0" />).</li>
                  <li>En <Latex math="r = 1" />, <Latex math="M = \frac{1}{2\zeta}" />. Si <Latex math="\zeta = 0.05" />, ¡la amplitud se amplifica 10 veces!</li>
                  <li>El desfase es exactamente <Latex math="\phi = 90^\circ" /> (<Latex math="\pi/2" /> rad).</li>
                  <li>El pico de amplitud ocurre en <Latex math="r_{pico} = \sqrt{1 - 2\zeta^2}" /> con valor máximo <Latex math="M_{max} = \frac{1}{2\zeta\sqrt{1-\zeta^2}}" />.</li>
                </ul>
              </div>

              {/* Zona 3: Inercia */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                <div className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-2">
                  Zona 3: Alta Frecuencia (<Latex math="r \gg 1" />)
                </div>
                <h4 className="font-bold text-slate-850 text-sm mb-2">Controlada por Inercia / Masa</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>La inercia <Latex math="m\ddot{x}" /> domina completamente la ecuación.</li>
                  <li>El factor dinámico se aproxima a <Latex math="M \approx \frac{1}{r^2} \to 0" />.</li>
                  <li>La masa oscila en completa oposición de fase con la fuerza: <Latex math="\phi \to 180^\circ" />.</li>
                  <li>Principio de base para el <strong>aislamiento de vibraciones pasivo</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT FOR SUBTOPIC 3.2 */}
      {activeSubtopic === '3.2' && (
        <div className="space-y-6">
          {/* Card: Desbalanceo Rotatorio */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                3.2
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Desbalanceo Rotatorio en Maquinaria Industrial
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              El desbalanceo rotatorio es la fuente más común de vibración destructiva en máquinas rotativas (motores eléctricos, bombas, turbinas, ventiladores y compresores). Ocurre cuando el centro de gravedad de la masa rotatoria no coincide con el eje geométrico de rotación debido a tolerancias de fabricación, desgaste, cavitación o incrustaciones.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Fuerza Centrífuga Excitadora Proporcional a <Latex math="\omega^2" />
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Una masa desbalanceada <Latex math="m_e" /> con excentricidad radial <Latex math="e" /> girando a velocidad angular <Latex math="\omega" /> genera una fuerza centrífuga que varía con el tiempo:
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-center mb-3">
                  <Latex math="F_{desbalance}(t) = (m_e \cdot e \cdot \omega^2) \sin(\omega t)" displayMode />
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Diferencia clave con Tema 3.1:</strong> Aquí la amplitud de la fuerza NO es constante (<Latex math="F_0" /> fija), sino que <strong>crece cuadráticamente con la velocidad angular</strong> <Latex math="\omega^2" />. A mayor velocidad, la fuerza de excitación se dispara.
                  </span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Ecuación de Amplitud de Respuesta
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Considerando la masa total de la máquina <Latex math="m" /> montada sobre soportes elásticos:
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-center mb-3">
                  <Latex
                    math="X = \frac{m_e \cdot e}{m} \cdot \frac{r^2}{\sqrt{(1 - r^2)^2 + (2\zeta r)^2}}"
                    displayMode
                  />
                </div>
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Forma adimensional:</strong> <Latex math="\frac{m X}{m_e e} = \frac{r^2}{\sqrt{(1 - r^2)^2 + (2\zeta r)^2}}" />. A velocidad muy baja (<Latex math="r \to 0" />), la amplitud es nula (<Latex math="X \to 0" />). A velocidad muy alta (<Latex math="r \to \infty" />), la amplitud tiende al límite finito <Latex math="X \to \frac{m_e e}{m}" />.
                  </span>
                </div>
              </div>
            </div>

            {/* Comparativa 3.1 vs 3.2 */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Característica</th>
                    <th className="p-3 border-b border-slate-200 text-blue-700">Tema 3.1: Fuerza Armónica Directa</th>
                    <th className="p-3 border-b border-slate-200 text-teal-700">Tema 3.2: Desbalanceo Rotatorio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Magnitud de la fuerza excitadora</td>
                    <td className="p-3">Constante: <Latex math="F_0" /> fija independiente de <Latex math="\omega" /></td>
                    <td className="p-3 font-semibold text-teal-800">Variable: <Latex math="F_0 = m_e e \omega^2" /> cuadrática con la velocidad</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Respuesta a baja velocidad (<Latex math="r \to 0" />)</td>
                    <td className="p-3">Tiende a la deflexión estática <Latex math="\delta_{st} = F_0 / k" /></td>
                    <td className="p-3">Tiende a cero (<Latex math="X \to 0" />), no hay vibración si no gira</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Respuesta a altísima velocidad (<Latex math="r \gg 1" />)</td>
                    <td className="p-3">Tiende a cero (<Latex math="X \to 0" />)</td>
                    <td className="p-3">Tiende al valor finito <Latex math="X \to \frac{m_e e}{m}" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Pico de resonancia</td>
                    <td className="p-3">En <Latex math="r = \sqrt{1 - 2\zeta^2}" /> (&lt; 1)</td>
                    <td className="p-3">En <Latex math="r = \frac{1}{\sqrt{1 - 2\zeta^2}}" /> (&gt; 1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Cabeceo de Flechas Rotatorias (Whirling of Shafts) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                3.2.B
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Cabeceo de Flechas Rotatorias (Whirling of Shafts) y Velocidad Crítica
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Cuando una flecha elástica con un rotor o disco gira a alta velocidad, la fuerza centrífuga debida a la excentricidad del centro de masa provoca una deflexión radial lateral del eje. Esta flexión rotativa sincronizada se conoce como <strong>cabeceo (whirling)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center mb-2">1</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Los 3 Centros Fundamentales</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  En cada sección transversal analizamos:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 mt-2 list-disc pl-4">
                  <li><strong>O:</strong> Eje de cojinetes (centro de giro fijo).</li>
                  <li><strong>S:</strong> Centro geométrico del eje deformado elásticamente a distancia <Latex math="r_d" /> de <Latex math="O" />.</li>
                  <li><strong>G:</strong> Centro de masa real del disco a distancia excéntrica <Latex math="e" /> respecto a <Latex math="S" />.</li>
                </ul>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center mb-2">2</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Equilibrio Dinámico Radial</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  La fuerza centrífuga neta <Latex math="m\omega^2(r_d + e)" /> se equilibra con la fuerza elástica restauradora de la flecha <Latex math="k r_d" />:
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 text-center">
                  <Latex math="r_d = \frac{e \omega^2}{\omega_n^2 - \omega^2} = \frac{e \cdot r^2}{1 - r^2}" displayMode />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  (Para sistema no amortiguado)
                </p>
              </div>

              <div className="p-5 border-2 border-teal-300 rounded-xl bg-teal-50/50">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
                <h4 className="font-bold text-teal-900 text-sm mb-1">Velocidad Crítica <Latex math="\omega_c" /></h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  La <strong>velocidad crítica</strong> coincide numéricamente con la frecuencia natural lateral de flexión del eje:
                </p>
                <div className="p-2 bg-white rounded border border-teal-200 text-center">
                  <Latex math="\omega_c = \sqrt{\frac{k}{m}} \implies N_c = \frac{60}{2\pi}\sqrt{\frac{k}{m}} \text{ RPM}" displayMode />
                </div>
                <p className="text-[11px] text-teal-800 mt-2">
                  En <Latex math="\omega = \omega_c" />, la deflexión teóricamente tiende a infinito. El paso rápido por esta velocidad evita la rotura del eje.
                </p>
              </div>
            </div>

            {/* Auto-centrado de Laval */}
            <div className="mt-6 p-5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <RotateCw className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-blue-900">
                  Fenómeno de Auto-Centrado Supercrítico (Principio del Rotor de De Laval)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Cuando la flecha opera en régimen supercrítico (<Latex math="\omega \gg \omega_c" />, <Latex math="r \gg 1" />), el ángulo de fase entre la deflexión del eje y la fuerza centrífuga se invierte a <Latex math="180^\circ" />. En esta condición, el centro de masa <Latex math="G" /> se reubica exactamente en la línea de centros de los apoyos <Latex math="O" />, haciendo que el rotor gire con notable estabilidad y sin transmitir fuerzas oscilatorias apreciables a los cojinetes. ¡Este principio permite operar turbinas a más de 30,000 RPM de manera segura!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
