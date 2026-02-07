/**
 * ============================================================
 * SEARCH BAR COMPONENT - components/SearchBar.tsx
 * ============================================================
 * 
 * Reusable search input component dengan debounce functionality.
 * 
 * TANGGUNG JAWAB:
 * ✓ Render search input field
 * ✓ Handle user typing
 * ✓ Debounce search queries (reduce API calls)
 * ✓ Display search and clear icons
 * ✓ Call parent callback saat user submit search
 * 
 * DEBOUNCING EXPLAINED:
 * 
 * PROBLEM (without debounce):
 * User mengetik "Rick" (3 karakter)
 * - Type "R" → API call #1
 * - Type "Ri" → API call #2
 * - Type "Ric" → API call #3
 * - Type "Rick" → API call #4
 * Total: 4 API calls untuk 1 query ✗ WASTEFUL
 * 
 * SOLUTION (with debounce 500ms):
 * User mengetik "Rick"
 * - Type "R" → Set timer 500ms
 * - Type "i" → Reset timer (baru 500ms)
 * - Type "c" → Reset timer (baru 500ms)
 * - Type "k" → Reset timer (baru 500ms)
 * - Stop typing → Wait 500ms → API call #1
 * Total: 1 API call ✓ EFFICIENT
 * 
 * BENEFIT:
 * ✓ Reduce server load
 * ✓ Reduce network usage
 * ✓ Improve user experience (no network churn)
 * ✓ Better for user on slow connections
 * 
 * 'use client' DIRECTIVE:
 * - Client component karena pakai hooks (useState, useEffect)
 * - Debouncing perlu di client-side (browser)
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * ============================================================
 * SEARCH BAR PROPS INTERFACE
 * ============================================================
 * 
 * TypeScript interface untuk define prop types
 * 
 * PROPS:
 * 
 * onSearch: (query: string) => void
 * └─ Callback function yang dipanggil saat search submit
 * └─ Menerima query string sebagai parameter
 * └─ Parent component menangani API call
 * 
 * placeholder?: string
 * └─ Placeholder text di input field
 * └─ Optional (ada default value)
 * └─ Example: "Search characters..."
 * 
 * initialValue?: string
 * └─ Initial value untuk controlled input
 * └─ Optional
 * └─ Berguna jika ingin set search term dari URL params
 */
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

/**
 * ============================================================
 * SEARCH BAR FUNCTION
 * ============================================================
 * 
 * PARAMETERS:
 * - onSearch: Callback dari parent
 * - placeholder: Custom placeholder (default: 'Search characters...')
 * - initialValue: Initial input value (default: '')
 * 
 * CONTROLLED INPUT:
 * - value={query}: Input value dari state
 * - onChange={(e) => setQuery(e.target.value)}: Update state saat user type
 * - This makes React handle input value
 */
