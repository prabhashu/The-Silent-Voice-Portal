import { NextResponse } from 'next/server';
import { generateCounselorChatResponse, ChatMessage } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body as { message?: string; history?: ChatMessage[] };

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { reply, isCrisis } = await generateCounselorChatResponse(
      message.trim(),
      Array.isArray(history) ? history : []
    );

    return NextResponse.json({ reply, isCrisis });
  } catch (error) {
    console.error('Error in /api/counselor:', error);
    return NextResponse.json(
      {
        reply: "I'm always here to listen. It looks like there was a temporary connection hiccup, but please remember you are safe. If this is an emergency, call 1926 or 1333 anytime.",
        isCrisis: false,
      },
      { status: 500 }
    );
  }
}
