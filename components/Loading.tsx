/**
 * ============================================================
 * LOADING COMPONENTS - components/Loading.tsx
 * ============================================================
 * 
 * Collection of loading state components:
 * 1. LoadingSpinner - Simple spinning circle (untuk saat fetch)
 * 2. LoadingSkeleton - Skeleton cards (untuk list view)
 * 3. LoadingDetailSkeleton - Skeleton detail (untuk detail page)
 * 
 * PURPOSE:
 * ✓ Show loading state saat API data di-fetch
 * ✓ Improve perceived performance
 * ✓ Provide visual feedback ke user
 * ✓ Prevent blank/empty screen states
 * 
 * LOADING STATE BEST PRACTICES:
 * - Skeleton loading lebih baik daripada spinner
 * - Skeleton shows layout preview (less jarring)
 * - Spinner untuk quick loads atau saat tidak ada layout preview
 * 
 * 'use client' DIRECTIVE:
 * - Client component karena render animation
 * - useQuery loading state trigger these components
 */

'use client';

/**
 * ============================================================
 * LOADING SPINNER COMPONENT
 * ============================================================
 * 
 * Simple spinning circle animation untuk indicate loading.
 * Digunakan saat data sedang di-fetch dan tidak ada layout preview.
 * 
 * USAGE:
 * {loading && <LoadingSpinner />}
 * 
 * STYLING:
 * - Centered di viewport
 * - min-h-[200px]: Minimal height untuk vertical centering
 * - w-16 h-16: Circle size (64x64px)
 * 
 * ANIMATION:
 * CSS border rotation spinning
 */
export function LoadingSpinner() {
  return (
    /**
     * CONTAINER:
     * - flex justify-center items-center: Center di viewport (both axes)
     * - min-h-[200px]: Minimal height (200px)
     * 
     * This makes spinner visible dan centered di page
     */
    <div className="flex justify-center items-center min-h-[200px]">
      {/* 
        SPINNER CIRCLE:
        - relative: Positioning context
        - w-16 h-16: 64x64px size
      */}
      <div className="relative w-16 h-16">
        {/* 
          ============================================================
          SPINNING BORDER ANIMATION
          ============================================================
          
          TECHNIQUE: CSS border spinner
          
          BORDERS:
          - border-4: 4px border thickness
          - border-gray-200: Full border gray (background)
          - border-t-rick-blue: Top border blue (rotating part)
          
          VISUAL RESULT:
          | circle dengan 3/4 gray, 1/4 blue di top |
          | saat rotate, blue bergerak (illusion of spinning) |
          
          ANIMATION:
          - animate-spin: Tailwind animation class
          - Rotate 360 degrees infinitely
          - Default: 1s per rotation
          
          CSS EQUIVALENT:
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          animation: spin 1s linear infinite;
        */}
        <div className="
          absolute 
          inset-0 
          border-4 
          border-gray-200 
          border-t-rick-blue 
          rounded-full 
          animate-spin
        " />
      </div>
    </div>
  );
}

/**
 * ============================================================
 * LOADING SKELETON COMPONENT (FOR GRID LIST)
 * ============================================================
 * 
 * Skeleton loading component untuk character cards grid.
 * Menampilkan placeholder cards yang mirip dengan actual cards.
 * 
 * BENEFIT SKELETON vs SPINNER:
 * - Spinner: Just empty white space (boring)
 * - Skeleton: Preview layout (better UX)
 * - User tau data akan muncul di placeholder
 * - Reduce perceived load time (feels faster)
 * 
 * USAGE:
 * {loading && <LoadingSkeleton count={6} />}
 * 
 * PROPS:
 * @param count - Jumlah skeleton cards (default: 6)
 */
