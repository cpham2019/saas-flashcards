// In your Next.js API route or server-side function
"use server";

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

export async function getFlashcards(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found");
    }

    try {
        const docRef = adminDb.collection("users").doc(userId).collection("flashcards").doc(docId);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Flashcards not found");
        }

        const flashcardsData = docSnapshot.data();
        return flashcardsData?.flashcards || [];
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        throw new Error("Failed to fetch flashcards.");
    }
}
