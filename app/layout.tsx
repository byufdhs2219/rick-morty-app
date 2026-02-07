/**
 * ============================================================
 * ROOT LAYOUT COMPONENT - app/layout.tsx
 * ============================================================
 * 
 * File ini adalah layout root/induk untuk seluruh aplikasi.
 * Setiap halaman dalam aplikasi akan dibungkus dengan layout ini.
 * 
 * TANGGUNG JAWAB:
 * ✓ Setup HTML structure (html, head, body)
 * ✓ Load font dari Google Fonts (Inter)
 * ✓ Setup Apollo Provider untuk GraphQL
 * ✓ Render Navigation component yang ada di semua halaman
 * ✓ Apply global CSS dan styling
 * ✓ Optimasi performa dengan preload resources
 * 
 * ALUR:
 * 1. Browser load app
 * 2. RootLayout render
 * 3. Render Providers (Apollo setup)
 * 4. Render Navigation (nav bar)
 * 5. Render children (halaman spesifik)
 * 
 * IMPORTS:
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google'; // Load font Inter dari Google (lazy-loaded untuk performa)
import { Suspense } from 'react';
import './globals.css';  // File CSS global yang berisi Tailwind directives
import Providers from './providers';  // Apollo Provider wrapper
import Navigation from '@/components/Navigation';  // Navigation bar component

/**
 * ============================================================
 * GOOGLE FONT CONFIGURATION
 * ============================================================
 * 
 * Loading Inter font dengan optimasi performa.
 * Inter adalah sans-serif font modern, sangat readable di layar.
 * 
 * KONFIGURASI:
 * - subsets: ['latin'] 
 *   Hanya load karakter Latin (a-z, A-Z, 0-9, dll)
 *   Jangan load semua unicode karakter (lebih berat)
 *   Menghemat ~30% file size
 * 
 * - display: 'swap' 
 *   Tetap tampilkan fallback font dulu, jangan tunggu font load
 *   Saat Inter font selesai load, swap ke Inter
 *   Menghindari "flash" dimana text disappear saat switching font
 * 
 * - preload: true
 *   Preload font resource lebih awal (opsional, sudah optimal)
 */
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

/**
 * ============================================================
 * METADATA CONFIGURATION - SEO & Open Graph Tags
 * ============================================================
 * 
 * Metadata adalah informasi tentang halaman yang muncul di:
 * - Tab browser
 * - Search engine results (Google, Bing, dll)
 * - Social media preview (saat di-share di Facebook, Twitter, dll)
 * 
 * FIELDS EXPLANATION:
 * 
 * title: "Rick and Morty Characters"
 * └─ Judul halaman di browser tab dan search results
 * 
 * description: "Browse and manage Rick and Morty characters..."
 * └─ Deskripsi singkat di search results (snippet)
 * 
 * openGraph: 
 * └─ Data untuk social media preview
 *    Saat user share link ke Facebook/Twitter:
 *    - Title, description, type ditampilkan di preview
 * 
 * robots:
 * └─ Directive untuk search engine bots
 *    - index: true = boleh index halaman ini di search results
 *    - follow: true = boleh follow links di halaman ini
 * 
 * CATATAN: viewport dan themeColor dipindahkan ke generateViewport()
 * (Next.js 13.4+ best practice untuk viewport configuration)
 */
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

/**
 * ============================================================
 * VIEWPORT CONFIGURATION - Browser Viewport Settings
 * ============================================================
 * 
 * Next.js 13.4+ memisahkan viewport config dari metadata.
 * Ini adalah best practice untuk viewport settings management.
 * 
 * CONFIGURATION:
 * 
 * width: "device-width"
 * └─ Viewport width sama dengan device width (responsive)
 * 
 * initialScale: 1
 * └─ Zoom level awal 100% (tidak zoom in/out)
 * 
 * viewportFit: "cover"
 * └─ Support notch pada iPhone 12-14 Pro
 * 
 * themeColor: "#00b5cc"
 * └─ Warna tema yang ditampilkan di mobile browser
 *    - Address bar color di Chrome mobile
 *    - Tab bar color di Safari iOS
 *    Warna cyan-blue (#00b5cc) represent aplikasi theme
 */
export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#00b5cc',
  };
};

