# Rick and Morty Characters App

Aplikasi web untuk browsing dan mengelola karakter Rick and Morty dengan fitur custom locations.

## 🚀 Teknologi yang Digunakan

- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo Client** - GraphQL client untuk data fetching
- **Rick and Morty GraphQL API** - Sumber data

## ✨ Fitur Utama

### 1. Characters List Page (`/characters`)
- Menampilkan list semua karakter Rick and Morty
- Search/filter karakter by name (dengan debounce)
- Pagination dengan "Load More" button
- Responsive grid layout (1 kolom mobile, 2 kolom tablet, 3 kolom desktop)
- Click karakter untuk melihat detail

### 2. Character Detail Page (`/character/[id]`)
- Menampilkan detail lengkap karakter (nama, status, species, gender, origin, location, episodes)
- Assign karakter ke custom location
- Buat location baru atau pilih existing location
- Validation: nama location harus unique
- Rule: satu karakter hanya bisa ada di satu location
- Reassign karakter ke location lain

### 3. Locations Page (`/locations`)
- Menampilkan list semua custom locations yang telah dibuat
- Menampilkan jumlah karakter di setiap location
- Empty state dengan instruksi cara menggunakan
- Click location untuk melihat karakter di location tersebut

### 4. Location Detail Page (`/locations/[id]`)
- Menampilkan detail location
- List karakter yang ada di location tersebut
- Delete location
- Click karakter untuk ke detail page

## 🎨 UI/UX Features

### Mobile-First Design
- Responsive di semua ukuran layar
- Touch-friendly buttons dan cards
- Optimized untuk mobile browsing

### Single Page Application (SPA)
- Client-side navigation tanpa full page reload
- Smooth transitions antar halaman
- Fast navigation dengan Next.js Link

### Loading States
- Skeleton loading untuk better UX
- Loading spinner untuk async operations
- Progress indicators untuk user feedback

### Accessibility
- Semantic HTML
- ARIA labels untuk screen readers
- Keyboard navigation support
- Focus indicators

### Performance Optimizations
- Next.js Image optimization
- Lazy loading images
- GraphQL query caching dengan Apollo
- Debounced search untuk mengurangi API calls
- Code splitting automatic dengan Next.js

## 📁 Struktur Folder

```
rick-morty-app/
├── app/                          # Next.js App Router
│   ├── characters/              # Characters list page
│   │   └── page.tsx
│   ├── character/[id]/          # Character detail page (dynamic route)
│   │   └── page.tsx
│   ├── locations/               # Locations page
│   │   ├── page.tsx
│   │   └── [id]/               # Location detail page (dynamic route)
│   │       └── page.tsx
│   ├── layout.tsx              # Root layout (navigation, providers)
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # Apollo Provider wrapper
│   └── globals.css             # Global styles dan Tailwind directives
├── components/                  # Reusable components
│   ├── CharacterCard.tsx       # Card component untuk character
│   ├── Loading.tsx             # Loading states (spinner, skeleton)
│   ├── Navigation.tsx          # Navigation bar
│   └── SearchBar.tsx           # Search input dengan debounce
├── lib/
│   └── apollo/                 # Apollo Client setup
│       ├── client.ts           # Apollo Client configuration
│       └── queries.ts          # GraphQL queries
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   └── localStorage.ts         # LocalStorage utility functions
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🔧 Instalasi dan Menjalankan Project

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Langkah-langkah

1. **Clone atau extract project**

2. **Install dependencies**
```bash
npm install
# atau
yarn install
```

3. **Run development server**
```bash
npm run dev
# atau
yarn dev
```

4. **Open browser**
   Buka [http://localhost:3000](http://localhost:3000)

5. **Build untuk production**
```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## 📊 Data Flow

### Character Data (dari API)
1. User membuka Characters page
2. Apollo Client fetch data dari Rick and Morty GraphQL API
3. Data di-cache di memory (InMemoryCache)
4. Render characters dalam grid layout
5. Click character → navigate ke detail page dengan character ID
6. Detail page fetch detail character dari API

### Location Data (localStorage)
1. User assign character ke location di Character Detail page
2. Location data disimpan di localStorage browser
3. Data persist meskipun browser di-refresh atau ditutup
4. Locations page baca data dari localStorage
5. Location detail page fetch characters dari API berdasarkan character IDs

### Data Persistence
- **API Data**: Di-cache oleh Apollo Client (session only)
- **Custom Locations**: Disimpan di localStorage (persistent)
- **Location Assignment**: Disimpan di localStorage (persistent)

## 🎯 Key Concepts & Explanations

### 1. GraphQL dengan Apollo Client
GraphQL adalah query language yang memungkinkan client meminta data spesifik yang dibutuhkan.

