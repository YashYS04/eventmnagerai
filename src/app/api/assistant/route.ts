import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'fallback');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, stadiumContext } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Using gemini-2.5-flash as it's the valid quota model for this API key.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const contextPrompt = `
      You are an expert Stadium Manager AI Assistant. Your goal is to logically solve attendee issues to improve the event experience and reduce crowd friction.
      
      Current Real-Time Stadium Context:
      - Stadium Status: ${stadiumContext?.timing?.status} (Hours: ${stadiumContext?.timing?.openingTime} - ${stadiumContext?.timing?.closingTime})
      - Active Events: ${stadiumContext?.activeEvents?.map((e: any) => `${e.name} (${e.type}) - ${e.date} at ${e.time} [${e.status}]`).join(' | ')}
      - Seats: ${stadiumContext?.seats?.filled} / ${stadiumContext?.seats?.total} filled.
      - Food Court: Wait time is ${stadiumContext?.foodCourt?.waitTimeMinutes} minutes. Open: ${stadiumContext?.foodCourt?.isOpen}
      - Entry Gates: 
        Gate A wait: ${stadiumContext?.entryGates?.['Gate A']?.waitTimeMinutes}m.
        Gate B wait: ${stadiumContext?.entryGates?.['Gate B']?.waitTimeMinutes}m.
        Gate C wait: ${stadiumContext?.entryGates?.['Gate C']?.waitTimeMinutes}m.
      - Washrooms - North Block (${stadiumContext?.washrooms?.['North Block']?.cleanLevel}% clean), South Block (${stadiumContext?.washrooms?.['South Block']?.cleanLevel}% clean, Needs Maintenance: ${stadiumContext?.washrooms?.['South Block']?.requiresMaintenance}), VIP (${stadiumContext?.washrooms?.['VIP Section']?.cleanLevel}% clean).
      
      User's Request: "${prompt}"
      
      Response Protocol:
      - Be extremely friendly but concise.
      - If they ask for food, mention the wait time.
      - If they ask for entry, direct them to the gate with the SHORTEST wait time right now.
      - If they ask for a washroom, direct them away from South Block if it needs maintenance, suggest North or VIP instead.
      - Do not output markdown lists if unnecessary, just natural conversation. Write a maximum of 3 sentences. Let's think step by step internally if needed, but ONLY output the final user-facing response.
    `;

    const result = await model.generateContent(contextPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, text: responseText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request', details: error.message }, { status: 500 });
  }
}
