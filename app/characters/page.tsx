/**
 * ========================================
 * HALAMAN CHARACTERS LIST
 * ========================================
 * 
 * Halaman ini menampilkan daftar karakter Rick and Morty.
 * User bisa:
 * 1. Lihat semua karakter dalam bentuk grid/kartu
 * 2. Search karakter by nama
 * 3. Load more untuk lihat karakter berikutnya
 * 4. Click karakter untuk lihat detail
 * 
 * URL: localhost:3000/characters
 */

// 'use client' artinya: ini adalah Client Component (jalan di browser)
// Kita perlu ini karena pakai hooks seperti useState, useQuery
'use client';

// ========================================
// IMPORT LIBRARIES & COMPONENTS
// ========================================

// Suspense: untuk defer loading non-critical components
import { Suspense } from 'react';

// useState: untuk menyimpan data yang bisa berubah (seperti page number, search query)
import { useState } from 'react';

// React: kita pakai untuk React.useMemo (optimize performance)
import * as React from 'react';

// useQuery: untuk fetch data dari GraphQL API
import { useQuery } from '@apollo/client';

// useRouter: untuk navigasi ke halaman lain (misalnya ke detail character)
import { useRouter } from 'next/navigation';

// GET_CHARACTERS: query GraphQL yang sudah kita buat untuk fetch data karakter
import { GET_CHARACTERS } from '@/lib/apollo/queries';

// CharactersResponse: tipe data TypeScript untuk response dari API
import { CharactersResponse } from '@/types';

// CharacterCard: komponen kartu untuk tampilkan 1 karakter
import CharacterCard from '@/components/CharacterCard';

// SearchBar: komponen input search
import SearchBar from '@/components/SearchBar';

// LoadingSkeleton, LoadingSpinner: komponen loading animation
import { LoadingSkeleton, LoadingSpinner } from '@/components/Loading';

// ========================================
// MAIN COMPONENT
// ========================================

