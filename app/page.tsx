
// Home page with hero section, features, and CTA
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-rick-blue">Rick and Morty</span>
          {' '}Universe
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore characters from the Rick and Morty universe. 
          View character details, create custom locations, and organize your favorite characters.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2">Browse Characters</h3>
            <p className="text-gray-600 text-sm">
              Explore hundreds of characters with search and filtering
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2">Custom Locations</h3>
            <p className="text-gray-600 text-sm">
              Create your own locations and assign characters to them
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="font-bold text-lg mb-2">Persistent Data</h3>
            <p className="text-gray-600 text-sm">
              Your custom locations are saved and persist across sessions
            </p>
          </div>
        </div>
        
        <div className="pt-8">
          <Link 
            href="/characters"
            className="btn-primary inline-block text-lg px-8 py-4"
          >
            Start Exploring Characters →
          </Link>
        </div>
        
        <div className="pt-12 text-sm text-gray-500">
          <p>Built with Next.js 14 • React 18 • TypeScript • Tailwind CSS • Apollo GraphQL</p>
        </div>
      </div>
    </div>
  );
}
