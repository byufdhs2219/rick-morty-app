/**
 * ============================================================
 * HOME PAGE (LANDING PAGE) - app/page.tsx
 * ============================================================
 * 
 * Halaman pertama yang dilihat user saat membuka aplikasi.
 * Ini adalah landing page yang introduce aplikasi ke users.
 * 
 * URL: https://app.com/ (root path)
 * 
 * PURPOSE:
 * ✓ Welcome users dengan attractive hero section
 * ✓ Explain fitur-fitur aplikasi
 * ✓ Call-to-action button ke /characters page
 * ✓ Tech stack information
 * 
 * LAYOUT:
 * - Hero title dengan brand color
 * - Description paragraph
 * - 3 feature cards (grid layout)
 * - Call-to-action button
 * - Tech stack footer
 * 
 * 'use client' DIRECTIVE:
 * - Client component karena pakai Link (next/link)
 * - Responsive design butuh client-side for interactivity
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * ============================================================
 * HOME PAGE COMPONENT
 * ============================================================
 * 
 * RETURN:
 * Landing page JSX dengan hero section, features, CTA
 * 
 * STRUCTURE:
 * <div main-container>
 *   <div text-center-content>
 *     <h1>Title</h1>
 *     <p>Description</p>
 *     <div feature-cards>3 cards</div>
 *     <Link CTA-button>
 *     <p tech-stack>
 *   </div>
 * </div>
 */
export default function HomePage() {
  return (
    /**
     * MAIN CONTAINER:
     * 
     * flex flex-col: Vertical layout
     * items-center: Horizontal center
     * justify-center: Vertical center
     * min-h-[calc(100vh-200px)]: Minimal height (full viewport - header/footer)
     * 
     * SIZING:
     * 100vh - 200px = full height minus header (64px) & footer (136px)
     * Memastikan page minimal full screen height
     */
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      {/* 
        ============================================================
        TEXT CONTENT CENTER SECTION
        ============================================================
        
        text-center: Center text alignment
        space-y-6: Space between elements (24px)
        max-w-3xl: Maximum width 768px
        mx-auto: Horizontal center
        
        Container untuk semua text content
      */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        {/* 
          ============================================================
          HERO TITLE
          ============================================================
          
          <h1>: Main heading (H1)
          
          STYLING:
          - text-5xl md:text-6xl: Large text (mobile: 3rem, desktop: 3.75rem)
          - font-bold: Bold weight
          - text-gray-900: Dark gray color
          
          CONTENT:
          "Welcome to Rick and Morty Universe"
          └─ Brand name highlighted dengan brand color
          
          BRAND COLOR:
          <span className="text-rick-blue">
          └─ Custom color dari tailwind config (cyan-blue)
        */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-rick-blue">Rick and Morty</span>
          {' '}Universe
        </h1>
        
        {/* 
          ============================================================
          DESCRIPTION PARAGRAPH
          ============================================================
          
          STYLING:
          - text-xl: Large text (1.25rem)
          - text-gray-600: Medium gray color
          - max-w-2xl mx-auto: Max width 640px, centered
          
          CONTENT:
          Describe aplikasi functionality
          Multiple sentences tentang apa yang bisa dilakukan users
        */}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore characters from the Rick and Morty universe. 
          View character details, create custom locations, and organize your favorite characters.
        </p>
        
        {/* 
          ============================================================
          FEATURE CARDS GRID
          ============================================================
          
          GRID LAYOUT:
          - grid: CSS grid layout
          - grid-cols-1 sm:grid-cols-2 lg:grid-cols-3: Responsive columns
            └─ Mobile: 1 column (100% width)
            └─ Tablet (640px+): 2 columns (50% width each)
            └─ Desktop (1024px+): 3 columns (33% width each)
          
          - gap-6: Space between cards (24px)
          - mt-12: Margin top (48px) spacing dari description
          
          3 FEATURES:
          1. Browse Characters (search & filter)
          2. Custom Locations (create & manage)
          3. Persistent Data (localStorage)
        */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* 
            FEATURE 1: BROWSE CHARACTERS
            
            Emoji icon untuk visual appeal
            Title + description
          */}
          <div className="card text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2">Browse Characters</h3>
            <p className="text-gray-600 text-sm">
              Explore hundreds of characters with search and filtering
            </p>
          </div>
          
          {/* 
            FEATURE 2: CUSTOM LOCATIONS
            
            User bisa create locations sendiri
          */}
          <div className="card text-center">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2">Custom Locations</h3>
            <p className="text-gray-600 text-sm">
              Create your own locations and assign characters to them
            </p>
          </div>
          
          {/* 
            FEATURE 3: PERSISTENT DATA
            
            Data saved di localStorage
          */}
          <div className="card text-center">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="font-bold text-lg mb-2">Persistent Data</h3>
            <p className="text-gray-600 text-sm">
              Your custom locations are saved and persist across sessions
            </p>
          </div>
        </div>
        
        {/* 
          ============================================================
          CALL-TO-ACTION BUTTON
          ============================================================
          
          <div className="pt-8">
          └─ Padding top (32px) spacing
          
          <Link href="/characters">
          └─ Navigate ke /characters page (characters list)
          
          className="btn-primary inline-block text-lg px-8 py-4"
          └─ btn-primary: Custom button style (dari globals.css)
          └─ inline-block: Display sebagai button (but link element)
          └─ text-lg: Large text
          └─ px-8 py-4: Padding horizontal & vertical (generous size)
          
          "Start Exploring Characters →"
          └─ Button text dengan arrow untuk indicate action
        */}
        <div className="pt-8">
          <Link 
            href="/characters"
            className="btn-primary inline-block text-lg px-8 py-4"
          >
            Start Exploring Characters →
          </Link>
        </div>
        
        {/* 
          ============================================================
          TECH STACK FOOTER
          ============================================================
          
          Display technologies used dalam aplikasi
          
          STYLING:
          - pt-12: Padding top (48px)
          - text-sm: Small text
          - text-gray-500: Light gray color
          
          TECHNOLOGIES:
          - Next.js 14: React framework
          - React 18: UI library
          - TypeScript: Type safety
          - Tailwind CSS: Styling
          - Apollo GraphQL: Data management
        */}
        <div className="pt-12 text-sm text-gray-500">
          <p>Built with Next.js 14 • React 18 • TypeScript • Tailwind CSS • Apollo GraphQL</p>
        </div>
      </div>
    </div>
  );
}
