import React from 'react';

export default function BlogCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-[#191919] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-48 w-full bg-gray-200 dark:bg-[#222222]"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Date placeholder */}
        <div className="h-3 w-20 bg-gray-200 dark:bg-[#222222] rounded mb-2"></div>
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 dark:bg-[#222222] rounded mb-2 w-full"></div>
        <div className="h-6 bg-gray-200 dark:bg-[#222222] rounded mb-4 w-3/4"></div>
        
        {/* Excerpt placeholder */}
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded mb-4 w-2/3"></div>
        
        {/* Read more link placeholder */}
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-32 mt-auto"></div>
      </div>
    </div>
  );
}