export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    /**
     * GRID CONTAINER:
     * Same grid layout seperti actual character cards
     * 
     * grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
     * └─ Responsive columns (1 col mobile, 2 tablet, 3 desktop)
     * 
     * gap-6: Space between cards (24px)
     * 
     * REASON: Skeleton harus same layout seperti content
     * Prevent layout shift saat data load
     * (CLS - Cumulative Layout Shift = bad for Core Web Vitals)
     */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 
        ============================================================
        SKELETON CARD GENERATOR
        ============================================================
        
        Array.from({ length: count })
        └─ Create array dengan [count] items
        └─ count=6 → array dengan 6 undefined elements
        
        .map((_, index) => ...)
        └─ Loop 6 times, render skeleton card
        └─ _ = unused element, index = key
      */}
      {Array.from({ length: count }).map((_, index) => (
        /**
         * SKELETON CARD:
         * key={index}: React key untuk list rendering
         * className="card animate-pulse": Same card style + pulse animation
         * 
         * animate-pulse: Tailwind animation
         * Makes element fade in/out infinitely (0.5s cycle)
         * Indicate that content is loading
         */
        <div key={index} className="card animate-pulse">
          {/* 
            ============================================================
            IMAGE PLACEHOLDER (SKELETON)
            ============================================================
            
            w-full aspect-square: Match actual image size
            bg-gray-200: Light gray placeholder color
            rounded-lg: Rounded corners
            mb-3: Margin bottom spacing
            
            Visual: Light gray square yang akan "blink"
            User understand image akan muncul di sini
          */}
          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
          
          {/* 
            ============================================================
            TEXT PLACEHOLDERS (SKELETONS)
            ============================================================
            
            space-y-2: Space between lines (8px)
            
            h-6: Height untuk title bar
            h-4: Height untuk smaller text
            
            w-3/4, w-1/2, w-2/3, w-full: Width variation
            └─ Mimic real text yang tidak always same length
            └─ Looks more natural
            
            bg-gray-200: Light gray placeholder
            rounded: Rounded corners
            
            Multiple bars untuk multiple lines of text
          */}
          <div className="space-y-2">
            {/* 
              NAME SKELETON:
              h-6: Larger bar untuk title
              w-3/4: 75% width (shorter than full)
            */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            
            {/* 
              STATUS SKELETON:
              h-4: Smaller bar
              w-1/2: 50% width (short)
            */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            
            {/* 
              INFO SKELETON:
              h-4: Same size
              w-2/3: 67% width (medium)
            */}
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            
            {/* 
              LOCATION SKELETON:
              h-4: Same size
              w-full: 100% width (full line)
              mt-4: Extra margin top (spacing dari above)
            */}
            <div className="h-4 bg-gray-200 rounded w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ============================================================
 * LOADING DETAIL SKELETON COMPONENT (FOR DETAIL PAGE)
 * ============================================================
 * 
 * Skeleton loading untuk character detail page.
 * Shows layout preview saat detail data loading.
 * 
 * LAYOUT:
 * [Image] | [Info]
 * 2 column grid (image left, info right)
 * 
 * USAGE:
 * {loading && <LoadingDetailSkeleton />}
 */
export function LoadingDetailSkeleton() {
  return (
    /**
     * MAIN CONTAINER:
     * animate-pulse: Fade in/out animation
     */
    <div className="animate-pulse">
      {/* 
        BACK BUTTON SKELETON:
        h-10: Height 40px (button size)
        bg-gray-200: Light gray placeholder
        rounded: Rounded corners
        w-24: Width 96px (button width)
        mb-6: Margin bottom (spacing)
      */}
      <div className="h-10 bg-gray-200 rounded w-24 mb-6" />
      
      {/* 
        ============================================================
        2-COLUMN GRID LAYOUT
        ============================================================
        
        grid md:grid-cols-2: 2 columns pada tablet+
        └─ Default: 1 column (mobile)
        └─ md+: 2 columns
        
        gap-8: Large space between columns (32px)
      */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* 
          ============================================================
          LEFT COLUMN: IMAGE SKELETON
          ============================================================
          
          aspect-square: Square ratio (1:1)
          bg-gray-200: Light gray placeholder
          rounded-xl: Rounded corners (20px)
          
          Visual: Large gray square untuk character image
        */}
        <div className="aspect-square bg-gray-200 rounded-xl" />
        
        {/* 
          ============================================================
          RIGHT COLUMN: INFO SKELETON
          ============================================================
          
          space-y-4: Space between items (16px)
        */}
        <div className="space-y-4">
          {/* 
            NAME SKELETON:
            h-10: Large height (40px)
            bg-gray-200: Gray placeholder
            rounded: Rounded
            w-3/4: 75% width
          */}
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          
          {/* 
            STATUS SKELETON:
            h-6: Medium height
            w-1/2: 50% width
          */}
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          
          {/* 
            INFO ITEMS:
            Render 6 info items (species, gender, origin, location, episodes, etc)
            
            Each item:
            - Label skeleton (h-4, w-1/4)
            - Value skeleton (h-5, w-2/3)
          */}
          {Array.from({ length: 6 }).map((_, i) => (
            /**
             * INFO ITEM PAIR:
             * key={i}: React key
             * space-y-2: Space between label & value
             */
            <div key={i} className="space-y-2">
              {/* 
                LABEL SKELETON:
                h-4: Small text size
                w-1/4: Short (label usually short)
              */}
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              
              {/* 
                VALUE SKELETON:
                h-5: Slightly larger than label
                w-2/3: Longer (value usually longer than label)
              */}
              <div className="h-5 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
          
          {/* 
            BUTTON SKELETON:
            h-12: Button height (48px)
            bg-gray-200: Gray placeholder
            rounded: Rounded corners
            w-full: Full width
            mt-6: Large margin top (spacing)
            
            Visual: Large gray bar untuk CTA button
          */}
          <div className="h-12 bg-gray-200 rounded w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
