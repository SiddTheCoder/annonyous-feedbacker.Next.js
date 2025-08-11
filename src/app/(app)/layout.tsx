import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthProvider from "@/context/AuthProvider";
import ThemeProvider from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/localcomponents/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Annonymous Feedback",
  description: "Let's hear your thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="w-full">
            <Header />
          </div>
          {children}
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
