"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from './ui/button';

interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    downloadUrl: string;
    ref: string;
    createdAt: Date;
}

function AllDocs() {
    const { userId } = useAuth();
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchFiles = async () => {
            try {
                const db = getFirestore(app);
                const filesCollection = collection(db, `users/${userId}/files`);
                const filesSnapshot = await getDocs(filesCollection);
                const filesList = filesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as FileData[];

                setFiles(filesList);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [userId]);

    if (loading) return (
        <div className='flex justify-center itemscenter'>
            <span className="loading loading-dots loading-lg"></span>
        </div>
    );
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center justify-center">
            <Card className="w-[80%] h-[80%] mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">Your Files</CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <p className="text-center text-gray-500">No files available.</p>
                    ) : (
                        <ul>
                            {files.map((file) => (
                                <li key={file.id} className="border-b py-2">
                                    <Link href={`/dashboard/flashcards/${file.ref.split('/')[3]}`}>{file.name.split(".")[0]}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AllDocs;
