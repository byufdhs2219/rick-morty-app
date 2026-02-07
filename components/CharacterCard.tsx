/**
 * ============================================================
 * CHARACTER CARD COMPONENT - components/CharacterCard.tsx
 * ============================================================
 * 
 * Component untuk menampilkan satu character dalam bentuk card.
 * Reusable component yang digunakan di banyak halaman.
 * 
 * DIGUNAKAN DI:
 * - /characters page (grid of characters)
 * - /character/[id]/related page (related characters)
 * - /locations/[id] page (characters di location)
 * 
 * FITUR:
 * ✓ Display character image dengan optimasi Next.js
 * ✓ Show character basic info (name, status, species, gender)
 * ✓ Color-coded status indicator (Alive/Dead/Unknown)
 * ✓ Show last known location
 * ✓ Clickable dengan keyboard support (a11y)
 * ✓ Hover animation effect
 * ✓ Responsive image loading
 * 
 * TANGGUNG JAWAB:
 * ✓ Render card layout
 * ✓ Format dan display data
 * ✓ Handle click interaction
 * ✓ Accessibility features
 * 
 * 'use client' DIRECTIVE:
 * - Client component karena pakai onClick, onKeyDown
 * - Interaktif behavior perlu di client
 */

'use client';

import Image from 'next/image'; // Next.js optimized image component
import { Character } from '@/types'; // TypeScript type definition

/**
 * ============================================================
 * CHARACTER CARD PROPS INTERFACE
 * ============================================================
 * 
 * Define prop types untuk TypeScript
 * 
 * PROPS:
 * 
 * character: Character
 * └─ Character data object
 * └─ Type: Character interface (from @/types)
 * └─ Contains: id, name, status, species, gender, image, location, etc
 * 
 * onClick: () => void
 * └─ Callback function saat card diklik
 * └─ Parent component handle navigation
 * └─ Example: onClick={() => router.push(`/character/${character.id}`)}
 * 
 * priority?: boolean (optional)
 * └─ Whether ini adalah LCP image
 * └─ LCP = Largest Contentful Paint (first content user see)
 * └─ true: Image eager load dengan high priority
 * └─ false: Image lazy load (default for below-fold images)
 * └─ Gunakan priority untuk first 3 cards, lazy untuk rest
 */
interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  priority?: boolean;
}

/**
 * ============================================================
 * STATUS BADGE SUB-COMPONENT
 * ============================================================
 * 
 * Sub-component untuk render status indicator badge
 * 
 * PURPOSE:
 * Display character status (Alive/Dead/Unknown) dengan color indicator
 * 
 * VISUAL:
 * [● green dot] Alive
 * [● red dot]   Dead
 * [● gray dot]  Unknown
 * 
 * DESIGN PATTERN:
 * Colored dot + text label
 * Intuitive visual indicator
 * 
 * @param status - Character status string
 */
const StatusBadge = ({ status }: { status: string }) => {
  /**
   * STATUS COLORS MAPPING:
   * 
   * Map dari status string ke Tailwind color class
   * 
   * Alive  → bg-green-500 (vibrant green)
   * Dead   → bg-red-500 (vibrant red)
   * Unknown → bg-gray-500 (neutral gray)
   * 
   * SEMANTIC COLORS:
   * Green for alive (life/growth)
   * Red for dead (danger/warning)
   * Gray for unknown (neutral/unclear)
   * 
   * TYPE CASTING:
   * as keyof typeof statusColors
   * └─ Tell TypeScript ini adalah key dari statusColors object
   * └─ Enable type-safe lookup
   */
  const statusColors = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500',
  };
  
  /**
   * GET COLOR CLASS:
   * 
   * colorClass = statusColors[status] || default
   * 
   * LOGIC:
   * 1. Try lookup status di statusColors map
   * 2. Jika ada, return color class
   * 3. Jika tidak ada, return default gray
   * 
   * EXAMPLE:
   * status = "Alive" → colorClass = 'bg-green-500'
   * status = "dead" → colorClass = 'bg-gray-500' (not in map)
   * status = "Unknown" → colorClass = 'bg-gray-500' (not in map)
   */
  const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  
  /**
   * RENDER STATUS BADGE:
   * 
   * <span className="flex items-center gap-1.5">
   *   [colored dot]
   *   [status text]
   * </span>
   * 
   * STYLING:
   * flex: Horizontal layout
   * items-center: Vertical center
   * gap-1.5: Space between dot and text (6px)
   * text-sm: Small text size (14px)
   */
  return (
    <span className="flex items-center gap-1.5 text-sm">
      {/* 
        COLORED DOT INDICATOR:
        
        w-2 h-2: 8x8px square
        rounded-full: Circle shape
        {colorClass}: Dynamic color based on status
        
        Visual indicator untuk status
      */}
      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
      
      {/* STATUS TEXT LABEL */}
      <span className="font-medium">{status}</span>
    </span>
  );
};

