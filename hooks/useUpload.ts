"use client"

import { generateFlashcards } from "@/actions/generateFlashcards";
// import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { useState } from "react"
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
    UPLOADING = "Uploading file...",
    UPLOADED = "File uploaded successfully",
    SAVING = "Saving file to database...",
    GENERATING = "Generating your flashcards... Almost done"
}

export type Status = StatusText[keyof StatusText]

function useUpload() {
    const [progress, setProgress] = useState<number | null>(null);
    const [fileId, setfileId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const { user } = useUser();

    const handleUpload = async (file: File) => {
        if (!user || !file) return;
        
        const fileIdToUploadTo = uuidv4(); // example: 124314jk-wjf2ioj-w flwj

        const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`)

        const uploadTask = uploadBytesResumable(storageRef, file); // task that is ongoing

        uploadTask.on("state_changed", (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes) * 100);
            setStatus(StatusText.UPLOADING);
            setProgress(percent);
        }, (error) => { // if any error occurs
            console.error("Error uploading the file", error);
        }, async () => { // after completing the previous upload
            setStatus(StatusText.UPLOADED);

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            setStatus(StatusText.SAVING);

            await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
                name: file.name,
                size: file.size,
                type: file.type,
                downloadUrl: downloadUrl,
                ref: uploadTask.snapshot.ref.fullPath,
                createdAt: new Date(),
            })

            setStatus(StatusText.GENERATING);

            await generateFlashcards(fileIdToUploadTo);

            setfileId(fileIdToUploadTo);
        })
    }
    return { progress, status, fileId, handleUpload}
}

export default useUpload