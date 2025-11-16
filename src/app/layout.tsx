import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/ui/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF YT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          {/* 1. Set the body to h-full for full screen height support (Fixes previous layout issue) */}
          <body className={`${inter.className} h-full`}>
            {children}
            {/* 2. FIX: Toaster must be rendered inside the <body> tag */}
            <Toaster />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}