**Keuntungan:**
- Tidak over-fetching (hanya request data yang diperlukan)
- Single endpoint untuk semua queries
- Strong typing dengan TypeScript
- Built-in caching

**Cara kerja di aplikasi:**
```typescript
// Define query
const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      # ... field lain yang diperlukan
    }
  }
`;

// Use query di component
const { data, loading, error } = useQuery(GET_CHARACTER, {
  variables: { id: characterId }
});
```

### 2. LocalStorage untuk Persistent Data
localStorage adalah Web API untuk menyimpan data di browser user.

**Karakteristik:**
- Data disimpan sebagai string (perlu JSON.stringify/parse)
- Capacity: ~5-10MB per domain
- Persist sampai explicitly dihapus
- Synchronous API

**Implementasi di aplikasi:**
```typescript
// Save
localStorage.setItem('key', JSON.stringify(data));

// Get
const data = JSON.parse(localStorage.getItem('key') || '[]');

// Delete
localStorage.removeItem('key');
```

### 3. Next.js App Router
Next.js 14 menggunakan App Router yang berbasis pada React Server Components.

**Key features:**
- File-based routing
- Layouts dan nested routes
- Loading dan error states
- Dynamic routes dengan `[id]` folder

**Struktur:**
```
app/
├── page.tsx                    # / route
├── characters/
│   └── page.tsx               # /characters route
└── character/
    └── [id]/
        └── page.tsx           # /character/123 route (dynamic)
```

### 4. TypeScript untuk Type Safety
TypeScript menambahkan static typing ke JavaScript.

**Keuntungan:**
- Catch errors saat development (bukan runtime)
- Better IDE autocomplete
- Self-documenting code
- Refactoring lebih aman

**Contoh:**
```typescript
interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
}

// TypeScript akan error jika property tidak sesuai
const char: Character = {
  id: '1',
  name: 'Rick',
  status: 'Alive' // OK
  // status: 'Living' // Error! Not in union type
};
```

### 5. Tailwind CSS
Utility-first CSS framework yang memungkinkan styling langsung di HTML/JSX.

**Keuntungan:**
- No context switching (CSS di component yang sama)
- No naming conventions needed
- Responsive design mudah
- Small bundle size (unused styles di-purge)

**Contoh:**
```tsx
<button className="
  bg-blue-500      // background blue
  text-white       // text putih
  px-6 py-2        // padding
  rounded-lg       // border radius
  hover:bg-blue-600  // hover effect
  transition-colors  // smooth transition
">
  Click Me
</button>
```

### 6. React Hooks
Hooks adalah functions yang memungkinkan menggunakan state dan lifecycle di functional components.

**Hooks yang digunakan:**

**useState:** Manage local state
```typescript
const [count, setCount] = useState(0);
setCount(count + 1); // Update state
```

**useEffect:** Side effects (fetch data, subscriptions, timers)
```typescript
useEffect(() => {
  // Run on mount dan saat dependency berubah
  fetchData();
}, [dependency]);
```

**useQuery (Apollo):** Fetch GraphQL data
```typescript
const { data, loading, error } = useQuery(QUERY);
```

**useRouter (Next.js):** Navigation
```typescript
const router = useRouter();
router.push('/path'); // Navigate
```

### 7. Debouncing untuk Search
Debouncing menunda eksekusi function sampai user berhenti mengetik.

**Implementasi:**
```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onSearch(query); // Execute setelah 500ms
  }, 500);
  
  return () => clearTimeout(timeoutId); // Cleanup
}, [query]);
```

**Keuntungan:**
- Mengurangi jumlah API calls
- Better performance
- Better UX (tidak lag saat mengetik)

## 🔍 Testing dengan Lighthouse

Aplikasi sudah dioptimasi untuk performa baik. Untuk audit dengan Lighthouse:

1. Buka aplikasi di Chrome
2. Klik kanan → Inspect
3. Tab "Lighthouse"
4. Pilih categories: Performance, Accessibility, Best Practices, SEO
5. Click "Analyze page load"

**Target metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 📝 Notes

### Data Persistence
- Custom locations disimpan di localStorage browser
- Data akan hilang jika user clear browser data
- Data tidak ter-sync antar devices
- Untuk production, pertimbangkan menggunakan database

### API Limitations
- Rick and Morty API adalah public API tanpa rate limiting
- Jika API down, aplikasi akan menampilkan error state
- API tidak memerlukan authentication

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage support required

## 🚀 Deployment

Aplikasi ini bisa di-deploy ke berbagai platform:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📚 Sumber Belajar

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Rick and Morty API Docs](https://rickandmortyapi.com/documentation)

## 👤 Author

Dibuat untuk memenuhi Frontend Web Test - MOSTRANS Tech

## 📄 License

MIT License - feel free to use this project for learning purposes.
