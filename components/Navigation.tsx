
// Navigation bar with active route highlighting
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      // Home: exact match only
      // Jangan highlight '/' saat di '/characters'
      return pathname === path;
    }
    // Other paths: starts with match
    // '/characters' match '/characters' dan '/character/1'
    return pathname.startsWith(path);
  };
  
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isActive(href);
    
    return (
      <Link
        href={href}
        className={`
          px-4 py-2 rounded-lg font-semibold transition-all duration-200
          ${active
            ? 'bg-rick-blue text-white'
            : 'text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {children}
      </Link>
    );
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold text-rick-blue hover:opacity-80 transition-opacity"
          >
            Rick & Morty
          </Link>
          
          <div className="flex items-center gap-2">
            <NavLink href="/characters">
              Characters
            </NavLink>
            
            <NavLink href="/locations">
              Locations
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
