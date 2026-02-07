/**
 * Location Detail Page
 * 
 * Halaman ini menampilkan detail satu location dan list characters yang ada di location tersebut
 * Fitur:
 * - Menampilkan info location
 * - List characters di location (fetch dari API berdasarkan character IDs)
 * - Click character untuk ke detail page
 * - Delete location
 * 
 * Route: /locations/[id]
 */

'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { getLocationById, deleteLocation } from '@/utils/localStorage';
import CharacterCard from '@/components/CharacterCard';
import { LoadingSkeleton } from '@/components/Loading';
import type { Character } from '@/types';

/**
 * Query untuk fetch multiple characters by IDs
 * Menggunakan @export directive untuk query dynamic IDs
 */
const GET_CHARACTERS_BY_IDS = gql`
  query GetCharactersByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      status
      species
      type
      gender
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

export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  
  // Next.js 15: params adalah Promise, unwrap dengan React.use()
  const { id: locationId } = React.use(params);
  
  const [location, setLocation] = useState<ReturnType<typeof getLocationById>>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  /**
   * Load location data dari localStorage
   */
  useEffect(() => {
    const loc = getLocationById(locationId);
    setLocation(loc);
    
    // Jika location tidak ditemukan, redirect ke locations page
    if (!loc) {
      router.push('/locations');
    }
  }, [locationId, router]);
  
  /**
   * Fetch characters data dari API jika ada character IDs
   * skip: true jika tidak ada characters (untuk menghindari query error)
   */
  const { data, loading, error } = useQuery<{ charactersByIds: Character[] }>(
    GET_CHARACTERS_BY_IDS,
    {
      variables: { ids: location?.characterIds || [] },
      skip: !location || location.characterIds.length === 0,
    }
  );
  
  /**
   * Handler untuk delete location
   */
  const handleDeleteLocation = () => {
    const success = deleteLocation(locationId);
    if (success) {
      router.push('/locations');
    } else {
      alert('Failed to delete location. Please try again.');
    }
  };
  
  /**
   * Handler ketika character card diklik
   */
  const handleCharacterClick = (id: string) => {
    router.push(`/character/${id}`);
  };
  
  // Location tidak ditemukan
  if (!location) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Location Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          This location does not exist or has been deleted.
        </p>
        <button
          onClick={() => router.push('/locations')}
          className="btn-primary"
        >
          Back to Locations
        </button>
      </div>
    );
  }
  
  const createdDate = new Date(location.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="btn-secondary mb-6 flex items-center gap-2"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      
      {/* Location Header */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-portal-green bg-opacity-20 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
              📍
            </div>
            
            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {location.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p className="flex items-center gap-2">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="font-semibold">
                    {location.characterIds.length} character{location.characterIds.length !== 1 ? 's' : ''}
                  </span>
                </p>
                <p className="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Created: {createdDate}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="
              px-6 py-3 
              bg-red-500 
              text-white 
              rounded-lg 
              font-semibold 
              hover:bg-red-600 
              transition-colors
              flex 
              items-center 
              gap-2
              self-start
            "
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Location
          </button>
        </div>
      </div>
      
      {/* Characters Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Characters in this Location
        </h2>
        
        {/* No characters */}
        {location.characterIds.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🤷</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Characters Yet
            </h3>
            <p className="text-gray-600 mb-6">
              This location doesn't have any characters assigned to it yet.
            </p>
            <button
              onClick={() => router.push('/characters')}
              className="btn-primary"
            >
              Browse Characters to Assign
            </button>
          </div>
        )}
        
        {/* Loading characters */}
        {loading && <LoadingSkeleton count={6} />}
        
        {/* Error loading characters */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 text-xl mb-2">
              ⚠️ Error loading characters
            </div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        )}
        
        {/* Characters Grid */}
        {data?.charactersByIds && data.charactersByIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.charactersByIds.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Location?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete "{location.name}"? 
                This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Note: Characters assigned to this location will not be deleted, 
                only the location assignment will be removed.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLocation}
                className="
                  flex-1 
                  px-6 py-2 
                  bg-red-500 
                  text-white 
                  rounded-lg 
                  font-semibold 
                  hover:bg-red-600 
                  transition-colors
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
