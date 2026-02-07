/**
 * ============================================================
 * APOLLO CLIENT CONFIGURATION - lib/apollo/client.ts
 * ============================================================
 * 
 * File ini mengkonfigurasi Apollo Client untuk mengelola:
 * 1. GraphQL API communication
 * 2. Data caching strategy
 * 3. Error handling
 * 4. Default fetch policies
 * 
 * APOLLO CLIENT adalah library yang menyediakan:
 * ✓ GraphQL query execution
 * ✓ Automatic caching
 * ✓ State management
 * ✓ Real-time data subscriptions (opsional)
 * 
 * ALUR KERJA:
 * Component useQuery()
 *     ↓
 * Apollo Client cek cache
 *     ↓ (jika tidak di cache)
 * Send HTTP request ke GraphQL endpoint
 *     ↓
 * Get response dari API
 *     ↓
 * Store di cache
 *     ↓
 * Return data ke component
 * 
 * BENEFIT dari caching:
 * - Query kedua kalinya: instant (dari cache, tidak perlu API call)
 * - Reduce server load
 * - Better UX (faster response)
 * - Offline support (data masih ada di cache)
 */

import { ApolloClient, InMemoryCache, HttpLink, FetchPolicy, ApolloLink } from '@apollo/client';

/**
 * ============================================================
 * CREATE APOLLO CLIENT FUNCTION
 * ============================================================
 * 
 * FUNCTION PURPOSE:
 * Membuat dan konfigurasi Apollo Client instance dengan:
 * - Network link (HTTP endpoint)
 * - Cache configuration
 * - Default options
 * 
 * RETURN:
 * ApolloClient instance yang siap digunakan
 * 
 * WHY FUNCTION?
 * Memudahkan untuk reset atau membuat multiple instances jika perlu
 * (meskipun di sini kita hanya buat 1 singleton instance)
 */
