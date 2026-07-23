import { type Metadata } from "next";
// import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Inter } from "next/font/google";
import "../globals.css"; 
// Keep only what you use
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta', 
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroSentry", // Updated to match your project!
  description: "Advanced Agricultural Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }} >
        <body className={inter.className}>
          {children}
        </body>
      </html>
  );
}