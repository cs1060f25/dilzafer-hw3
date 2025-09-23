import { NextRequest } from 'next/server';
import openai, { SOCRATIC_SYSTEM_PROMPT } from '@/lib/openai';
import { 
  createSession, 
  addMessage, 
  getMessages
} from '@/lib/db';
import { ChatRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { sessionId, message } = body;

    // Use default user ID
    const userId = 'default_user';

    // Validate request body
    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let currentSessionId = sessionId;

    // Create new session if needed
    if (!currentSessionId) {
      currentSessionId = await createSession(userId, message);
    }

    // Save user message
    await addMessage(currentSessionId, 'user', message);

    // Get conversation history
    const messages = await getMessages(currentSessionId);
    
    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system' as const, content: SOCRATIC_SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: openaiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500
    });

    let fullResponse = '';
    
    // Create a readable stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            fullResponse += text;
            
            // Send chunk as SSE format
            const sseData = `data: ${JSON.stringify({ 
              text, 
              sessionId: currentSessionId 
            })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }

          // Save AI response to database after streaming is complete
          if (fullResponse) {
            await addMessage(currentSessionId, 'assistant', fullResponse);
          }

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}