/**
 * ============================================================
 * CHARACTER CARD MAIN COMPONENT
 * ============================================================
 * 
 * PROPS:
 * - character: Character data
 * - onClick: Click callback
 * - priority: Image priority flag
 * 
 * RETURN:
 * Card component yang render character info
 */
export default function CharacterCard({ character, onClick, priority = false }: CharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        card 
        cursor-pointer 
        overflow-hidden 
        hover:scale-[1.02]
        transition-transform 
        duration-200
        flex 
        flex-col
      "
      /**
       * ACCESSIBILITY ATTRIBUTES:
       * 
       * role="button"
       * └─ Tell screen readers ini adalah button-like element
       * └─ Meskipun <div>, behavior-nya seperti button
       * 
       * tabIndex={0}
       * └─ Make element keyboard-focusable
       * └─ User bisa Tab ke element ini
       * └─ tabIndex >= 0 means focusable
       * └─ tabIndex -1 means not focusable
       * 
       * aria-label
       * └─ Accessible label untuk screen readers
       * └─ Tell screen reader apa fungsi element
       * └─ Example: "View details of Rick"
       */
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        /**
         * KEYBOARD INTERACTION:
         * 
         * Allow Enter dan Space key untuk trigger click
         * Just like clicking dengan mouse
         * 
         * Keyboard accessibility best practice:
         * - Enter: Submit/activate (like button)
         * - Space: Activate (like checkbox/button)
         * 
         * e.key: Which key was pressed
         * e.preventDefault(): Prevent default behavior
         * onClick(): Trigger click handler
         * 
         * EXAMPLE:
         * User focus card dengan Tab
         * User press Enter
         * → onKeyDown triggered
         * → onClick() called
         * → Navigate to character detail page
         */
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details of ${character.name}`}
    >
      {/* 
        ============================================================
        IMAGE CONTAINER
        ============================================================
        
        relative: Positioning context untuk fill image
        w-full: Full width
        aspect-square: Square ratio (1:1)
        mb-3: Margin bottom spacing
      */}
      <div className="relative w-full aspect-square mb-3">
        {/* 
          ============================================================
          NEXT.JS IMAGE COMPONENT (OPTIMIZED)
          ============================================================
          
          Next.js Image component provides built-in optimizations:
          
          1. IMAGE OPTIMIZATION:
             - Automatic format conversion (WebP, AVIF jika supported)
             - Automatic resize based on device
             - Lazy loading by default
          
          2. LAYOUT SHIFT PREVENTION:
             - fill prop + aspect-square
             - Reserve space, prevent cumulative layout shift
          
          3. RESPONSIVE IMAGES:
             - sizes prop define breakpoints
             - Browser choose optimal image size
          
          4. PERFORMANCE:
             - priority prop untuk LCP optimization
             - fetchPriority hint untuk browser
        */}
        <Image
          src={character.image}
          alt={character.name}
          
          /**
           * IMAGE SOURCE:
           * URL dari character avatar
           * Example: https://rickandmortyapi.com/api/character/avatar/1.jpeg
           * 
           * ALT TEXT:
           * Screen reader text jika image fail to load
           * Accessibility requirement
           */
          
          /**
           * fill PROP:
           * 
           * Instead of width/height, use fill
           * fill: Make image fill parent container
           * 
           * BENEFIT:
           * - Prevent CLS (Cumulative Layout Shift)
           * - aspect-square reserve space
           * - Image load, layout tidak berubah
           * 
           * REQUIREMENT:
           * Parent harus relative positioning (sudah ada)
           */
          fill
          
          /**
           * sizes PROP:
           * 
           * Define image sizes untuk different breakpoints
           * Help browser choose optimal image size
           * 
           * SYNTAX:
           * "(media-query) sizesToUse, default"
           * 
           * "(max-width: 640px) 100vw"
           * └─ On mobile (< 640px): image = 100% viewport width
           * 
           * "(max-width: 1024px) 50vw"
           * └─ On tablet (640-1024px): image = 50% viewport width
           * 
           * "33vw"
           * └─ On desktop (> 1024px): image = 33% viewport width
           * 
           * EXAMPLE CALCULATION:
           * Mobile (375px): 100vw = 375px image
           * Tablet (768px): 50vw = 384px image
           * Desktop (1440px): 33vw = 476px image
           * 
           * Browser choose appropriate size untuk current viewport
           * Reduce wasted bandwidth
           */
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          
          /**
           * CLASS: TAILWIND STYLING
           * 
           * object-cover: Image fill container, maintain aspect ratio
           * └─ Crop if necessary
           * 
           * rounded-lg: Rounded corners (12px)
           */
          className="object-cover rounded-lg"
          
          /**
           * QUALITY PROP:
           * 
           * 0-100: JPEG compression quality
           * 
           * priority ? 85 : 80
           * └─ LCP images: 85 (higher quality)
           * └─ Regular images: 80 (good balance)
           * 
           * BENEFIT:
           * LCP images = more visible, higher quality justified
           * Below-fold images = lower quality ok (save bandwidth)
           */
          quality={priority ? 85 : 80}
          
          /**
           * LOADING PROP:
           * 
           * "eager": Load immediately
           * "lazy": Load when in viewport (default)
           * 
           * priority ? "eager" : "lazy"
           * └─ LCP images: eager (first paint optimization)
           * └─ Other images: lazy (reduce first load)
           * 
           * NATIVE BROWSER FEATURE:
           * loading="lazy" = native browser lazy loading
           * No JS required, supported di modern browsers
           */
          loading={priority ? "eager" : "lazy"}
          
          /**
           * PRIORITY PROP:
           * 
           * Next.js specific prop
           * true: Preload image (add link preload di <head>)
           * false: No preload
           * 
           * USAGE:
           * ✓ Set priority={true} untuk LCP images
           * ✓ Set priority={false} untuk others
           * 
           * BEST PRACTICE:
           * Gunakan untuk first 3 images only
           * Jangan overuse (dapat slowdown page)
           */
          priority={priority}
          
          /**
           * FETCH PRIORITY PROP:
           * 
           * HTTP/2 fetch priority hint ke browser
           * 
           * "high": High fetch priority
           * "low": Low fetch priority
           * 
           * priority ? "high" : "low"
           * └─ LCP images: high (fetch soon)
           * └─ Other images: low (defer to other resources)
           * 
           * BROWSER HINT:
           * Browser use hint untuk optimize resource loading
           * Not guaranteed, but helps with prioritization
           */
          fetchPriority={priority ? "high" : "low"}
        />
      </div>
      
      {/* 
        ============================================================
        CHARACTER INFO SECTION
        ============================================================
        
        flex-1: Grow to fill available space
        flex: Flex column layout
        flex-col: Stack items vertically
        gap-2: Space between items (8px)
      */}
      <div className="flex-1 flex flex-col gap-2">
        {/* 
          CHARACTER NAME:
          
          text-lg: Large text (18px)
          font-bold: Bold weight
          text-gray-900: Dark gray color
          line-clamp-1: Truncate di 1 line + ellipsis
          
          Kenapa line-clamp-1?
          Long character names butuh truncate
          Prevent card layout break
          Example: "Mr. Poopybutthole" bisa jadi panjang
        */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {character.name}
        </h3>
        
        {/* STATUS BADGE COMPONENT */}
        <StatusBadge status={character.status} />
        
        {/* 
          SPECIES & GENDER:
          
          text-sm: Small text
          text-gray-600: Gray color
          
          Display inline dengan separator (•)
          Example: "Human • Male"
        */}
        <div className="text-sm text-gray-600">
          <p>{character.species} • {character.gender}</p>
        </div>
        
        {/* 
          LOCATION INFO:
          
          Conditional render: Hanya jika location ada
          {character.location && ( ... )}
          
          mt-auto: Margin top auto (push ke bottom)
          Reason: Card flex-col, location push ke bawah
          
          text-sm text-gray-500: Small gray text
          font-semibold text-gray-700: Bold label
          line-clamp-1: Truncate location name
          
          Display: "Last known location: [name]"
        */}
        {character.location && (
          <div className="text-sm text-gray-500 mt-auto">
            <p className="font-semibold text-gray-700">Last known location:</p>
            <p className="line-clamp-1">{character.location.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
