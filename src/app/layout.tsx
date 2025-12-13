'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Suspense, useState, useEffect } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import Header from '@/components/layout/Header';
import SplashScreen from '@/components/layout/SplashScreen';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading]);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Moviify</title>
        <meta
          name="description"
          content="Search for movies, read or write reviews, and get smart recommendations."
        />
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
        {isLoading && isHome ? (
          <SplashScreen />
        ) : (
          <FirebaseClientProvider>
            <Header />
            <main>
              <Suspense>{children}</Suspense>
            </main>
          </FirebaseClientProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
