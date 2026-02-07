/**
 * ============================================================
 * NAVIGATION COMPONENT - components/Navigation.tsx
 * ============================================================
 * 
 * Component untuk navigation bar yang ditampilkan di semua halaman.
 * 
 * TANGGUNG JAWAB:
 * ✓ Render navbar dengan brand logo/name
 * ✓ Display navigation links (/characters, /locations, etc)
 * ✓ Highlight active link berdasarkan current URL
 * ✓ Support responsive design (mobile-friendly)
 * ✓ Sticky positioning (stay di top saat scroll)
 * 
 * STYLING:
 * - bg-white shadow-md: White background dengan subtle shadow
 * - sticky top-0 z-50: Stay di top saat scroll, high z-index
 * 
 * NAVIGATION LINKS:
 * 1. Home (/) - Landing page
 * 2. Characters (/characters) - Browse all characters
 * 3. Locations (/locations) - Browse all locations
 * 
 * ACTIVE STATE:
 * Current page link akan highlight dengan:
 * - Background: rick-blue color
 * - Text: white
 * - Hover effect
 * 
 * 'use client' DIRECTIVE:
 * - Client component karena pakai hooks
 * - usePathname() hanya bisa di client
 */

'use client';

import Link from 'next/link'; // Next.js optimized link component (client-side navigation)
import { usePathname } from 'next/navigation'; // Hook untuk get current URL pathname

/**
 * ============================================================
 * NAVIGATION COMPONENT FUNCTION
 * ============================================================
 * 
 * RETURN:
 * Navigation bar React component
 * 
 * HOOKS USED:
 * - usePathname(): Get current page pathname
 *   Example: '/', '/characters', '/character/1', '/locations'
 */
export default function Navigation() {
  /**
   * HOOK: usePathname()
   * 
   * PURPOSE:
   * Mendapatkan current pathname dari URL
   * 
   * EXAMPLE:
   * User di halaman: https://app.com/characters/search?q=Rick
   * usePathname() return: '/characters/search'
   * (tidak include query params)
   * 
   * KEGUNAAN:
   * Determine mana nav link yang sedang active (untuk highlight)
   * 
   * IMPLEMENTATION:
   * const pathname = usePathname();
   * if (pathname === '/characters') {
   *   // Highlight /characters link
   * }
   */
  const pathname = usePathname();
  
  /**
   * ============================================================
   * HELPER FUNCTION: isActive()
   * ============================================================
   * 
   * PURPOSE:
   * Determine apakah path sedang active
   * Digunakan untuk highlight active nav link
   * 
   * LOGIC:
   * 
   * Untuk home path ('/'):
   * - Exact match: pathname === '/'
   * - Jika pathname = '/characters', isActive('/') = false
   * 
   * Untuk other paths ('/characters', '/locations'):
   * - Starts with: pathname.startsWith(path)
   * - Jika pathname = '/characters/1', isActive('/characters') = true
   * 
   * EXAMPLE:
   * 
   * Route: /characters
   * isActive('/') = false (doesn't match)
   * isActive('/characters') = true (exact starts-with)
   * 
   * Route: /character/1
   * isActive('/') = false
   * isActive('/characters') = false (doesn't start with /characters)
   * isActive('/character') = true (starts with /character)
   * 
   * @param path - Path string to check (e.g., '/', '/characters')
   * @returns boolean - true jika path adalah active
   */
  const isActive = (path: string) => {
    if (path === '/') {
      // Home: exact match only
      // Jangan highlight '/' saat di '/characters'
      return pathname === path;
    }
    // Other paths: starts with match
    // '/characters' match '/characters' dan '/character/1'
    return pathname.startsWith(path);
  };
  
  /**
   * ============================================================
   * SUB-COMPONENT: NavLink
   * ============================================================
   * 
   * Reusable link component dengan built-in active state styling
   * 
   * PROPS:
   * - href: string - Link destination (e.g., '/characters')
   * - children: React.ReactNode - Link text
   * 
   * RENDERING:
   * 1. Check apakah link active via isActive(href)
   * 2. Apply different className berdasarkan active state
   * 3. Render Next.js Link component dengan styling
   * 
   * STYLING:
   * Active:
   *   - bg-rick-blue: Blue background
   *   - text-white: White text
   * 
   * Inactive:
   *   - text-gray-700: Gray text
   *   - hover:bg-gray-200: Gray background on hover
   * 
   * BOTH:
   *   - px-4 py-2: Padding
   *   - rounded-lg: Rounded corners
   *   - font-semibold: Bold text
   *   - transition-all: Smooth animation saat state berubah
   */
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isActive(href);
    
    return (
      <Link
        href={href}
        className={`
          px-4 py-2 rounded-lg font-semibold transition-all duration-200
          ${active
            ? 'bg-rick-blue text-white'
            : 'text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {children}
      </Link>
    );
  };
  
  /**
   * ============================================================
   * NAVIGATION BAR STRUCTURE
   * ============================================================
   * 
   * <nav>: Semantic HTML element untuk navigation
   * 
   * Styling:
   * - bg-white: White background
   * - shadow-md: Medium drop shadow (subtle depth)
   * - sticky: Stay at top when scrolling
   * - top-0: Stick to top of viewport
   * - z-50: High z-index (on top of other elements)
   * 
   * LAYOUT:
   * ┌─ Container (flex, justify-between)
   *  ├─ Logo/Brand (left)
   *  ├─ Spacer (flex-1)
   *  └─ Links (right)
   * 
   * h-16: Height 64px (standard navbar height)
   */
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* 
        CONTAINER:
        - max-width responsive
        - centered
        - horizontal padding
      */}
      <div className="container mx-auto px-4">
        {/* 
          NAVBAR CONTENT:
          - flex: Use flexbox layout
          - items-center: Vertical center align
          - justify-between: Space between (logo left, links right)
          - h-16: Height 64px
        */}
        <div className="flex items-center justify-between h-16">
          {/* 
            ============================================================
            LOGO/BRAND SECTION
            ============================================================
            
            Link ke home page (/)
            Text: "Rick & Morty"
            Styling:
            - text-2xl: Large text (2rem)
            - font-bold: Bold weight
            - text-rick-blue: Brand color
            - hover:opacity-80: Fade on hover
            - transition-opacity: Smooth animation
          */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-rick-blue hover:opacity-80 transition-opacity"
          >
            Rick & Morty
          </Link>
          
          {/* 
            ============================================================
            NAVIGATION LINKS SECTION
            ============================================================
            
            flex: Layout links in row
            items-center: Vertical center
            gap-2: Space between links (0.5rem)
          */}
          <div className="flex items-center gap-2">
            {/* 
              LINK 1: CHARACTERS
              Navigate to /characters page (list of all characters)
            */}
            <NavLink href="/characters">
              Characters
            </NavLink>
            
            {/* 
              LINK 2: LOCATIONS
              Navigate to /locations page (list of all locations)
            */}
            <NavLink href="/locations">
              Locations
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
