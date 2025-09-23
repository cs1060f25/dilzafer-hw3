export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  topic: string;
  createdAt: Date;
  summary?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  userId: string;
  sessionId: string | null;
  message: string;
}