/**
 * ============================================================
 * ROOT LAYOUT FUNCTION
 * ============================================================
 * 
 * React component yang return HTML structure aplikasi.
 * 
 * PROPS:
 * - children: React.ReactNode
 *   Halaman spesifik yang akan di-render di dalam layout ini
 *   Contoh: jika user akses /characters, children = <CharactersPage />
 * 
 * RENDER STRUKTUR:
 * <html>
 *   <head>
 *     ✓ Preconnect ke API
 *     ✓ DNS prefetch ke API
 *     ✓ Preload font dan images
 *   </head>
 *   <body>
 *     ✓ Navigation bar
 *     ✓ Apollo Provider
 *     ✓ Main content (children)
 *     ✓ Footer
 *   </body>
 * </html>
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 
        LANGUAGE ATTRIBUTE:
        lang="en" memberitahu:
        ✓ Browser bahwa halaman dalam bahasa Inggris
        ✓ Screen readers (accessibility) untuk pronounciation yang benar
        ✓ Search engines untuk SEO optimization
      */}
      <head>
        {/* 
          ============================================================
          PERFORMANCE OPTIMIZATION - RESOURCE HINTS
          ============================================================
          
          Resource hints memberi tahu browser untuk:
          - Preconnect: Buka koneksi TCP ke domain sebelumnya
          - DNS-prefetch: Resolve DNS sebelumnya
          - Preload: Download resource sebelumnya
          
          Ini mengurangi latency saat benar-benar membutuhkan resource.
        */}

        {/* 
          PRECONNECT: Buka TCP connection ke rickandmortyapi.com lebih awal
          
          ALUR NORMAL:
          Browser need API → DNS lookup (50-300ms) → TCP handshake (100-300ms) 
          → TLS (100-200ms) → Send request → Get response
          Total: 250-800ms
          
          DENGAN PRECONNECT:
          Page load → Preconnect (background) ✓
          → Need API → Already connected → Send request → Get response
          Total: ~100-200ms (lebih cepat 50-80%)
          
          crossOrigin="anonymous": Preconnect ke domain lain tanpa cookies
        */}
        <link
          rel="preconnect"
          href="https://rickandmortyapi.com"
          crossOrigin="anonymous"
        />

        {/* 
          DNS-PREFETCH: Hanya resolve DNS address, jangan full preconnect
          
          FUNGSI: Lebih lightweight daripada preconnect
          Gunakan untuk domain yang mungkin digunakan
          
          ALUR:
          Page load → Start DNS lookup (background) ✓
          → Need API → DNS already resolved → Connect → Send request
        */}
        <link
          rel="dns-prefetch"
          href="https://rickandmortyapi.com"
        />
        
        {/* 
          PRELOAD FONT CSS: Minta Google Fonts CSS sebelumnya
          
          as="style": Ini adalah CSS resource
          href: URL ke Google Fonts CSS yang berisi @font-face untuk Inter
          
          ALUR NORMAL:
          Page render → Discover font in CSS → Request Google Fonts CSS 
          → Request woff2 file → Display text
          Total: 500-1000ms
          
          DENGAN PRELOAD:
          Page load → Preload font CSS (background) ✓
          → Page render → Font CSS sudah ready → Display text
          Total: 200-500ms (lebih cepat 60%)
        */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        
        {/* 
          PRELOAD HERO IMAGES: Minta 3 karakter pertama lebih awal
          
          STRATEGI:
          ✓ Preload hanya 3 karakter pertama (above-the-fold)
          ✓ Saat user scroll, karakter 4+ lazy load
          ✓ Menghemat bandwidth, fokus ke first paint
          
          as="image": Ini adalah image resource
          type="image/jpeg": Format image (untuk browser optimization)
          
          ALUR NORMAL:
          Page render → User scroll → Discover images → Request images 
          → Images load → Display
          User lihat blank space saat loading
          
          DENGAN PRELOAD:
          Page load → Preload images (background) ✓
          → Page render → Images ready → User scroll → Instant display
          Tidak ada blank space, user experience lebih smooth
        */}

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

      {/* 
        BODY: Konten halaman yang ditampilkan di browser
        
        className={inter.className}:
        Apply Inter font ke semua text element
        Next.js auto-generate unique class name dari font loading
      */}
      <body className={inter.className}>
        {/* 
          NAVIGATION COMPONENT:
          Render navbar yang akan muncul di semua halaman
          Position sticky di atas (lihat Navigation.tsx)
        */}
        <Navigation />
        
        {/* 
          SUSPENSE + PROVIDERS:
          
          Suspense: React feature untuk defer loading
          fallback={null}: Jangan tampilkan apa-apa saat loading
          
          Providers: Apollo Provider untuk GraphQL setup
          Wrap children agar semua component bisa pakai Apollo hooks
          
          ALUR:
          1. Render Navigation (tidak perlu tunggu)
          2. Suspense defer Providers loading
          3. Providers setup Apollo Client
          4. Render children (page content)
        */}
        <Suspense fallback={null}>
          <Providers>
            {/* 
              MAIN CONTENT AREA:
              
              min-h-screen: Minimal height 100vh (full viewport height)
              Memastikan footer push ke bawah meskipun content sedikit
              
              bg-gray-50: Background color warna abu-abu terang
            */}
            <main className="min-h-screen bg-gray-50">
              {/* 
                CONTAINER:
                
                container: Set max-width ke responsive breakpoints
                  - mobile: max-width: 100%
                  - tablet: max-width: 768px
                  - desktop: max-width: 1024px
                  
                mx-auto: Horizontal center align
                  margin-left: auto, margin-right: auto
                  
                px-4: Padding horizontal 1rem (16px)
                  Spacing dari edge di mobile
                  
                py-8: Padding vertical 2rem (32px)
                  Spacing dari top dan bottom
              */}
              <div className="container mx-auto px-4 py-8">
                {/* 
                  CHILDREN:
                  Halaman spesifik yang akan di-render di sini
                  
                  Contoh:
                  - Route /: <HomePage />
                  - Route /characters: <CharactersPage />
                  - Route /character/1: <CharacterDetailPage />
                  - Route /locations: <LocationsPage />
                */}
                {children}
              </div>
            </main>
            
            {/* 
              FOOTER:
              
              bg-white: Background putih
              border-t: Border top dengan warna abu-abu
              mt-auto: Margin-top auto (footer push ke bawah)
              
              Isi: Credit untuk Rick and Morty API
            */}
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
