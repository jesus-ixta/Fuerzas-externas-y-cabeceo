import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = [
  "Eres un distinguido Profesor Pedagogo y Doctor en Ingeniería Mecánica y Mecatrónica, especialista en Dinámica de Sistemas y Vibraciones Mecánicas para la Unidad 3:",
  "- Tema 3.1: Análisis de sistemas con excitación armónica externa: m·x'' + c·x' + k·x = F₀·cos(ωt), solución particular, factor de amplificación dinámica M(r, ζ) = 1 / sqrt((1 - r²)² + (2ζr)²), resonancia (r ≈ 1) y desfase ϕ = arctan(2ζr / (1 - r²)).",
  "- Tema 3.2: Desbalanceo rotatorio m·x'' + c·x' + k·x = (m_e · e · ω²) · sin(ωt), amplitud X = (m_e·e / m) · [r² / sqrt((1 - r²)² + (2ζr)²)], velocidad crítica y fenómeno de cabeceo de flechas rotatorias (whirling of shafts con deflexión elástica centrífuga).",
  "",
  "REGLA PEDAGÓGICA ABSOLUTA (MÉTODO SOCRÁTICO):",
  "1. NUNCA des la respuesta numérica, solución directa o clave de los problemas de tarea ni de la evaluación de 20 preguntas.",
  "2. Tu misión es guiar al estudiante a que ÉL MISMO descubra el principio físico o el paso matemático mediante preguntas reflexivas, pistas conceptuales y analogías con la vida real o maquinaria industrial (motores, ventiladores, turbinas, centrifugadoras).",
  "3. Si el alumno te pregunta una respuesta de un ejercicio o examen, responde cordialmente recordando que como tutor socrático no revelas las soluciones, pero ayúdale a identificar qué variables tiene (masa, rigidez, frecuencia natural, etc.) y hazle una pregunta guía para que lo resuelva.",
  "4. Explica con calidez, entusiasmo por la ciencia e ingeniería, claridad y rigor técnico. Mantén tus respuestas concisas (2 a 4 párrafos o listas cortas) para que la conversación sea interactiva y fluida.",
  "",
  "REGLA CRUCIAL DE FORMATO DE ECUACIONES (ESTRICTO):",
  "- NUNCA pongas fórmulas o ecuaciones dentro de bloques de código de programación (evita comillas invertidas de código ``` o `...`). Las fórmulas NO son código.",
  "- Usa SIEMPRE notación LaTeX estándar entre signos de dólar:",
  "  * Para ecuaciones destacadas en bloque propio usa doble signo de dólar: $$m\\ddot{x} + c\\dot{x} + kx = F_0 \\cos(\\omega t)$$ o $$X = \\frac{m_e e}{m} \\frac{r^2}{\\sqrt{(1-r^2)^2 + (2\\zeta r)^2}}$$",
  "  * Para variables o expresiones en línea usa signo simple de dólar: $r = \\omega/\\omega_n$, $\\zeta$, $\\phi = 90^\\circ$, $X = F_0/k$, $\\omega_c = \\sqrt{k/m}$."
].join('\n');

