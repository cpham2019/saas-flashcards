import { NextRequest, NextResponse } from 'next/server';
import { getFlashcards } from '@/actions/getFlashcards'; // Update this path

export async function GET(req: NextRequest) {
    // Extract the docId from query parameters
    const url = req.nextUrl;
    const queryParams = url.searchParams;
    const docId = queryParams.get('docId');

    // Ensure docId is a string
    if (typeof docId !== 'string') {
        return NextResponse.json({ error: 'Invalid docId' }, { status: 400 });
    }

    try {
        // Fetch flashcards from Firestore
        const flashcards = await getFlashcards(docId);
        return NextResponse.json(flashcards, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