function createApolloClient() {
  return new ApolloClient({
    /**
     * ============================================================
     * NETWORK LINK (HTTP CONFIGURATION)
     * ============================================================
     * 
     * HttpLink: Menghubungkan Apollo Client dengan GraphQL API
     * Setiap GraphQL request akan di-send ke endpoint yang dikonfigurasi
     */
    link: new HttpLink({
      /**
       * URI: GraphQL API Endpoint
       * 
       * URL: https://rickandmortyapi.com/graphql
       * 
       * ENDPOINT FEATURES:
       * ✓ Public API (tidak perlu authentication)
       * ✓ CORS enabled (bisa diakses dari browser)
       * ✓ Free tier (no rate limiting yang ketat)
       * 
       * EXAMPLE REQUESTS YANG AKAN DIKIRIM KE ENDPOINT INI:
       * 
       * POST /graphql
       * Content-Type: application/json
       * 
       * {
       *   "query": "query GetCharacters($page: Int) { ... }",
       *   "variables": { "page": 1 }
       * }
       */
      uri: 'https://rickandmortyapi.com/graphql',

      /**
       * CREDENTIALS: Cookie handling
       * 
       * 'same-origin' berarti:
       * ✓ Send cookies jika request ke same origin (same domain)
       * ✗ Jangan send cookies ke cross-origin (different domain)
       * 
       * KENAPA PENTING?
       * Beberapa API memerlukan authentication via cookies
       * Setting ini memastikan cookies dikirim jika diperlukan
       * 
       * KEAMANAN:
       * ✓ Tidak mengirim cookies ke domain lain (security risk)
       * ✓ Prevent CSRF attacks dengan same-origin policy
       */
      credentials: 'same-origin',
    }),
    
    /**
     * ============================================================
     * CACHE CONFIGURATION (IN-MEMORY CACHE)
     * ============================================================
     * 
     * InMemoryCache: Apollo's caching strategy
     * 
     * CARA KERJA:
     * Setiap response dari API disimpan di memory (RAM) browser
     * Saat query yang sama diminta lagi, Apollo return dari cache
     * 
     * CACHE STRUCTURE:
     * {
     *   Query: {
     *     characters: [{ id: 1, name: "Rick" }, { id: 2, name: "Morty" }]
     *   }
     * }
     * 
     * BENEFIT:
     * ✓ Instant data retrieval (no network latency)
     * ✓ Reduce server load
     * ✓ Better offline experience
     * ✓ Automatic UI updates (reactive)
     */
    cache: new InMemoryCache({
      /**
       * TYPE POLICIES: Custom cache merging logic
       * 
       * DEFAULT BEHAVIOR:
       * Ketika data baru dari API datang, replace completely
       * Contoh: Page 1 query hasil = [Rick, Morty]
       *         Page 2 query hasil = [Summer, Beth]
       *         Cache akhir = [Summer, Beth]  ← Previous data hilang!
       * 
       * DENGAN TYPE POLICIES:
       * Kita bisa define custom merge logic
       * Contoh: Page 1 cache = [Rick, Morty]
       *         Page 2 hasil = [Summer, Beth]
       *         Custom merge = [Rick, Morty, Summer, Beth] ← Cumulative!
       * 
       * KENAPA PENTING?
       * Untuk infinite scroll / pagination scenarios
       * User scroll, load more data, data ditambahkan ke cache
       * Bukan di-replace
       */
      typePolicies: {
        /**
         * QUERY TYPE POLICY:
         * Mengatur bagaimana Query field di-cache
         */
        Query: {
          fields: {
            /**
             * CHARACTERS FIELD POLICY:
             * Custom logic untuk 'characters' field
             * 
             * USED BY:
             * const { data } = useQuery(GET_CHARACTERS);
             * └─ Apollo akan gunakan policy ini untuk cache 'characters'
             */
            characters: {
              /**
               * KEY ARGS: Which arguments make this query unique?
               * 
               * keyArgs: ['filter']
               * Berarti:
               * - Query dengan filter berbeda = cache terpisah
               * - Query tanpa filter = cache terpisah
               * - Query dengan page berbeda = same cache
               * 
               * EXAMPLE:
               * Query #1: characters(filter: { name: "Rick" }) 
               *           → Cache key = `characters:filter:{"name":"Rick"}`
               * 
               * Query #2: characters(filter: { name: "Morty" })
               *           → Cache key = `characters:filter:{"name":"Morty"}`
               * 
               * Query #3: characters(page: 2, filter: { name: "Rick" })
               *           → Cache key = `characters:filter:{"name":"Rick"}`
               *           ← SAME cache sebagai Query #1!
               *           ← Page argument IGNORED
               * 
               * KENAPA?
               * Pagination biasanya cumulative (load more)
               * Tidak mau replace cache saat page berubah
               * Hanya care tentang filter (new search term)
               */
              keyArgs: ['filter'],
              
              /**
               * MERGE FUNCTION: Custom merge logic
               * 
               * Dipanggil saat data baru dari API datang
               * Decide bagaimana merge dengan existing cache
               * 
               * PARAMETERS:
               * - existing: Data yang sudah ada di cache
               * - incoming: Data baru dari API response
               * - { args }: Additional context (like query arguments)
               * 
               * RETURN:
               * Merged data yang akan disimpan ke cache
               */
              merge(existing, incoming, { args }) {
                /**
                 * CASE 1: Pertama kali fetch (tidak ada cache)
                 * 
                 * Contoh:
                 * - User akses /characters halaman pertama
                 * - Cache masih kosong
                 * - existing = undefined
                 * 
                 * Solusi:
                 * Return incoming data sebagai cache baru
                 */
                if (!existing) return incoming;
                
                /**
                 * CASE 2: Ada data existing, ada data incoming
                 * 
                 * Contoh:
                 * - User akses page 1 → cache [Rick, Morty]
                 * - User scroll, akses page 2 → incoming [Summer, Beth]
                 * - Mau cache akhir = [Rick, Morty, Summer, Beth]
                 * 
                 * LOGIC:
                 * 1. Extract results dari existing cache
                 * 2. Extract results dari incoming data
                 * 3. Remove duplicates
                 * 4. Combine dan return
                 */

                // Extract results array dari existing cache
                // Default ke empty array jika tidak ada
                const existingResults = existing.results || [];

                // Extract results array dari incoming data
                const incomingResults = incoming.results || [];
                
                /**
                 * CREATE DUPLICATE DETECTION SET:
                 * 
                 * Gunakan Set untuk fast lookup O(1)
                 * Daripada Array yang O(n)
                 * 
                 * __ref: Apollo internal reference (untuk cached objects)
                 * id: Object ID (fallback)
                 */
                const existingIds = new Set(
                  existingResults.map((item: any) => item.__ref || item.id)
                );
                
                /**
                 * FILTER DUPLICATES:
                 * 
                 * Hanya ambil items dari incoming yang BELUM ada di cache
                 * Cegah duplicate React keys warning
                 */
                const newResults = incomingResults.filter((item: any) => {
                  const id = item.__ref || item.id;
                  return !existingIds.has(id);  // true jika belum ada
                });
                
                /**
                 * MERGE & RETURN:
                 * 
                 * Spread incoming (meta data: total count, pages, etc)
                 * Combine existing + new results (cumulative)
                 * 
                 * RESULT:
                 * {
                 *   info: { count: 826, pages: 42, ... },
                 *   results: [Rick, Morty, Summer, Beth, ...]
                 * }
                 */
                return {
                  ...incoming,  // Keep meta data dari incoming
                  results: [...existingResults, ...newResults],  // Cumulative results
                };
              },
            },
          },
        },
      },
    }),
    
    /**
     * ============================================================
     * SSR MODE CONFIGURATION
     * ============================================================
     * 
     * ssrMode: false
     * 
     * SSR = Server-Side Rendering
     * 
     * DALAM PROJECT INI:
     * ✓ Menggunakan Client-Side Rendering
     * ✓ Data fetch di browser (client), bukan di server
     * ✓ ssrMode: false memberitahu Apollo
     * 
     * JIKA ssrMode: true:
     * ✗ Apollo akan prepare untuk server rendering
     * ✗ Tidak perlu untuk project ini
     * ✗ Bisa menambah overhead
     */
    ssrMode: false,
    
    /**
     * ============================================================
     * DEFAULT OPTIONS (GLOBAL CONFIGURATION)
     * ============================================================
     * 
     * Opsi default yang diapply ke SEMUA queries & mutations
     * Bisa di-override per query jika perlu
     * 
     * MENGAPA?
     * Untuk konsistensi behavior di seluruh aplikasi
     */
    defaultOptions: {
      /**
       * WATCH QUERY DEFAULT OPTIONS:
       * 
       * watchQuery = Query yang di-monitor untuk updates
       * Saat data berubah di cache, component auto re-render
       */
      watchQuery: {
        /**
         * FETCH POLICY: 'cache-and-network'
         * 
         * STRATEGI:
         * 1. Langsung return cache jika ada (INSTANT)
         * 2. Background fetch dari network untuk update (FRESH)
         * 3. Trigger re-render saat data baru datang
         * 
         * ALUR TIMELINE:
         * t=0ms: Component render, Apollo return cache data
         * t=1ms: Component display data (instant from cache)
         * t=100ms: Network request dikirim (background)
         * t=500ms: Response diterima, cache updated
         * t=501ms: Component re-render dengan data baru
         * 
         * BENEFIT:
         * ✓ Fast first paint (dari cache)
         * ✓ Always fresh data (network fetch)
         * ✓ Good UX (no loading spinner, smooth update)
         * 
         * ALTERNATIF POLICIES:
         * - 'cache-only': Hanya dari cache (cepat, tapi bisa stale)
         * - 'network-only': Hanya dari network (selalu fresh, tapi lambat)
         * - 'cache-first': Cache dulu, fetch jika tidak ada
         * - 'no-cache': Selalu fetch, tapi tetap cache response
         */
        fetchPolicy: 'cache-and-network' as FetchPolicy,

        /**
         * ERROR POLICY: 'all'
         * 
         * BEHAVIOR:
         * Jika ada field error, tetap return data dari field lain
         * 
         * EXAMPLE:
         * Query:
         * {
         *   characters { id, name, unknownField }
         * }
         * 
         * Response GraphQL:
         * {
         *   "data": {
         *     "characters": [
         *       { "id": 1, "name": "Rick", "unknownField": null }
         *     ]
         *   },
         *   "errors": [
         *     { "message": "Field unknownField doesn't exist" }
         *   ]
         * }
         * 
         * DENGAN errorPolicy: 'all':
         * ✓ Return { id: 1, name: "Rick" } (partial data)
         * ✓ Application tetap bisa pakai id dan name
         * 
         * DENGAN errorPolicy: 'none':
         * ✗ Return null (ada error, return apa-apa)
         * ✗ Application tidak bisa pakai data
         * 
         * BENEFIT:
         * Graceful degradation (aplikasi tetap jalan meski ada error)
         */
        errorPolicy: 'all',
      },

      /**
       * QUERY DEFAULT OPTIONS:
       * Same seperti watchQuery (untuk non-watched queries)
       */
      query: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * ============================================================
 * SINGLETON EXPORT
 * ============================================================
 * 
 * SINGLETON PATTERN:
 * Hanya ada 1 instance Apollo Client di seluruh aplikasi
 * 
 * BENEFIT:
 * ✓ Shared cache across entire app
 * ✓ Consistent state
 * ✓ Efficient memory usage
 * 
 * ALUR:
 * 1. First time: createApolloClient() dipanggil, create instance
 * 2. Subsequent times: return same instance (sudah dibuat)
 * 
 * HOW IT WORKS:
 * const apolloClient = createApolloClient();  ← Create once
 * export const apolloClient = ...              ← Export reference
 * 
 * Saat di-import di file lain:
 * import { apolloClient } from '@/lib/apollo/client'
 * ← Menggunakan SAME instance yang sudah dibuat
 */
export const apolloClient = createApolloClient();

/**
 * DEFAULT EXPORT:
 * Untuk kompatibilitas dengan import style:
 * import apolloClient from '@/lib/apollo/client'
 */
export default apolloClient;
