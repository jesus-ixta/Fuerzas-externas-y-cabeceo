import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Excitación Armónica Externa',
    question: 'En un sistema de 1 GDL amortiguado sujeto a una fuerza externa F(t) = F₀·cos(ωt), ¿cuál es la forma general de la respuesta particular en régimen permanente xp(t)?',
    options: [
      'xp(t) = X·cos(ωt - ϕ), oscilando a la misma frecuencia ω con un desfase ϕ.',
      'xp(t) = X·e^(-ζωnt)·cos(ωdt), que decae exponencialmente a cero.',
      'xp(t) = X·cos(ωnt), oscilando siempre a la frecuencia natural propia ωn.',
      'xp(t) = (F₀/k)·cos(ωt), sin ningún desfase con la fuerza aplicada.'
    ],
    correctAnswer: 0,
    explanation: 'La respuesta forzada en estado estable (régimen permanente) ocurre a la misma frecuencia angular ω de la fuerza externa de excitación y presenta un retardo de fase ϕ respecto a dicha fuerza: xp(t) = X·cos(ωt - ϕ).'
  },
  {
    id: 2,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Resonancia No Amortiguada',
    question: 'Para un sistema ideal sin amortiguamiento (ζ = 0), ¿qué valor alcanza teóricamente la amplitud de vibración X cuando la frecuencia de excitación coincide con la frecuencia natural (r = ω/ωn = 1)?',
    options: [
      'La amplitud es nula (X = 0).',
      'La amplitud tiende a infinito (X → ∞).',
      'La amplitud es exactamente igual a la deflexión estática (X = δst).',
      'La amplitud oscila caóticamente sin valor definido.'
    ],
    correctAnswer: 1,
    explanation: 'Al anularse el denominador de la amplificación dinámica M = 1 / |1 - r²| cuando r = 1 y ζ = 0, la amplitud teórica en régimen permanente crece indefinidamente hacia el infinito.'
  },
  {
    id: 3,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Pico de Resonancia Amortiguada',
    question: 'En un sistema con amortiguamiento subcrítico (ζ < 1/√2 ≈ 0.707), ¿a qué relación de frecuencias r ocurre el valor máximo de amplitud (pico de resonancia)?',
    options: [
      'r = 1 + 2ζ²',
      'r = √(1 - 2ζ²), ligeramente por debajo de 1.',
      'r = 1 / √(1 - 2ζ²), ligeramente por encima de 1.',
      'r = 1 independientemente del valor de amortiguamiento ζ.'
    ],
    correctAnswer: 1,
    explanation: 'Derivando el denominador del factor de amplificación dinámica respecto a r e igualando a cero, se deduce que el pico de desplazamiento ocurre en rpico = √(1 - 2ζ²), el cual es menor a 1.'
  },
  {
    id: 4,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Ángulo de Desfase en Resonancia',
    question: '¿Cuál es el valor del ángulo de desfase ϕ entre la fuerza armónica aplicada y el desplazamiento permanente cuando el sistema opera exactamente en r = ω/ωn = 1?',
    options: [
      '0° (0 rad), la fuerza y el movimiento están en fase.',
      '45° (π/4 rad).',
      '90° (π/2 rad), en cuadratura de fase.',
      '180° (π rad), en oposición total de fase.'
    ],
    correctAnswer: 2,
    explanation: 'Como ϕ = arctan[2ζr / (1 - r²)], cuando r = 1 el denominador se hace cero y el argumento tiende a infinito, lo que significa que el ángulo de desfase es exactamente ϕ = 90° (π/2 radianes).'
  },
  {
    id: 5,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Zona de Rigidez',
    question: 'Si la frecuencia de excitación es muy baja respecto a la frecuencia natural (r << 1), ¿a qué valor físico se aproxima la amplitud dinámica X?',
    options: [
      'A la deflexión estática δst = F₀ / k.',
      'A cero, porque el sistema no puede oscilar.',
      'Al valor crítico X = F₀ / (c·ω).',
      'Al doble de la deflexión estática (2·δst).'
    ],
    correctAnswer: 0,
    explanation: 'Para r << 1, los términos de inercia (mω²) y amortiguamiento (cω) son despreciables frente a la rigidez k. Por tanto, el factor M(r, ζ) ≈ 1 y X ≈ F₀ / k = δst.'
  },
  {
    id: 6,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Zona de Inercia y Aislamiento',
    question: 'En la región de alta frecuencia (r >> 1, zona gobernada por masa e inercia), ¿cuál es el comportamiento del ángulo de fase ϕ y de la amplitud X?',
    options: [
      'ϕ → 0° y la amplitud crece con r².',
      'ϕ → 90° y la amplitud se mantiene constante.',
      'ϕ → 180° (en contrafase) y la amplitud X tiende asintóticamente a cero.',
      'ϕ se hace indeterminado y el sistema entra en resonancia secundaria.'
    ],
    correctAnswer: 2,
    explanation: 'A altas frecuencias (r >> 1), la masa domina completamente; la fuerza aplicada empuja en una dirección mientras la masa ya acelera en sentido contrario (ϕ → 180°), reduciéndose drásticamente la amplitud de oscilación X → 0.'
  },
  {
    id: 7,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Cálculo de Amortiguamiento Crítico',
    question: 'Un sistema tiene una masa m = 2 kg y una rigidez k = 800 N/m. ¿Cuál es el coeficiente de amortiguamiento crítico cc de este sistema?',
    options: [
      'cc = 40 N·s/m',
      'cc = 80 N·s/m',
      'cc = 160 N·s/m',
      'cc = 400 N·s/m'
    ],
    correctAnswer: 1,
    explanation: 'El amortiguamiento crítico se calcula como cc = 2·√(k·m) = 2·√(800 N/m × 2 kg) = 2·√1600 = 2 × 40 = 80 N·s/m.'
  },
  {
    id: 8,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Cálculo del Factor Dinámico M',
    question: 'Un sistema vibratorio con razón de amortiguamiento ζ = 0.05 opera exactamente a su frecuencia de resonancia r = 1. ¿Cuál es su factor de amplificación dinámica M(1, 0.05)?',
    options: [
      'M = 1.05',
      'M = 5.0',
      'M = 10.0',
      'M = 20.0'
    ],
    correctAnswer: 2,
    explanation: 'En r = 1, la fórmula es M = 1 / (2·ζ). Sustituyendo ζ = 0.05: M = 1 / (2 × 0.05) = 1 / 0.10 = 10. La amplitud dinámica es 10 veces mayor que la deflexión estática.'
  },
  {
    id: 9,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Frecuencia Natural de un Motor',
    question: 'Un motor eléctrico de masa m = 20 kg se instala sobre 4 aisladores de vibración de rigidez k = 20,000 N/m cada uno (rigidez total k = 80,000 N/m). ¿Cuál es la frecuencia natural propia ωn del montaje?',
    options: [
      'ωn = 20.0 rad/s',
      'ωn = 40.0 rad/s',
      'ωn = 63.25 rad/s (aprox. 10.07 Hz)',
      'ωn = 400.0 rad/s'
    ],
    correctAnswer: 2,
    explanation: 'La frecuencia natural no amortiguada es ωn = √(k/m) = √(80,000 / 20) = √4000 ≈ 63.25 rad/s. En ciclos por segundo: fn = 63.25 / (2π) ≈ 10.07 Hz.'
  },
  {
    id: 10,
    topic: '3.1',
    topicTitle: 'Tema 3.1: Transmisibilidad y Aislamiento',
    question: 'Para lograr un aislamiento de vibraciones efectivo (transmisibilidad TR < 1 hacia la cimentación), ¿qué condición debe cumplir la relación de frecuencias r?',
    options: [
      'r < 1',
      'r = 1',
      'r > √2 ≈ 1.414',
      'r debe ser igual a 0.707'
    ],
    correctAnswer: 2,
    explanation: 'La condición matemática para que la transmisibilidad sea menor a la unidad (TR < 1) y exista aislamiento activo de vibraciones es r > √2 (la frecuencia de operación debe superar el 141.4% de la frecuencia natural).'
  },
  {
    id: 11,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Fuerza Centrífuga Desbalanceada',
    question: '¿Cuál es la expresión de la fuerza centrífuga generada por un rotor que contiene una masa desbalanceada me a una distancia excéntrica e girando a velocidad angular ω?',
    options: [
      'F₀ = me · g',
      'F₀ = me · e · ω',
      'F₀ = me · e · ω²',
      'F₀ = (me / m) · e · ω'
    ],
    correctAnswer: 2,
    explanation: 'La aceleración centrípeta de una masa que gira a radio e es an = e·ω². Por la segunda ley de Newton, la fuerza centrífuga radial es F₀ = me · e · ω².'
  },
  {
    id: 12,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Diferencia Esencial con Fuerza Constante',
    question: 'A diferencia de una fuerza armónica constante (F₀ fija), en el desbalanceo rotatorio la amplitud de la fuerza excitadora:',
    options: [
      'Disminuye con el inverso de la velocidad (1/ω).',
      'Permanece constante sin importar las RPM.',
      'Crece con el cuadrado de la velocidad de rotación (proporcional a ω²).',
      'Es proporcional únicamente a la raíz cuadrada de la velocidad (√ω).'
    ],
    correctAnswer: 2,
    explanation: 'Debido a la naturaleza inercial centrífuga, al duplicar la velocidad de giro (2ω), la fuerza desbalanceada que sacude los apoyos se multiplica por cuatro (2² = 4).'
  },
  {
    id: 13,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Amplitud Asintótica Supercrítica',
    question: 'En un sistema con desbalanceo rotatorio, cuando la velocidad angular es extremadamente alta (r = ω/ωn >> 1), ¿hacia qué valor asintótico tiende la amplitud de vibración X?',
    options: [
      'X → ∞',
      'X → 0',
      'X → (me · e) / m',
      'X → e'
    ],
    correctAnswer: 2,
    explanation: 'La expresión adimensional es (m·X)/(me·e) = r² / √[(1 - r²)² + (2ζr)²]. Cuando r >> 1, el cociente r² / r² = 1, por lo que X → (me · e) / m (un valor finito constante independiente de la velocidad).'
  },
  {
    id: 14,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Significado Físico del Auto-Centrado',
    question: '¿Qué significado físico tiene que a velocidades supercríticas (r >> 1) la amplitud de oscilación tienda al valor X = (me · e) / m?',
    options: [
      'Que el motor se apaga espontáneamente por sobrecarga.',
      'Que el centro de masa del conjunto permanece inmóvil sobre el eje de rotación (auto-centrado dinámico).',
      'Que los cojinetes sufren el máximo desgaste catastrófico.',
      'Que la masa desbalanceada me se desprende por fuerza centrífuga.'
    ],
    correctAnswer: 1,
    explanation: 'El sistema se reorienta geométricamente en contrafase (180°) de manera tal que el centro de gravedad total del rotor coincide con la línea geométrica de centros, dejando de desplazarse radialmente.'
  },
  {
    id: 15,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Cálculo de Desbalanceo Numérico',
    question: 'Una máquina de masa total m = 100 kg posee una masa desbalanceada me = 0.5 kg a una excentricidad e = 4 mm. A altísima velocidad de rotación (r >> 1), ¿cuál será la amplitud X de vibración de la máquina?',
    options: [
      'X = 0.02 mm (20 µm)',
      'X = 0.20 mm (200 µm)',
      'X = 2.0 mm',
      'X = 4.0 mm'
    ],
    correctAnswer: 0,
    explanation: 'Aplicando la fórmula del límite asintótico: X = (me · e) / m = (0.5 kg × 4 mm) / 100 kg = 2 / 100 = 0.02 mm = 20 µm.'
  },
  {
    id: 16,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Definición de Velocidad Crítica',
    question: '¿Qué es conceptualmente la "Velocidad Crítica" (ωc) de una flecha o eje de transmisión rotativo?',
    options: [
      'La velocidad máxima a la que los rodamientos pueden girar antes de perder lubricación.',
      'La velocidad de rotación ω que coincide numéricamente con la frecuencia natural de vibración lateral de la flecha.',
      'La velocidad a la que se rompe por torsión estática pura.',
      'La velocidad a la que el eje deja de transmitir par motor.'
    ],
    correctAnswer: 1,
    explanation: 'La velocidad crítica de giro de un eje es la velocidad angular a la cual la fuerza centrífuga sincronizada excita la frecuencia natural de flexión propia de la flecha, provocando resonancia y gran cabeceo.'
  },
  {
    id: 17,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Los Tres Centros de Cabeceo (Whirling)',
    question: 'En el análisis de cabeceo de flechas (shaft whirling), ¿cuáles son los 3 puntos de referencia analizados en la sección transversal del rotor?',
    options: [
      'Centro de gravedad (G), Centro de flotabilidad (B) y Metacentro (M).',
      'Centro de cojinetes/apoyos (O), Centro geométrico del eje deformado (S) y Centro de masa del rotor (G).',
      'Polo norte magnético, Polo sur y Entrehierro del estator.',
      'Eje neutro, Eje polar y Centroide de torsión.'
    ],
    correctAnswer: 1,
    explanation: 'En cabeceo sincrónico se estudian O (línea recta fija de los cojinetes), S (centro geométrico de la sección curvada del eje a distancia radial rd) y G (centro de gravedad real de la masa del disco a distancia e de S).'
  },
  {
    id: 18,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Orientación en Régimen Subcrítico',
    question: 'Si una flecha rotatoria no amortiguada opera por debajo de su velocidad crítica (r = ω/ωc < 1), ¿cuál es la orientación del centro de masa G respecto al centro geométrico del eje S y al centro O?',
    options: [
      'G se sitúa por fuera de S (en la misma dirección radial respecto a O, en fase).',
      'G se ubica exactamente en O (completamente centrado).',
      'G se sitúa entre O y S (en oposición de fase).',
      'G gira a una frecuencia angular diferente de S.'
    ],
    correctAnswer: 0,
    explanation: 'A velocidades subcríticas (r < 1), el ángulo de fase es cero; la deflexión elástica del eje y la excentricidad suman sus radios (distancia total de O a G es rd + e), con G ubicado hacia el exterior.'
  },
  {
    id: 19,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Transición Supercrítica de Laval',
    question: 'Al acelerar una turbina de flecha flexible y superar ampliamente su velocidad crítica (r > 1, régimen supercrítico), ¿qué ocurre con la configuración de los centros?',
    options: [
      'El eje se fractura inevitablemente debido a que la deflexión sigue creciendo.',
      'El ángulo de fase rota hacia 180° y el centro de masa G se ubica entre S y O, tendiendo a alinearse con O.',
      'El disco rotor deja de girar y solo vibra torsionalmentemente.',
      'La fuerza sobre los cojinetes se vuelve infinita.'
    ],
    correctAnswer: 1,
    explanation: 'En régimen supercrítico, el desfase cambia a 180°: el centro de masa G pasa a situarse entre el centro del eje S y la línea de apoyos O. Esto produce el auto-centrado descubierto por Gustaf de Laval.'
  },
  {
    id: 20,
    topic: '3.2',
    topicTitle: 'Tema 3.2: Cálculo de Velocidad Crítica de Flecha',
    question: 'Una flecha soporta en su centro un disco de masa m = 100 kg. La rigidez equivalente a flexión de la flecha es k = 4 × 10⁶ N/m. ¿Cuál es la velocidad crítica en RPM de este ensamble?',
    options: [
      'Nc ≈ 955 RPM',
      'Nc ≈ 1910 RPM (200 rad/s)',
      'Nc ≈ 3820 RPM',
      'Nc ≈ 6000 RPM'
    ],
    correctAnswer: 1,
    explanation: 'La velocidad crítica en rad/s es ωc = √(k/m) = √(4,000,000 / 100) = √40,000 = 200 rad/s. Convirtiendo a RPM: Nc = (ωc × 60) / (2π) = (200 × 60) / 6.283185 = 12,000 / 6.283185 ≈ 1909.86 RPM ≈ 1910 RPM.'
  }
];
