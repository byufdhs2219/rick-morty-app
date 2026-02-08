
// Loading components - spinner, skeleton, detail skeleton
'use client';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="
          absolute 
          inset-0 
          border-4 
          border-gray-200 
          border-t-rick-blue 
          rounded-full 
          animate-spin
        " />
      </div>
    </div>
  );
}

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
          
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            
            <div className="h-4 bg-gray-200 rounded w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-24 mb-6" />
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              
              <div className="h-5 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
          
          <div className="h-12 bg-gray-200 rounded w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
