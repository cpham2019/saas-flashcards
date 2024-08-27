"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardsProps {
    docId: string;
}

function Flashcards ({params: {id}} : {params: {id: string}}) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                console.log(id)
                const response = await axios.get<Flashcard[]>(`/api/flashcards?docId=${id}`);
                setFlashcards(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, [id]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1));
        setShowAnswer(false);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0));
        setShowAnswer(false);
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    if (loading) return (
        <span className="loading loading-dots loading-lg"></span>
    );
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    const currentFlashcard = flashcards[currentIndex];

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-white w-full">
            {flashcards.length === 0 ? (
                <p className="text-center text-gray-500">No flashcards available.</p>
            ) : (
                <Card className="w-full max-w-md mx-auto p-5 drop-shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center">
                           {currentFlashcard.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {showAnswer && (
                            <p className="text-gray-700">
                                {currentFlashcard.answer}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button variant="outline" onClick={handlePrev}>Previous</Button>
                        <Button variant="outline" onClick={toggleAnswer} className={`${showAnswer? "bg-green-400" : "bg-yellow-200"}`}>
                            {showAnswer ? 'Hide Answer' : 'Show Answer'}
                        </Button>
                        <Button variant="outline" onClick={handleNext}>Next</Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

export default Flashcards;
