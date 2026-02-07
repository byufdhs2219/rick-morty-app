/**
 * ============================================================
 * PROVIDERS COMPONENT - app/providers.tsx
 * ============================================================
 * 
 * Wrapper component yang menyediakan semua context providers 
 * untuk aplikasi. Ini adalah "pusat data management" aplikasi.
 * 
 * PROVIDER yang digunakan:
 * 1. ApolloProvider - GraphQL state management dan data fetching
 * 
 * MENGAPA PERLU PROVIDERS?
 * - React Context memerlukan Provider component untuk bekerja
 * - ApolloProvider membuat Apollo Client tersedia ke semua child components
 * - Semua component di bawah Provider bisa pakai Apollo hooks
 * 
 * ALUR KERJA:
 * 1. RootLayout render <Providers>
 * 2. Providers render <ApolloProvider>
 * 3. ApolloProvider wrap {children}
 * 4. Sekarang semua children bisa akses Apollo Client
 * 
 * EXAMPLE TANPA PROVIDER:
 * ✗ Component tidak bisa pakai useQuery
 * ✗ Error: "Could not find Apollo Client"
 * 
 * EXAMPLE DENGAN PROVIDER:
 * ✓ Component bisa pakai useQuery, useMutation, dll
 * ✓ Apollo Client tersedia via React Context
 * 
 * 'use client' DIRECTIVE:
 * - Ini Client Component karena pakai context (client-side feature)
 * - Jangan gunakan Server Component directives di sini
 */

'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/client';

/**
 * ============================================================
 * PROVIDERS FUNCTION
 * ============================================================
 * 
 * PROPS:
 * @param children - React.ReactNode
 *   Component anak yang akan dibungkus dengan providers
 *   Biasanya adalah page content atau layout children
 * 
 * RETURN:
 * React component yang render ApolloProvider wrapper
 * 
 * TYPESCRIPT:
 * { children }: { children: React.ReactNode }
 * └─ Destructure props dan define tipe React.ReactNode
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {/* 
        ============================================================
        APOLLO PROVIDER EXPLANATION
        ============================================================
        
        ApolloProvider Component:
        ✓ Wrapper component dari Apollo Client library
        ✓ Membuat apolloClient tersedia ke seluruh tree
        ✓ Menggunakan React Context di belakang layar
        
        client={apolloClient}:
        ✓ Prop yang menerima Apollo Client instance
        ✓ apolloClient di-import dari @/lib/apollo/client
        ✓ Instance sudah dikonfigurasi dengan:
          - GraphQL endpoint URL
          - Cache strategy (InMemoryCache)
          - Default fetch policies
        
        ============================================================
        APOLLO CLIENT CAPABILITIES
        ============================================================
        
        Setiap component di bawah ApolloProvider bisa gunakan:
        
        1. useQuery(QUERY)
           └─ Fetch data dari GraphQL API
           └─ Auto caching
           └─ Loading state, error handling
           
           Contoh:
           const { data, loading, error } = useQuery(GET_CHARACTERS);
        
        2. useMutation(MUTATION)
           └─ Modify data (create, update, delete)
           └─ Trigger dengan function
           └─ Auto refetch related queries
           
           Contoh:
           const [createLocation] = useMutation(CREATE_LOCATION);
           createLocation({ variables: { name: 'Earth' } });
        
        3. useLazyQuery(QUERY)
           └─ Fetch data on demand (not automatic)
           └─ Trigger dengan function ketika diperlukan
           └─ Berguna untuk optional data
           
           Contoh:
           const [fetchDetails, { data }] = useLazyQuery(GET_CHARACTER);
           fetchDetails({ variables: { id: 1 } });
        
        4. useApolloClient()
           └─ Direct access ke Apollo Client instance
           └─ Untuk advanced operations
           
           Contoh:
           const client = useApolloClient();
           client.cache.reset();
        
        ============================================================
        REACT CONTEXT UNDER THE HOOD
        ============================================================
        
        ApolloProvider menggunakan React Context:
        
        ┌─────────────────────────────────────┐
        │ ApolloProvider (Provider)            │ ← Create context
        │  client={apolloClient}               │
        │                                      │
        │  ┌──────────────────────────────┐  │
        │  │ child components              │  │ ← Can access context
        │  │ useQuery() ✓                  │  │
        │  │ useMutation() ✓               │  │
        │  └──────────────────────────────┘  │
        └─────────────────────────────────────┘
        
        Component di luar Provider:
        ✗ Tidak bisa akses apolloClient
        ✗ useQuery() akan throw error
      */}
      {children}
    </ApolloProvider>
  );
}
