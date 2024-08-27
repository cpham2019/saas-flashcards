"use server"

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import axios from "axios";
import admin from 'firebase-admin';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function generateFlashcards(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found");
    }

    try {
        console.log("Fetching download URL from Firestore database");
        const firebaseRef = await adminDb
            .collection("users").doc(userId).collection("files").doc(docId).get();
        
        const downloadUrl = firebaseRef.data()?.downloadUrl;

        if (!downloadUrl) {
            throw new Error("Download URL not found");
        }

        const pdfBlob = await fetch(downloadUrl).then(
            (res) => res.blob()
        );

        const loader = new PDFLoader(pdfBlob);
        const docs = await loader.load();

        console.log("--- Splitting the document into smaller parts... ---");
        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(docs);

        let pdfText = splitDocs.map(doc => doc.pageContent).join(" ");

        const prompt = `Generate an array of flashcards in the form of questions and answers from the following content. Return the result only in a JSON array format (without any other text, just the JSON array), where each element is an object containing a "question" and an "answer":\n${pdfText}`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.1-8b-instruct:free",
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Log the raw response data for debugging
        const flashcardsText = response.data.choices[0].message.content.trim();
        console.log("Raw flashcards text:", flashcardsText);

        let flashcards;
        try {
            flashcards = JSON.parse(flashcardsText);
        } catch (error) {
            console.error("Error parsing flashcards JSON:", error);
            throw new Error("Failed to parse flashcards JSON.");
        }

        await admin.firestore().collection("users").doc(userId).collection("flashcards").doc(docId).set({
            flashcards, // Store as a string
            createdAt: new Date(),
        });

        console.log("Flashcards generated and saved successfully.");
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards.");
    }
}
