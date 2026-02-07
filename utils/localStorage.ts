/**
 * File ini berisi utility functions untuk mengelola localStorage
 * LocalStorage digunakan untuk menyimpan data locations dan assignments secara persistent
 * Data akan tetap ada meskipun browser di-refresh atau ditutup
 */

/**
 * Interface untuk Location
 * Mendefinisikan struktur data location yang akan disimpan
 */
export interface Location {
  id: string;              // Unique identifier untuk location
  name: string;            // Nama location (must be unique)
  characterIds: string[];  // Array of character IDs yang ada di location ini
  createdAt: string;       // Timestamp kapan location dibuat
}

/**
 * Key yang digunakan untuk menyimpan data di localStorage
 * Menggunakan prefix untuk menghindari konflik dengan data lain
 */
const LOCATIONS_KEY = 'rick-morty-locations';

/**
 * Mendapatkan semua locations dari localStorage
 * 
 * @returns Array of Location objects
 * 
 * Cara kerja:
 * 1. Cek apakah code berjalan di browser (typeof window !== 'undefined')
 * 2. Ambil data dari localStorage menggunakan key
 * 3. Parse JSON string menjadi object
 * 4. Return array kosong jika data tidak ada atau terjadi error
 */
export const getLocations = (): Location[] => {
  // Pastikan code ini hanya berjalan di browser (client-side)
  // Karena localStorage hanya tersedia di browser, bukan di server
  if (typeof window === 'undefined') return [];
  
  try {
    // Ambil data dari localStorage
    const data = localStorage.getItem(LOCATIONS_KEY);
    
    // Jika data tidak ada, return array kosong
    if (!data) return [];
    
    // Parse JSON string menjadi array of objects
    return JSON.parse(data) as Location[];
  } catch (error) {
    // Jika terjadi error (misal data corrupt), log error dan return array kosong
    console.error('Error reading locations from localStorage:', error);
    return [];
  }
};

/**
 * Menyimpan array of locations ke localStorage
 * 
 * @param locations - Array of Location objects yang akan disimpan
 * 
 * Cara kerja:
 * 1. Convert array of objects menjadi JSON string
 * 2. Simpan ke localStorage dengan key yang sudah ditentukan
 */
export const saveLocations = (locations: Location[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Convert array menjadi JSON string dan simpan
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error('Error saving locations to localStorage:', error);
  }
};

/**
 * Menambahkan location baru
 * 
 * @param name - Nama location (must be unique)
 * @returns Location object yang baru dibuat, atau null jika nama sudah ada
 * 
 * Validasi:
 * - Nama tidak boleh kosong
 * - Nama harus unik (tidak boleh sama dengan location yang sudah ada)
 */
export const addLocation = (name: string): Location | null => {
  // Trim whitespace dari nama
  const trimmedName = name.trim();
  
  // Validasi: nama tidak boleh kosong
  if (!trimmedName) return null;
  
  // Ambil semua locations yang sudah ada
  const locations = getLocations();
  
  // Cek apakah nama sudah ada (case-insensitive comparison)
  const nameExists = locations.some(
    (loc) => loc.name.toLowerCase() === trimmedName.toLowerCase()
  );
  
  // Jika nama sudah ada, return null
  if (nameExists) return null;
  
  // Buat location object baru
  const newLocation: Location = {
    id: Date.now().toString(), // Generate simple unique ID using timestamp
    name: trimmedName,
    characterIds: [],           // Location baru tidak punya character
    createdAt: new Date().toISOString(), // Simpan timestamp dalam format ISO
  };
  
  // Simpan location baru ke localStorage
  saveLocations([...locations, newLocation]);
  
  return newLocation;
};

/**
 * Assign character ke location
 * 
 * @param characterId - ID character yang akan di-assign
 * @param locationId - ID location tujuan
 * @returns boolean - true jika berhasil, false jika gagal
 * 
 * Rules:
 * - Satu character hanya bisa ada di satu location
 * - Jika character sudah ada di location lain, akan dipindahkan
 */
export const assignCharacterToLocation = (
  characterId: string,
  locationId: string
): boolean => {
  const locations = getLocations();
  
  // Cari location tujuan
  const targetLocation = locations.find((loc) => loc.id === locationId);
  if (!targetLocation) return false;
  
  // Update locations:
  const updatedLocations = locations.map((loc) => {
    // Hapus character dari location lain (jika ada)
    // Filter out characterId dari semua locations
    const filteredIds = loc.characterIds.filter((id) => id !== characterId);
    
    // Jika ini location tujuan, tambahkan characterId
    if (loc.id === locationId) {
      return {
        ...loc,
        characterIds: [...filteredIds, characterId], // Tambah character ke location ini
      };
    }
    
    // Untuk location lain, kembalikan dengan characterIds yang sudah difilter
    return {
      ...loc,
      characterIds: filteredIds,
    };
  });
  
  saveLocations(updatedLocations);
  return true;
};

/**
 * Mendapatkan location di mana character berada
 * 
 * @param characterId - ID character yang dicari
 * @returns Location object atau null jika character tidak ada di location manapun
 */
export const getCharacterLocation = (characterId: string): Location | null => {
  const locations = getLocations();
  
  // Cari location yang mengandung characterId ini
  return locations.find((loc) => loc.characterIds.includes(characterId)) || null;
};

/**
 * Mendapatkan satu location berdasarkan ID
 * 
 * @param locationId - ID location yang dicari
 * @returns Location object atau null jika tidak ditemukan
 */
export const getLocationById = (locationId: string): Location | null => {
  const locations = getLocations();
  return locations.find((loc) => loc.id === locationId) || null;
};

/**
 * Menghapus location
 * 
 * @param locationId - ID location yang akan dihapus
 * @returns boolean - true jika berhasil, false jika gagal
 */
export const deleteLocation = (locationId: string): boolean => {
  const locations = getLocations();
  
  // Filter out location yang akan dihapus
  const updatedLocations = locations.filter((loc) => loc.id !== locationId);
  
  // Jika length sama, berarti location tidak ditemukan
  if (updatedLocations.length === locations.length) return false;
  
  saveLocations(updatedLocations);
  return true;
};

/**
 * Remove character dari location manapun
 * 
 * @param characterId - ID character yang akan diremove
 * @returns boolean - true jika berhasil
 */
export const removeCharacterFromLocations = (characterId: string): boolean => {
  const locations = getLocations();
  
  // Remove characterId dari semua locations
  const updatedLocations = locations.map((loc) => ({
    ...loc,
    characterIds: loc.characterIds.filter((id) => id !== characterId),
  }));
  
  saveLocations(updatedLocations);
  return true;
};
