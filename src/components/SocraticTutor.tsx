import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquareQuote, HelpCircle, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { MathMarkdown } from './MathMarkdown';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: `¡Bienvenido al espacio de tutoría personalizada en Dinámica de Sistemas y Vibraciones Mecánicas!

Soy tu Profesor y Tutor Socrático. Mi propósito pedagógico no es resolverte los ejercicios directamente, sino acompañarte mediante preguntas clave y deducciones guiadas para que desarrolles una intuición sólida sobre la respuesta armónica, resonancia, desfase, desbalanceo rotatorio y cabeceo de flechas.

¿Qué fenómeno o concepto te gustaría investigar el día de hoy?`,
    timestamp: 'Ahora',
  },
];

const SUGGESTED_QUESTIONS = [
  "¿Por qué la amplitud es máxima en resonancia aunque el amortiguamiento sea bajo?",
  "¿Qué diferencia hay entre una fuerza armónica constante y el desbalanceo rotatorio cuando aumenta la velocidad?",
  "¿Qué ocurre con la fase cuando la frecuencia de excitación supera ampliamente la frecuencia natural?",
];

export const SocraticTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/socratic-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userQuestion: question,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      const assistantReply = data.reply || data.fallback || 'Por favor reflexiona sobre la relación de frecuencias del sistema.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Tutor error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `Reflexionemos juntos sobre tu duda:

Para abordar lo que planteas, pensemos primero en las variables fundamentales:
1. ¿Cuál es la relación de frecuencias $r = \\omega / \\omega_n$?
2. ¿Qué término domina la ecuación diferencial en ese régimen: la inercia ($m\\omega^2$), el amortiguamiento ($c\\omega$) o la rigidez ($k$)?

Intenta decirme qué ocurre con el denominador cuando $r \\approx 1$ o cuando $r \\gg 1$.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fadeIn">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Tutor Pedagógico Socrático</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Método Dialéctico
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Guía formativa en tiempo real. Te asiste con preguntas orientadoras sin revelar respuestas directas.
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
          title="Reiniciar conversación"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reiniciar Chat</span>
        </button>
      </div>

      {/* Suggested Questions Pill Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Preguntas Sugeridas para Iniciar el Diálogo Pedagógico:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SUGGESTED_QUESTIONS.map((question, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(question)}
              disabled={isLoading}
              className="text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-900 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-between"
            >
              <span className="line-clamp-3 leading-relaxed mb-2">"{question}"</span>
              <span className="text-[10px] font-bold text-blue-600 mt-auto flex items-center gap-1">
                Preguntar al tutor &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-teal-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <MathMarkdown content={msg.content} isUser={isUser} />
                  <div
                    className={`text-[10px] mt-2 font-medium ${
                      isUser ? 'text-blue-200 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 ml-1">El profesor está formulando una pregunta guía...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Box */}
        <div className="border-t border-slate-100 pt-3 mt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu duda conceptual o hipótesis para que el profesor te oriente..."
                rows={2}
                className="w-full resize-none px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-1.5 text-center">
            Nota pedagógica: El tutor utiliza el método socrático para enriquecer tu aprendizaje autónomo y crítico.
          </p>
        </div>
      </div>
    </div>
  );
};
