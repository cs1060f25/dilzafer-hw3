import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  setDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { User, Session, Message } from '@/types';

// User functions
export async function createUser(userId: string, name: string, email: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    name,
    email,
    createdAt: serverTimestamp()
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }
  
  const data = userDoc.data();
  return {
    id: userDoc.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt?.toDate() || new Date()
  };
}

// Session functions
export async function createSession(userId: string, topic: string): Promise<string> {
  const sessionsRef = collection(db, 'sessions');
  const docRef = await addDoc(sessionsRef, {
    userId,
    topic,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);
  
  if (!sessionDoc.exists()) {
    return null;
  }
  
  const data = sessionDoc.data();
  return {
    id: sessionDoc.id,
    userId: data.userId,
    topic: data.topic,
    createdAt: data.createdAt?.toDate() || new Date(),
    summary: data.summary
  };
}

// Message functions
export async function addMessage(
  sessionId: string, 
  role: 'user' | 'assistant', 
  content: string
): Promise<void> {
  const messagesRef = collection(db, `sessions/${sessionId}/messages`);
  await addDoc(messagesRef, {
    role,
    content,
    timestamp: serverTimestamp()
  });
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const messagesRef = collection(db, `sessions/${sessionId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const messagesSnap = await getDocs(q);
  
  return messagesSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      role: data.role,
      content: data.content,
      timestamp: data.timestamp?.toDate() || new Date()
    };
  });
}