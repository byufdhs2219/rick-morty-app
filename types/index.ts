/**
 * Type Definitions
 * 
 * File ini berisi semua type dan interface yang digunakan dalam aplikasi
 * TypeScript types membantu mencegah bugs dan memberikan autocompletion
 */

/**
 * Info type untuk pagination
 * Berisi informasi tentang total data dan halaman
 */
export interface Info {
  count: number;   // Total jumlah items
  pages: number;   // Total jumlah pages
  next: number | null;  // Nomor page berikutnya (null jika sudah page terakhir)
  prev: number | null;  // Nomor page sebelumnya (null jika page pertama)
}

/**
 * Origin type untuk tempat asal character
 */
export interface Origin {
  id?: string;
  name: string;
  type?: string;
  dimension?: string;
}

/**
 * Location type dari API (berbeda dengan Location di localStorage)
 */
export interface CharacterLocation {
  id?: string;
  name: string;
  type?: string;
  dimension?: string;
}

/**
 * Episode type
 */
export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;  // Format: S01E01
}

/**
 * Character type - main interface untuk character data
 * Berisi semua informasi tentang character
 */
export interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';  // Union type - hanya bisa salah satu dari 3 nilai ini
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;  // URL ke image character
  origin: Origin;
  location: CharacterLocation;
  episode?: Episode[];  // Optional - mungkin tidak selalu ada
  created?: string;     // Optional - ISO date string
}

/**
 * Response type untuk query GET_CHARACTERS
 * Sesuai dengan struktur response dari GraphQL API
 */
export interface CharactersResponse {
  characters: {
    info: Info;
    results: Character[];
  };
}

/**
 * Response type untuk query GET_CHARACTER (single character)
 */
export interface CharacterResponse {
  character: Character;
}

/**
 * Response type untuk query GET_CHARACTERS_BY_IDS
 */
export interface CharactersByIdsResponse {
  charactersByIds: Character[];
}

/**
 * Props types untuk components
 */

export interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

export interface LocationCardProps {
  location: {
    id: string;
    name: string;
    characterIds: string[];
    createdAt: string;
  };
  onClick: () => void;
  characterCount: number;
}
