import Header from "@/components/Header";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <ClerkLoaded>
          <div className="h-screen flex flex-col w-full">
            <Header />
            <main className={`flex-1 flex justify-center w-full ${inter.className}`}>{children}</main>
          </div>
      </ClerkLoaded>

  );
}
