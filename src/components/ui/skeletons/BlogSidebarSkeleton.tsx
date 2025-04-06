import React from 'react';

export default function BlogSidebarSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-[#191919] rounded-xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-200 dark:bg-[#222222] rounded mb-4 w-2/3"></div>
      
      {/* Categories list */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-[#222222] mr-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
