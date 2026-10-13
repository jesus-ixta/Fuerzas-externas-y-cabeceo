export type ActiveTab = 'teoria' | 'simulador' | 'tutor' | 'evaluacion';

export type SimulatorTab = 'armonica' | 'desbalanceo' | 'cabeceo';

export interface QuizQuestion {
  id: number;
  topic: '3.1' | '3.2';
  topicTitle: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  userAnswers: Record<number, number>;
  completedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
