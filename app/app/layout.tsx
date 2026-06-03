import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "#MYGASTROIA# — Transformación Digital en 365 Días",
  description: "El sistema de IA para restaurantes y gastronomía. Diagnóstico gratuito de 60 minutos. Basel, Suiza.",
  keywords: "restaurante, gastronomía, IA, digital, Basel, Suiza, consultoría",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable}`}>
      <body className="min-h-screen" style={{ background: "#0D0D0D" }}>
        {children}
      </body>
    </html>
  );
}
