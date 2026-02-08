
// Character card with image, status badge, and info
'use client';

import Image from 'next/image';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  priority?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500',
  };
  
  const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
      
      {/* STATUS TEXT LABEL */}
      <span className="font-medium">{status}</span>
    </span>
  );
};

export default function CharacterCard({ character, onClick, priority = false }: CharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        card 
        cursor-pointer 
        overflow-hidden 
        hover:scale-[1.02]
        transition-transform 
        duration-200
        flex 
        flex-col
      "
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details of ${character.name}`}
    >
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={character.image}
          alt={character.name}
          
          
          fill
          
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          
          className="object-cover rounded-lg"
          
          quality={priority ? 85 : 80}
          
          loading={priority ? "eager" : "lazy"}
          
          priority={priority}
          
          fetchPriority={priority ? "high" : "low"}
        />
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {character.name}
        </h3>
        
        {/* STATUS BADGE COMPONENT */}
        <StatusBadge status={character.status} />
        
        <div className="text-sm text-gray-600">
          <p>{character.species} • {character.gender}</p>
        </div>
        
        {character.location && (
          <div className="text-sm text-gray-500 mt-auto">
            <p className="font-semibold text-gray-700">Last known location:</p>
            <p className="line-clamp-1">{character.location.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
