import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as HotToaster } from "react-hot-toast"; // Renamed to avoid conflicts
import { Toaster as CustomToaster } from "@/components/ui/toaster"; // Your custom UI toaster
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Donation & Redistribution Platform',
  description: 'Efficiently connecting donors, NGOs, and recipients to streamline the donation process',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen bg-background">
              {children}
            </main>
            <HotToaster position="top-right" reverseOrder={false} /> {/* react-hot-toast */}
            <CustomToaster /> {/* Custom UI Toaster */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