export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search characters...',
  initialValue = ''
}: SearchBarProps) {
  /**
   * ============================================================
   * STATE: SEARCH QUERY
   * ============================================================
   * 
   * query: Current search input value
   * setQuery: Function untuk update query
   * 
   * INITIAL VALUE: initialValue prop (atau '' jika tidak ada)
   * 
   * EXAMPLE:
   * User type "R" → setQuery('R') → query = "R"
   * User type "Ri" → setQuery('Ri') → query = "Ri"
   * User clear → setQuery('') → query = ""
   */
  const [query, setQuery] = useState(initialValue);
  
  /**
   * ============================================================
   * DEBOUNCE HOOK: useEffect
   * ============================================================
   * 
   * PURPOSE:
   * Delay onSearch callback sampai user berhenti typing
   * 
   * HOW IT WORKS:
   * 
   * 1. Dependencies: [query, onSearch]
   *    Effect run setiap kali query atau onSearch berubah
   * 
   * 2. Inside effect: Set timeout 500ms
   *    const timeoutId = setTimeout(() => { ... }, 500);
   * 
   * 3. Cleanup function: Clear timeout sebelumnya
   *    return () => clearTimeout(timeoutId);
   * 
   * TIMELINE EXAMPLE:
   * 
   * t=0ms: User type "R"
   *        → setQuery("R")
   *        → useEffect triggered
   *        → setTimeout 500ms set
   * 
   * t=100ms: User type "Ri"
   *          → setQuery("Ri")
   *          → useEffect triggered
   *          → Cleanup: clear previous timeout
   *          → setTimeout 500ms set (NEW timer)
   * 
   * t=200ms: User type "Ric"
   *          → setQuery("Ric")
   *          → useEffect triggered
   *          → Cleanup: clear previous timeout
   *          → setTimeout 500ms set (NEW timer)
   * 
   * t=300ms: User type "Rick"
   *          → setQuery("Rick")
   *          → useEffect triggered
   *          → Cleanup: clear previous timeout
   *          → setTimeout 500ms set (NEW timer)
   * 
   * t=800ms: No more typing, 500ms passed
   *          → setTimeout callback execute
   *          → onSearch("Rick") called
   *          → Parent component fetch API dengan query "Rick"
   * 
   * RESULT:
   * User typed 4 characters, but onSearch called only ONCE!
   * 
   * OPTIMIZATION:
   * Ini sangat important untuk search functionality
   * Tanpa debounce: 4 API calls
   * Dengan debounce: 1 API call
   * Reduce 75% API calls!
   * 
   * DELAY TIME:
   * 500ms adalah balancing point:
   * - Too short (100ms): Still many API calls
   * - Too long (2000ms): User see stale results
   * - 500ms: Good compromise
   */
  useEffect(() => {
    // Set timeout 500ms
    const timeoutId = setTimeout(() => {
      // After 500ms, execute onSearch dengan current query
      // Parent component akan update state dan fetch API
      onSearch(query);
    }, 500);
    
    // Cleanup function: Run sebelum effect run lagi
    // Clear timeout jika component unmount atau dependency berubah
    return () => {
      // Clear timeout sebelumnya untuk prevent multiple API calls
      clearTimeout(timeoutId);
    };
  }, [query, onSearch]);
  
  /**
   * ============================================================
   * HANDLER: Clear Search
   * ============================================================
   * 
   * PURPOSE:
   * Clear search input saat user klik X button
   * 
   * LOGIC:
   * 1. setQuery(''): Reset input value ke kosong
   * 2. useEffect akan trigger karena query berubah
   * 3. setTimeout 500ms di-trigger
   * 4. onSearch('') dipanggil: search dengan empty string
   * 5. Parent akan fetch semua items (no filter)
   * 
   * BENEFIT:
   * ✓ Easy way untuk clear search
   * ✓ Debounce masih work (tidak langsung API call)
   */
  const handleClear = () => {
    setQuery('');
    // onSearch akan otomatis dipanggil via useEffect
  };
  
  /**
   * ============================================================
   * JSX RETURN: SEARCH INPUT
   * ============================================================
   * 
   * STRUCTURE:
   * <div relative>
   *   <svg search-icon>
   *   <input search-field>
   *   <button clear-button (conditional)>
   * </div>
   * 
   * STYLING CLASSES:
   * - relative: Positioning context untuk absolute icons
   * - w-full: Full width
   * - max-w-md: Maximum width (1/3 of container)
   */
  return (
    <div className="relative w-full max-w-md">
      {/* 
        ============================================================
        SEARCH ICON (LEFT SIDE)
        ============================================================
        
        Positioning:
        - absolute: Position relative to parent <div relative>
        - left-3: 12px from left
        - top-1/2: Vertical center
        - -translate-y-1/2: Translate up 50% (center)
        
        Color: text-gray-400 (light gray, placeholder-like)
        
        SVG: Magnifying glass icon (search symbol)
        - w-5 h-5: 20x20px size
        - stroke-currentColor: Use current text color
        - viewBox="0 0 24 24": SVG coordinate system
      */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Magnifying glass icon path */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* 
        ============================================================
        SEARCH INPUT FIELD
        ============================================================
        
        CONTROLLED INPUT:
        - type="text": Text input
        - value={query}: Controlled value from state
        - onChange={(e) => setQuery(e.target.value)}: Update state on change
        - placeholder: Placeholder text
        - aria-label: Accessibility label (for screen readers)
        
        STYLING:
        - w-full: Full width of parent
        - pl-10: Padding left 40px (space untuk search icon)
        - pr-10: Padding right 40px (space untuk clear button)
        - py-3: Padding vertical 12px
        - border border-gray-300: 1px gray border
        - rounded-lg: Rounded corners
        
        FOCUS STATE:
        - focus:outline-none: Remove default outline
        - focus:ring-2: Add 2px focus ring
        - focus:ring-rick-blue: Ring color (brand color)
        - focus:border-transparent: Remove border (ring is focus indicator)
        
        ANIMATION:
        - transition-all: Smooth animation untuk all properties
      */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full 
          pl-10
          pr-10
          py-3 
          border 
          border-gray-300 
          rounded-lg 
          focus:outline-none 
          focus:ring-2 
          focus:ring-rick-blue 
          focus:border-transparent
          transition-all
        "
        aria-label="Search characters"
      />
      
      {/* 
        ============================================================
        CLEAR BUTTON (RIGHT SIDE) - CONDITIONAL
        ============================================================
        
        CONDITION: {query && ( ... )}
        Button hanya tampil jika user sudah ketik something
        Jika input kosong, button tidak visible
        
        Positioning:
        - absolute: Position relative to parent
        - right-3: 12px from right
        - top-1/2: Vertical center
        - -translate-y-1/2: Center vertically
        
        STYLING:
        - text-gray-400: Light gray color
        - hover:text-gray-600: Darker gray on hover
        - transition-colors: Smooth color change
        
        onClick={handleClear}: Clear search saat diklik
        aria-label: Accessibility label
        
        SVG: X icon (close/clear symbol)
      */}
      {query && (
        <button
          onClick={handleClear}
          className="
            absolute 
            right-3 
            top-1/2 
            -translate-y-1/2 
            text-gray-400 
            hover:text-gray-600
            transition-colors
          "
          aria-label="Clear search"
        >
          {/* X icon SVG */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
