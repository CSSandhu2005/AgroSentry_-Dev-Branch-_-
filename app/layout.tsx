import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import VoiceAssistant from '@/components/SuperUI/VoiceAssistant';

export const metadata: Metadata = {
  title: 'AgroSentry | AgroSentry — AI Agricultural Intelligence',
  description: 'AI-powered crop recommendations, disease diagnosis, and farming intelligence for Indian farmers.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgroSentry',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased p-0">
        <Providers>
          <main className="min-h-screen">{children}</main>
          <VoiceAssistant />
        </Providers>
      </body>
    </html>
  );
}