export default function CharactersPage() {
  // ========================================
  // 1. SETUP ROUTER
  // ========================================
  // Router dipakai untuk pindah halaman (navigasi)
  // Contoh: router.push('/character/1') -> pindah ke halaman detail character ID 1
  const router = useRouter();
  
  // ========================================
  // 2. STATE MANAGEMENT
  // ========================================
  // State itu seperti "memori" component
  // Kalau state berubah, component akan render ulang (update tampilan)
  
  // State untuk nomor halaman (pagination)
  // Mulai dari halaman 1
  // setPage adalah function untuk ubah nilai page
  const [page, setPage] = useState(1);
  
  // State untuk menyimpan text yang user ketik di search bar
  // Awalnya kosong ''
  const [searchQuery, setSearchQuery] = useState('');
  
  // ========================================
  // 3. FETCH DATA DARI API
  // ========================================
  // useQuery adalah hook dari Apollo Client untuk fetch data dari GraphQL API
  // Ini seperti fetch() atau axios, tapi khusus untuk GraphQL
  
  const { data, loading, error, fetchMore } = useQuery<CharactersResponse>(
    GET_CHARACTERS, // Query yang mau dijalankan (lihat di lib/apollo/queries.ts)
    {
      // VARIABLES: parameter yang dikirim ke API
      variables: {
        // Kirim nomor halaman (dari state 'page')
        page,
        
        // FILTER: jika user ketik di search bar, kirim filter
        // Contoh: searchQuery = "Rick" -> filter = { name: "Rick" }
        // Jika searchQuery kosong -> filter = undefined (tidak filter)
        filter: searchQuery ? { name: searchQuery } : undefined,
      },
      
      // NOTIFY ON NETWORK STATUS CHANGE:
      // Artinya: beritahu component kalau status loading berubah
      // Contoh: saat klik "Load More", loading jadi true, button bisa tampil "Loading..."
      // Tanpa ini, loading akan tetap false dan user bingung
      notifyOnNetworkStatusChange: true,
    }
  );
  
  // PENJELASAN RETURN VALUE dari useQuery:
  // - data: hasil dari API (berisi array karakter, info pagination, dll)
  // - loading: true kalau sedang fetch data, false kalau sudah selesai
  // - error: kalau ada error (misalnya API down, internet mati)
  // - fetchMore: function untuk load data tambahan (untuk pagination)
  
  // ========================================
  // 4. REMOVE DUPLICATES
  // ========================================
  // Kadang API atau Apollo Client bisa return karakter yang sama 2x (duplicate)
  // useMemo ini untuk filter supaya hanya tampil karakter unique
  
  const uniqueResults = React.useMemo(() => {
    // PENTING: Hook ini HARUS dipanggil SEBELUM conditional return (if loading, if error)
    // Kenapa? Karena React butuh urutan hooks yang sama di setiap render
    // Kalau hook dipanggil setelah 'return', urutannya jadi berantakan -> error
    
    // Kalau data belum ada (misalnya masih loading), return array kosong
    if (!data?.characters.results) return [];
    
    // Set adalah struktur data JavaScript untuk menyimpan nilai unique
    // Kita pakai Set untuk track ID yang sudah dilihat
    const seen = new Set();
    
    // Filter array karakter:
    return data.characters.results.filter((character) => {
      // Cek apakah ID karakter ini sudah pernah dilihat sebelumnya
      if (seen.has(character.id)) {
        // Sudah pernah dilihat = duplicate -> buang (return false)
        return false;
      }
      
      // Belum pernah dilihat:
      // 1. Simpan ID ini ke Set supaya nanti kalau ketemu lagi bisa tahu itu duplicate
      seen.add(character.id);
      
      // 2. Keep karakter ini (return true)
      return true;
    });
    
    // DEPENDENCY: [data?.characters.results]
    // Artinya: hitung ulang HANYA kalau data.characters.results berubah
    // Kalau data sama, pakai hasil yang sudah di-cache (tidak hitung ulang)
    // Ini untuk optimize performance supaya tidak filter ulang tiap render
  }, [data?.characters.results]);
  
  // ========================================
  // 5. HANDLER FUNCTIONS
  // ========================================
  // Handler adalah function yang dipanggil saat user melakukan aksi
  
  /**
   * handleSearch - Dipanggil saat user ketik di search bar
   * @param query - Text yang user ketik (contoh: "Rick")
   */
  const handleSearch = (query: string) => {
    // Update state searchQuery dengan text yang user ketik
    setSearchQuery(query);
    
    // Reset page ke 1
    // Kenapa? Karena kalau user search, kita mau tampil hasil dari awal (page 1)
    // Bukan dari page yang sedang dibuka (misalnya page 5)
    setPage(1);
  };
  
  /**
   * handleLoadMore - Dipanggil saat user click button "Load More"
   * Function ini akan fetch karakter tambahan (pagination)
   */
  const handleLoadMore = () => {
    // Cek dulu: apakah masih ada halaman berikutnya?
    // info.next berisi nomor halaman berikutnya
    // Kalau null, berarti sudah halaman terakhir
    if (!data?.characters.info.next) return;
    
    // fetchMore: function dari Apollo Client untuk load data tambahan
    fetchMore({
      // Variables: kirim nomor halaman berikutnya
      variables: {
        page: data.characters.info.next,
      },
      
      // updateQuery: cara menggabungkan data lama dengan data baru
      updateQuery: (prevResult, { fetchMoreResult }) => {
        // Kalau fetchMoreResult tidak ada (error atau gagal), return data lama
        if (!fetchMoreResult) return prevResult;
        
        // Gabungkan data:
        return {
          characters: {
            // Ambil info pagination dari data baru (next, prev, count, dll)
            ...fetchMoreResult.characters,
            
            // RESULTS: gabungkan array karakter lama + karakter baru
            // Contoh: 
            // - prevResult: [character 1-20]
            // - fetchMoreResult: [character 21-40]
            // - hasil: [character 1-40]
            results: [
              ...prevResult.characters.results,  // Karakter lama (1-20)
              ...fetchMoreResult.characters.results, // Karakter baru (21-40)
            ],
          },
        };
      },
    });
  };
  
  /**
   * handleCharacterClick - Dipanggil saat user click kartu karakter
   * @param id - ID karakter yang diklik (contoh: "1")
   */
  const handleCharacterClick = (id: string) => {
    // Navigate (pindah) ke halaman detail karakter
    // Contoh: id = "1" -> pindah ke /character/1
    router.push(`/character/${id}`);
  };
  
  // Loading state - tampilkan skeleton
  if (loading && !data) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Characters</h1>
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <LoadingSkeleton count={9} />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">
          ⚠️ Error loading characters
        </div>
        <p className="text-gray-600">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // No data state
  if (!data?.characters.results.length) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Characters</h1>
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No characters found
          </h2>
          <p className="text-gray-600">
            Try adjusting your search query
          </p>
        </div>
      </div>
    );
  }
  
  // Main render
  const { info } = data.characters;
  const hasMore = info.next !== null;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Characters</h1>
        <p className="text-gray-600">
          Found {info.count} characters
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch}
          initialValue={searchQuery}
        />
      </div>
      
      {/* Characters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueResults.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={() => handleCharacterClick(character.id)}
            priority={index < 3}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-primary min-w-[200px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Loading...
              </span>
            ) : (
              'Load More Characters'
            )}
          </button>
        </div>
      )}
      
      {/* End of list message */}
      {!hasMore && uniqueResults.length > 0 && (
        <div className="mt-12 text-center text-gray-500">
          <p>You've reached the end of the list! 🎉</p>
        </div>
      )}
    </div>
  );
}
