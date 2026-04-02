import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NatureBackground from "@/components/background/NatureBackground";
import { ThemeProvider } from "@/context/ThemeContext";
import { HistoryProvider } from "@/context/HistoryContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import HistoryButton from "@/components/history/HistoryButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Language Translator",
  description: "Translate text between multiple languages instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <ThemeProvider>
          <HistoryProvider>
            <HistoryButton />
            <div className="h-full relative">
              <NatureBackground />
              <ThemeToggle />
        {children}
            </div>
          </HistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
