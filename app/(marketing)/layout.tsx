import { type Metadata } from "next";
// import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "../globals.css"; 
// Keep only what you use
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta', 
});

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
      <html lang="en" suppressHydrationWarning className="light" style={{ colorScheme: 'light' }} >
        <body className={`${jakarta.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
  );
}