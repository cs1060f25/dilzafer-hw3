import { createUser, getUser } from './db';

export async function initializeDemoUser() {
  const DEMO_USER_ID = 'alex-chen-demo';
  
  try {
    // Check if demo user already exists
    const existingUser = await getUser(DEMO_USER_ID);
    
    if (!existingUser) {
      // Create demo user
      await createUser(
        DEMO_USER_ID,
        'Alex Chen',
        'alex.chen@demo.com'
      );
      console.log('Demo user created successfully');
    } else {
      console.log('Demo user already exists');
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
  }
}