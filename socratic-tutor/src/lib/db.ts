import { User, Session, Message } from '@/types';

// In-memory storage
const users = new Map<string, User>();
const sessions = new Map<string, Session>();
const messages = new Map<string, Message[]>();

// User functions
export async function createUser(userId: string, name: string, email: string): Promise<void> {
  users.set(userId, {
    id: userId,
    name,
    email,
    createdAt: new Date()
  });
}

export async function getUser(userId: string): Promise<User | null> {
  return users.get(userId) || null;
}

// Session functions
export async function createSession(userId: string, topic: string): Promise<string> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions.set(sessionId, {
    id: sessionId,
    userId,
    topic,
    createdAt: new Date()
  });
  messages.set(sessionId, []);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  return sessions.get(sessionId) || null;
}

// Message functions
export async function addMessage(
  sessionId: string, 
  role: 'user' | 'assistant', 
  content: string
): Promise<void> {
  const sessionMessages = messages.get(sessionId) || [];
  sessionMessages.push({
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: new Date()
  });
  messages.set(sessionId, sessionMessages);
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  return messages.get(sessionId) || [];
}

// Initialize a default user for testing
const DEFAULT_USER_ID = 'default_user';
createUser(DEFAULT_USER_ID, 'Default User', 'user@example.com');