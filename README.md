# Socratic AI Platform
Dilzafer Singh
@dilzafer
https://docs.google.com/document/d/1bAHmSKrVQGlWotWLgRqK1hRVRtWrxH_9b_bkrOVBKLg/edit?usp=sharing
An AI-powered Socratic tutor that guides students through brainstorming and structuring their essays using the Socratic method.

## Features

- **Socratic Method**: The AI never provides direct answers, instead guiding students with thoughtful questions
- **Real-time Streaming**: Responses stream in real-time for a natural conversation experience
- **Session Management**: All conversations are saved and linked to user accounts
- **Firebase Integration**: Uses Firestore for data persistence (demo mode available)
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (already configured in .env.local)
- Firebase project (optional - demo mode works without it)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Initialize the demo user (optional):
   - Visit [http://localhost:3000/api/init-demo](http://localhost:3000/api/init-demo)
   - This creates a demo user in Firebase

### Demo Login

Use these credentials to log in:
- **Password**: demo123
- **User ID**: alex-chen-demo (displayed on login page)

## Usage

1. **Login**: Enter the demo password on the login page
2. **Start a conversation**: Type your essay topic or question
3. **Engage with the tutor**: Answer the AI's guiding questions
4. **New chat**: Click "New Chat" to start a fresh conversation

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Streaming chat endpoint
│   │   └── init-demo/     # Demo user initialization
│   ├── chat/              # Main chat interface
│   ├── login/             # Login page
│   └── page.tsx           # Home page (redirects to login)
├── lib/
│   ├── db.ts              # Database helper functions
│   ├── firebase.ts        # Firebase configuration
│   └── openai.ts          # OpenAI configuration
├── components/            # Reusable components
└── types/                 # TypeScript type definitions
```

## Firebase Setup (Optional)

To use real Firebase instead of demo mode:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Add your Firebase config to `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## API Endpoints

### POST /api/chat
Handles all chat interactions with streaming responses.

Request body:
```json
{
  "userId": "string",
  "sessionId": "string | null",
  "message": "string"
}
```

### GET /api/init-demo
Initializes the demo user in the database.

## Development Notes

- The AI is configured to strictly follow the Socratic method
- All conversations are saved to Firestore for future teacher dashboard features
- The system uses streaming responses for better UX
- Session management tracks conversation history per topic

## Deployed on Vercel

https://dilzafer-hw3.vercel.app