// API endpoint for Socratic Tutor
app.post('/api/socratic-tutor', async (req, res) => {
  try {
    const { messages, userQuestion } = req.body;

    if (!userQuestion && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content || msg.text || '' }],
        });
      }
    } else if (userQuestion) {
      contents.push({
        role: 'user',
        parts: [{ text: userQuestion }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No se pudo generar una respuesta. Por favor reflexiona sobre la relación de frecuencias $r = \\omega/\\omega_n$.';
    res.json({ reply });
  } catch (error: any) {
    console.warn('Gemini API call returned status, applying pedagogical Socratic fallback engine:', error?.message);

    const q = (req.body.userQuestion || '').toLowerCase();
    let socraticGuidance = '';

    if (q.includes('resonancia') || q.includes('máxima') || q.includes('baja') || q.includes('amortiguamiento')) {
      socraticGuidance = [
        '¡Excelente pregunta sobre el núcleo de la dinámica vibratoria!',
        '',
        'Para descubrir la razón profunda, observemos la ecuación de balance dinámico:',
        '',
        '$$m\\ddot{x} + c\\dot{x} + kx = F_0 \\cos(\\omega t)$$',
        '',
        'Analicemos qué ocurre cuando la frecuencia de excitación $\\omega$ es igual a la frecuencia natural $\\omega_n = \\sqrt{k/m}$:',
        '1. La fuerza inercial ($-m\\omega^2 X$) y la fuerza elástica restauradora ($k X$) tienen exactamente la misma magnitud pero signos opuestos. ¿Qué le ocurre entonces a la suma de esas dos fuerzas?',
        '2. Si la inercia y la rigidez se anulan mutuamente en cada ciclo, ¿qué única fuerza queda en el sistema para oponerse a la fuerza externa $F_0$?',
        '3. Si el coeficiente de amortiguamiento $c$ es muy pequeño, ¿cuánta oposición física encuentra la fuerza de excitación?',
        '',
        '¿Cómo se relaciona esto con la expresión en resonancia pura?',
        '',
        '$$X = \\frac{F_0}{c\\omega}$$'
      ].join('\n');
    } else if (q.includes('diferencia') || q.includes('desbalanceo') || q.includes('velocidad') || q.includes('aumenta')) {
      socraticGuidance = [
        '¡Una de las comparaciones más cruciales en el diseño de turbomaquinaria y motores!',
        '',
        'Pensemos en cómo se origina la fuerza en cada caso:',
        '1. En el **Tema 3.1 (Fuerza Externa Directa)**: la amplitud $F_0$ es producida por un actuador o fuente independiente que no cambia aunque el sistema oscile más rápido o más lento.',
        '2. En el **Tema 3.2 (Desbalanceo Rotatorio)**: la fuerza nace de una masa excéntrica $m_e$ que gira a radio $e$. Recuerda la física fundamental de la aceleración centrípeta:',
        '',
        '$$F(\\omega) = m_e \\cdot e \\cdot \\omega^2$$',
        '',
        '3. Ahora reflexiona: cuando $\\omega \\to 0$, ¿cuál de los dos sistemas sigue ejerciendo fuerza estática y cuál produce fuerza cero? Y a velocidades hipercríticas ($\\omega \\to \\infty$), ¿por qué el desbalanceo no produce amplitud infinita sino que se estabiliza en:',
        '',
        '$$X \\to \\frac{m_e \\cdot e}{m}$$',
        '',
        '¿Qué crees que ocurre físicamente con el centro de gravedad del rotor a altísimas RPM?'
      ].join('\n');
    } else if (q.includes('fase') || q.includes('supera') || q.includes('frecuencia natural') || q.includes('alta')) {
      socraticGuidance = [
        '¡Un fenómeno fascinante que desafía la intuición cotidiana!',
        '',
        'Examinemos la ecuación del ángulo de retraso de fase:',
        '',
        '$$\\phi = \\arctan\\left(\\frac{2\\zeta r}{1 - r^2}\\right)$$',
        '',
        'Donde $r = \\omega / \\omega_n$:',
        '1. Cuando la frecuencia es muy baja ($r \\ll 1$), el denominador $(1 - r^2) \\approx 1 > 0$. ¿Cuánto vale aproximadamente $\\arctan(0)$? ¿La masa se mueve al mismo tiempo que la fuerza?',
        '2. En resonancia exacta ($r = 1$), el denominador se anula. ¿Hacia qué ángulo se dispara $\\phi$?',
        '3. Ahora, cuando la excitación es altísima ($r \\gg 1$), el término $-r^2$ domina y el denominador se vuelve intensamente negativo. ¿En qué cuadrante termina el ángulo de fase y a qué valor límite tiende?',
        '4. Físicamente: si la fuerza empuja hacia la derecha a frecuencia muy rápida, pero la inercia de la masa aún viene rebotando hacia la izquierda, ¿cómo describirías el movimiento relativo de la masa respecto a la fuerza aplicada?'
      ].join('\n');
    } else {
      socraticGuidance = [
        '¡Muy interesante planteamiento para reflexionar!',
        '',
        'Para llegar a la deducción rigurosa por ti mismo, descompongamos el problema en tres preguntas guía:',
        '1. **Régimen de Operación:** ¿Cuál es la relación de frecuencias $r = \\omega / \\omega_n$ en tu caso? ¿Estamos en la zona de rigidez ($r \\ll 1$), resonancia ($r \\approx 1$) o inercia ($r \\gg 1$)?',
        '2. **Fuerzas en Conflicto:** ¿Quién domina en este instante: la fuerza del resorte ($kx$), el amortiguador ($c\\dot{x}$) o la inercia ($m\\ddot{x}$)?',
        '3. **Efecto Físico:** Si modificas el amortiguamiento $\\zeta$ o la rigidez $k$, ¿cómo se desplazaría el punto de operación en la curva de amplificación dinámica $M$?',
        '',
        'Dime qué observas en el simulador al variar ese parámetro y deduzcamos el resultado juntos.'
      ].join('\n');
    }

    res.json({ reply: socraticGuidance });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VibraLab server running at http://0.0.0.0:${port}`);
  });
}

startServer();
