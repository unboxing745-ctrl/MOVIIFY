import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Suspense } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Moviify',
  description:
    'Search for movies, read or write reviews, and get smart recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <Header />
          <main className="pt-20">
            <Suspense>{children}</Suspense>
          </main>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
