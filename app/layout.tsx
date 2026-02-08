
// Root layout with metadata, fonts, providers, and global navigation
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Providers from './providers';
import Navigation from '@/components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Rick and Morty Characters',
  description: 'Browse and manage Rick and Morty characters with custom locations',
  openGraph: {
    title: 'Rick and Morty Characters',
    description: 'Browse and manage Rick and Morty characters with custom locations',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#00b5cc',
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

        <link
          rel="preconnect"
          href="https://rickandmortyapi.com"
          crossOrigin="anonymous"
        />

        <link
          rel="dns-prefetch"
          href="https://rickandmortyapi.com"
        />
        
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        

        {/* Character 1: Rick */}
        <link
          rel="preload"
          as="image"
          href="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
          type="image/jpeg"
        />

        {/* Character 2: Morty */}
        <link
          rel="preload"
          as="image"
          href="https://rickandmortyapi.com/api/character/avatar/2.jpeg"
          type="image/jpeg"
        />

        {/* Character 3: Summer */}
        <link
          rel="preload"
          as="image"
          href="https://rickandmortyapi.com/api/character/avatar/3.jpeg"
          type="image/jpeg"
        />
      </head>

      <body className={inter.className}>
        <Navigation />
        
        <Suspense fallback={null}>
          <Providers>
            <main className="min-h-screen bg-gray-50">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>
            
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="container mx-auto px-4 py-6 text-center text-gray-600">
                <p>
                  Data from{' '}
                  <a
                    href="https://rickandmortyapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rick-blue hover:underline"
                  >
                    Rick and Morty API
                  </a>
                </p>
              </div>
            </footer>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
