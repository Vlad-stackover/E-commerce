import type { Metadata } from "next";
import "./globals.css";
import cn from 'classnames';
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans"});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  keywords: ["Next.js", "React", "Tailwind CSS", "Inter font"],
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background  min-h-screen font-sans antialiased", inter.variable
        )}
      >
        {children}
      </body>

    </html>
  );
}
