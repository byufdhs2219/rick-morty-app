/**
 * Character Detail Page
 * 
 * Halaman ini menampilkan detail lengkap satu character
 * Fitur:
 * - Menampilkan semua info character
 * - Assign character ke location (create new atau pilih existing)
 * - Back button untuk kembali ke list
 * 
 * Route: /character/[id]
 */

'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GET_CHARACTER } from '@/lib/apollo/queries';
import { CharacterResponse } from '@/types';
import { LoadingDetailSkeleton } from '@/components/Loading';
import {
  getLocations,
  addLocation,
  assignCharacterToLocation,
  getCharacterLocation,
  type Location,
} from '@/utils/localStorage';

/**
 * Character Detail Page Component
 * 
 * @param params - Dynamic route parameters berisi character ID (Promise di Next.js 15)
 */
export default function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  
  // Next.js 15: params adalah Promise, harus di-await
  // Gunakan React.use() untuk unwrap Promise di Client Component
  const { id: characterId } = React.use(params);
  
  // State untuk modal assign location
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [newLocationName, setNewLocationName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  
  /**
   * Fetch character data dari API
   */
  const { data, loading, error: queryError } = useQuery<CharacterResponse>(
    GET_CHARACTER,
    {
      variables: { id: characterId },
    }
  );
  
  /**
   * Load locations dari localStorage saat component mount
   * dan check current location dari character ini
   */
  useEffect(() => {
    setLocations(getLocations());
    setCurrentLocation(getCharacterLocation(characterId));
  }, [characterId]);
  
  /**
   * Handler untuk open modal
   */
  const handleOpenModal = () => {
    setShowModal(true);
    setError('');
    setNewLocationName('');
    setSelectedLocationId('');
    setIsCreatingNew(false);
    // Refresh locations data
    setLocations(getLocations());
  };
  
  /**
   * Handler untuk close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setNewLocationName('');
    setSelectedLocationId('');
    setIsCreatingNew(false);
  };
  
  /**
   * Handler untuk assign character ke location
   * Bisa create new location atau pilih existing
   */
  const handleAssign = () => {
    setError('');
    
    if (isCreatingNew) {
      // Create new location
      if (!newLocationName.trim()) {
        setError('Please enter a location name');
        return;
      }
      
      // Add location (akan return null jika nama sudah ada)
      const newLoc = addLocation(newLocationName);
      if (!newLoc) {
        setError('Location name already exists. Please use a different name.');
        return;
      }
      
      // Assign character ke location baru
      const success = assignCharacterToLocation(characterId, newLoc.id);
      if (success) {
        setCurrentLocation(newLoc);
        handleCloseModal();
        // Show success message
        alert(`Character assigned to "${newLoc.name}" successfully!`);
      } else {
        setError('Failed to assign character. Please try again.');
      }
    } else {
      // Assign ke existing location
      if (!selectedLocationId) {
        setError('Please select a location');
        return;
      }
      
      const success = assignCharacterToLocation(characterId, selectedLocationId);
      if (success) {
        const loc = locations.find((l) => l.id === selectedLocationId);
        setCurrentLocation(loc || null);
        handleCloseModal();
        alert(`Character assigned to "${loc?.name}" successfully!`);
      } else {
        setError('Failed to assign character. Please try again.');
      }
    }
  };
  
  // Loading state
  if (loading) {
    return <LoadingDetailSkeleton />;
  }
  
  // Error state
  if (queryError || !data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">
          ⚠️ Error loading character
        </div>
        <p className="text-gray-600">
          {queryError?.message || 'Character not found'}
        </p>
        <button
          onClick={() => router.push('/characters')}
          className="btn-primary mt-4"
        >
          Back to Characters
        </button>
      </div>
    );
  }
  
  const character = data.character;
  
  /**
   * Status Badge Component
   */
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      Alive: 'bg-green-100 text-green-800 border-green-300',
      Dead: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    
    const colorClass = colors[status as keyof typeof colors] || colors.unknown;
    
    return (
      <span className={`px-4 py-2 rounded-full font-semibold border-2 ${colorClass}`}>
        {status}
      </span>
    );
  };
  
  /**
   * Info Row Component - untuk menampilkan label dan value
   */
  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="border-b border-gray-200 py-3">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-medium text-gray-900">{value || 'Unknown'}</div>
    </div>
  );
  
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
      
      {/* Character Detail Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, 50vw"
            fetchPriority="high"
          />
        </div>
        
        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Name and Status */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {character.name}
            </h1>
            <StatusBadge status={character.status} />
          </div>
          
          {/* Character Info */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-1">
            <InfoRow label="Species" value={character.species} />
            <InfoRow label="Gender" value={character.gender} />
            {character.type && <InfoRow label="Type" value={character.type} />}
            
            <div className="border-b border-gray-200 py-3">
              <div className="text-sm text-gray-500 mb-1">Origin</div>
              <div className="text-lg font-medium text-gray-900">
                {character.origin.name}
              </div>
              {character.origin.dimension && (
                <div className="text-sm text-gray-500">
                  Dimension: {character.origin.dimension}
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-200 py-3">
              <div className="text-sm text-gray-500 mb-1">Last Known Location</div>
              <div className="text-lg font-medium text-gray-900">
                {character.location.name}
              </div>
              {character.location.dimension && (
                <div className="text-sm text-gray-500">
                  Dimension: {character.location.dimension}
                </div>
              )}
            </div>
            
            {/* Custom Location Assignment */}
            <div className="pt-3">
              <div className="text-sm text-gray-500 mb-2">Custom Location</div>
              {currentLocation ? (
                <div className="flex items-center justify-between bg-portal-green bg-opacity-20 border-2 border-portal-green rounded-lg p-3">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {currentLocation.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Assigned location
                    </div>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="text-sm text-rick-blue hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Not assigned to any custom location
                </div>
              )}
            </div>
          </div>
          
          {/* Assign Button */}
          <button
            onClick={handleOpenModal}
            className="btn-primary w-full text-lg py-4"
          >
            {currentLocation ? 'Reassign to Location' : 'Assign to Location'}
          </button>
          
          {/* Episodes */}
          {character.episode && character.episode.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Episodes ({character.episode.length})
              </h2>
              <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-2">
                {character.episode.map((ep) => (
                  <div
                    key={ep.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-semibold text-gray-900">{ep.name}</div>
                    <div className="text-sm text-gray-600">
                      {ep.episode} • {ep.air_date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal untuk Assign Location */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Assign to Location</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {/* Toggle between existing and new */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsCreatingNew(false)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  !isCreatingNew
                    ? 'bg-rick-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Existing Location
              </button>
              <button
                onClick={() => setIsCreatingNew(true)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  isCreatingNew
                    ? 'bg-rick-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Create New
              </button>
            </div>
            
            {isCreatingNew ? (
              /* Create New Location Form */
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name (must be unique)
                </label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Enter location name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rick-blue"
                  autoFocus
                />
              </div>
            ) : (
              /* Select Existing Location */
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location
                </label>
                {locations.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {locations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedLocationId(loc.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedLocationId === loc.id
                            ? 'border-rick-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{loc.name}</div>
                        <div className="text-sm text-gray-600">
                          {loc.characterIds.length} character(s)
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No locations yet. Create one to get started!
                  </div>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!isCreatingNew && !selectedLocationId && locations.length > 0}
                className="btn-primary flex-1"
              >
                {isCreatingNew ? 'Create & Assign' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
