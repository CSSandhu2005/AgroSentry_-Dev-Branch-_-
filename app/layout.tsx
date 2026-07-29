// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals2.css';
import Navbar from '@/components/SuperUI/Navbar';
import BottomNav from '@/components/SuperUI/BottomNav';
import VoiceAssistant from '@/components/SuperUI/VoiceAssistant';

export const metadata: Metadata = {
  title: 'AgroSentry||SuperFarmer — AI Agricultural Intelligence',
  description: 'AI-powered crop recommendations, disease diagnosis, and farming intelligence for Indian farmers.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SuperFarmer',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060d08',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <BottomNav />
        <VoiceAssistant />
      </body>
    </html>
  );
}
