import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/landing/header";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grayola",
  description: "Your best partner in design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <Analytics />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className={`flex min-h-screen flex-col ${inter.className}`}>
            <Header />
            <div className="flex flex-1 justify-center w-full">
              <div className="flex w-full max-w-[1280px] h-full">
                {children}
              </div>
            </div>
            
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
