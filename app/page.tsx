import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <div className="flex space-y-5 flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-300 to-white">
    <div className="flex flex-col space-y-5 justify-center items-center border rounded-xl shadow-2xl p-8 m-4">
      <h1 className="text-3xl font-extrabold">Your favorite <span className="shadow-lg bg-slate-300">AI flashcard</span> generator</h1>
      <p className="text-center text-xl">Upload your notes in PDF format. And get the questions you need to ace that exam in an instant.</p>
      <p className="font-bold">PS: The contents of the PDF should be actual text and not photos.</p>
      <Button asChild>
        <Link href="/dashboard">Get Started</Link>
      </Button>
    </div>
  </div>;
}
