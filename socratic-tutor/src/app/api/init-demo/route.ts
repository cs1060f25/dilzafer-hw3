import { initializeDemoUser } from '@/lib/init-demo-user';

export async function GET() {
  try {
    await initializeDemoUser();
    return Response.json({ success: true, message: 'Demo user initialized' });
  } catch (error) {
    console.error('Error initializing demo user:', error);
    return Response.json({ success: false, error: 'Failed to initialize demo user' }, { status: 500 });
  }
}