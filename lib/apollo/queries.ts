/**
 * ============================================================
 * GRAPHQL QUERIES - lib/apollo/queries.ts
 * ============================================================
 * 
 * File ini berisi semua GraphQL queries yang digunakan aplikasi.
 * 
 * WHAT IS GraphQL?
 * GraphQL adalah query language untuk APIs.
 * Berbeda dengan REST API, GraphQL:
 * - Client specify exactly mana fields yang dibutuhkan
 * - Tidak perlu multiple API calls
 * - Reduce over-fetching (tidak ambil data tidak perlu)
 * 
 * EXAMPLE REST API vs GraphQL:
 * 
 * REST API:
 * GET /api/characters/1
 * Response: { id, name, status, species, gender, image, origin, location, ... }
 * └─ Return SEMUA fields meskipun hanya perlu 2-3
 * 
 * GraphQL:
 * query {
 *   character(id: 1) {
 *     name
 *     status
 *   }
 * }
 * Response: { name: "Rick", status: "Alive" }
 * └─ Return HANYA fields yang diminta
 * 
 * BENEFIT:
 * ✓ Smaller payload (faster network)
 * ✓ More flexible (request exactly what you need)
 * ✓ Reduce server load
 * 
 * gql TAG:
 * gql`...` adalah template tag untuk parse GraphQL string
 * Dari @apollo/client library
 * Apollo akan parse dan validate query syntax
 */

import { gql } from '@apollo/client';

/**
 * ============================================================
 * QUERY 1: GET_CHARACTERS - Fetch list of characters
 * ============================================================
 * 
 * PURPOSE:
 * Fetch paginated list of characters dengan optional filtering
 * Used di: /characters page (list view)
 * 
 * PARAMETERS:
 * 
 * $page: Int
 * └─ Nomor halaman untuk pagination
 * └─ Optional (bisa tidak dikirim)
 * └─ Type: Int (integer number)
 * └─ Example: 1, 2, 3, ...
 * 
 * $filter: FilterCharacter
 * └─ Filter object untuk search
 * └─ Optional (bisa tidak dikirim)
 * └─ Type: FilterCharacter (custom input type di API)
 * └─ Available filters: name, status, species, gender, type
 * └─ Example: { name: "Rick", status: "Alive" }
 * 
 * RETURN FIELDS:
 * 
 * characters.info:
 * ├─ count: Total jumlah characters di database
 * ├─ pages: Total halaman (untuk pagination)
 * ├─ next: Nomor halaman berikutnya (null jika halaman terakhir)
 * └─ prev: Nomor halaman sebelumnya (null jika halaman pertama)
 * 
 * characters.results:
 * └─ Array of character objects dengan fields:
 *    ├─ id: Unique identifier (String)
 *    ├─ name: Character name (String)
 *    ├─ status: Alive/Dead/unknown (String)
 *    ├─ species: Human/Alien/etc (String)
 *    ├─ gender: Male/Female/unknown (String)
 *    └─ image: Character avatar image URL (String)
 * 
 * USAGE EXAMPLE:
 * const { data } = useQuery(GET_CHARACTERS, {
 *   variables: { page: 1, filter: { name: "Rick" } }
 * });
 * 
 * data.characters.results.forEach(char => {
 *   console.log(char.name, char.status);
 * });
 * 
 * API PAGINATION:
 * Rick and Morty API returns 20 characters per page
 * Total 826 characters ÷ 20 = 42 pages
 * 
 * PAGINATION USAGE:
 * Page 1: /api/characters?page=1 → Rick, Morty, ...
 * Page 2: /api/characters?page=2 → Jerry, Beth, ...
 * ...
 * Page 42: /api/characters?page=42 → (last 6 characters)
 */
export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

/**
 * ============================================================
 * QUERY 2: GET_CHARACTER - Fetch single character detail
 * ============================================================
 * 
 * PURPOSE:
 * Fetch detailed information untuk 1 character
 * Used di: /character/[id] page (detail view)
 * 
 * PARAMETERS:
 * 
 * $id: ID!
 * └─ Character ID yang ingin di-fetch
 * └─ Type: ID (special type untuk identifiers)
 * └─ ! (exclamation): REQUIRED parameter (harus dikirim)
 * └─ Example: "1", "2", "3", ...
 * 
 * RETURN FIELDS:
 * 
 * Basic info:
 * ├─ id: Character ID
 * ├─ name: Character name
 * ├─ status: Alive/Dead/unknown
 * ├─ species: Human/Alien/etc
 * ├─ type: Subtype/race (empty string if unknown)
 * ├─ gender: Male/Female/unknown
 * ├─ image: Avatar URL
 * └─ created: ISO timestamp when created
 * 
 * origin:
 * ├─ id: Origin planet ID
 * ├─ name: Planet name
 * ├─ type: Planet type
 * └─ dimension: Dimension name
 * 
 * location:
 * ├─ id: Last location ID
 * ├─ name: Location name
 * ├─ type: Location type
 * └─ dimension: Dimension name
 * 
 * episode:
 * └─ Array of episodes character appeared in:
 *    ├─ id: Episode ID
 *    ├─ name: Episode title
 *    ├─ air_date: Air date
 *    └─ episode: Episode number (format: S01E01)
 * 
 * USAGE EXAMPLE:
 * const { data } = useQuery(GET_CHARACTER, {
 *   variables: { id: "1" }
 * });
 * 
 * console.log(data.character.name);
 * console.log(data.character.episode.length);
 * 
 * RICH DATA:
 * Ini adalah query paling detail
 * Return info lengkap tentang 1 character + semua episode
 * Digunakan untuk character detail page
 */
export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      origin {
        id
        name
        type
        dimension
      }
      location {
        id
        name
        type
        dimension
      }
      episode {
        id
        name
        air_date
        episode
      }
      created
    }
  }
`;

/**
 * ============================================================
 * QUERY 3: GET_CHARACTERS_BY_IDS - Fetch multiple characters by IDs
 * ============================================================
 * 
 * PURPOSE:
 * Fetch data untuk multiple characters sekaligus
 * Used untuk: Show characters yang ada di satu location
 * 
 * PARAMETERS:
 * 
 * $ids: [ID!]!
 * └─ Array of character IDs
 * └─ Type: Array of IDs ([ ] = array, ! = required)
 * └─ [ID!]! = array of required IDs (array itself required)
 * └─ Example: ["1", "2", "3", "5"]
 * 
 * RETURN:
 * Array of character objects dengan basic info
 * (tidak se-detail seperti GET_CHARACTER)
 * 
 * USAGE EXAMPLE:
 * 
 * Scenario: Location "Earth (C-500)" ada 50 characters
 * Kalau fetch 1-by-1: 50 queries! ✗
 * Dengan GET_CHARACTERS_BY_IDS: 1 query ✓
 * 
 * const { data } = useQuery(GET_CHARACTERS_BY_IDS, {
 *   variables: { ids: ["1", "2", "3", "4"] }
 * });
 * 
 * EFFICIENCY:
 * ✓ 1 API call untuk many characters
 * ✓ Much faster
 * ✓ Better UX (no loading waterfalls)
 * 
 * API SUPPORT:
 * Tidak semua GraphQL APIs support batch query ini
 * Rick and Morty API mungkin tidak support
 * Included di sini untuk reference/future use
 */
export const GET_CHARACTERS_BY_IDS = gql`
  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      status
      species
      image
      origin {
        name
      }
      location {
        name
      }
    }
  }
`;
