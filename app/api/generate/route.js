import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    You are a flashcard creator.
    Your ultimate goal is to create a comprehensive and effective set of flashcards that will assist users in learning and retaining new information in an enjoyable and efficient manner.

    Make sure to create exactly 5 flashcards.
    Both back and front should be one sentence long.

    Make sure to display the front of all cards at first when loaded in.
    Make sure to display the back of all cards when the card is clicked.
    Return in the following JSON format:
    {
        "flashcards": [
            {
                "front": str,
                "back": str
            }
        ]
    }
`;

export async function POST(req) {
    try {
        const openai = new OpenAI();
        const data = await req.json();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data.text },
            ],
            model: 'gpt-4',
        });

        const messageContent = completion.choices[0]?.message?.content;

        if (!messageContent) {
            throw new Error('No content found in response message');
        }

        let flashcards;
        try {
            flashcards = JSON.parse(messageContent);
        } catch (e) {
            throw new Error('Error parsing flashcards JSON');
        }

        if (!flashcards || !Array.isArray(flashcards.flashcards)) {
            throw new Error('Invalid flashcards format');
        }

        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error.message);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}
