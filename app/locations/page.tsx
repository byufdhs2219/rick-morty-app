/**
 * Locations Page
 * 
 * Halaman ini menampilkan list custom locations yang telah dibuat user
 * Fitur:
 * - List all custom locations
 * - Click location untuk lihat characters di location tersebut
 * - Empty state jika belum ada location
 * 
 * Route: /locations
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLocations, type Location } from '@/utils/localStorage';

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * Load locations dari localStorage saat component mount
   */
  useEffect(() => {
    // Slight delay untuk smooth loading state
    setTimeout(() => {
      setLocations(getLocations());
      setIsLoading(false);
    }, 100);
  }, []);
  
  /**
   * Handler ketika location card diklik
   * Navigate ke location detail page
   */
  const handleLocationClick = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };
  
  /**
   * Location Card Component
   */
  const LocationCard = ({ location }: { location: Location }) => {
    const characterCount = location.characterIds.length;
    const createdDate = new Date(location.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    return (
      <div
        onClick={() => handleLocationClick(location.id)}
        className="
          card 
          cursor-pointer 
          hover:scale-[1.02] 
          transition-transform 
          duration-200
        "
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLocationClick(location.id);
          }
        }}
        aria-label={`View characters in ${location.name}`}
      >
        {/* Location Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-portal-green bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
            📍
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {location.name}
            </h3>
            <p className="text-sm text-gray-500">
              Created: {createdDate}
            </p>
          </div>
        </div>
        
        {/* Character Count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              {characterCount} {characterCount === 1 ? 'character' : 'characters'}
            </span>
          </div>
          
          {/* Arrow Icon */}
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Custom Locations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Empty state - belum ada location
  if (locations.length === 0) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Custom Locations</h1>
        
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Locations Yet
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Start by browsing characters and assigning them to custom locations. 
            Your locations will appear here.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/characters')}
              className="btn-primary"
            >
              Browse Characters
            </button>
          </div>
          
          {/* How it works */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-6">How it works:</h3>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">1️⃣</div>
                <h4 className="font-bold mb-2">Find a Character</h4>
                <p className="text-sm text-gray-600">
                  Browse the characters list and click on any character to view details
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">2️⃣</div>
                <h4 className="font-bold mb-2">Assign Location</h4>
                <p className="text-sm text-gray-600">
                  Click "Assign to Location" and create a new custom location
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">3️⃣</div>
                <h4 className="font-bold mb-2">View Here</h4>
                <p className="text-sm text-gray-600">
                  Your custom locations will appear on this page with all assigned characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main render - show locations
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Custom Locations</h1>
        <p className="text-gray-600">
          You have {locations.length} custom {locations.length === 1 ? 'location' : 'locations'}
        </p>
      </div>
      
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              About Custom Locations
            </h4>
            <p className="text-sm text-blue-800">
              These are custom locations you've created to organize characters. 
              Click on any location to see the characters assigned to it. 
              Your data is stored locally and will persist even after refreshing the page.
            </p>
          </div>
        </div>
      </div>
      
      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
