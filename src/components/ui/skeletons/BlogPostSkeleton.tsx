import React from 'react';

export default function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center">
          <div className="h-3 w-16 bg-gray-200 dark:bg-[#222222] rounded"></div>
          <div className="mx-2 h-3 w-3 bg-gray-200 dark:bg-[#222222] rounded"></div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-[#222222] rounded"></div>
          <div className="mx-2 h-3 w-3 bg-gray-200 dark:bg-[#222222] rounded"></div>
          <div className="h-3 w-40 bg-gray-200 dark:bg-[#222222] rounded"></div>
        </div>
      </div>

      {/* Post Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center">
          <div className="h-4 w-4 bg-gray-200 dark:bg-[#222222] rounded-full mr-2"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-[#222222] rounded"></div>
        </div>
      </div>

      {/* Post Title */}
      <div className="h-12 bg-gray-200 dark:bg-[#222222] rounded mb-4 w-3/4"></div>
      
      {/* Post Date and Author */}
      <div className="flex items-center mb-8">
        <div className="h-3 w-24 bg-gray-200 dark:bg-[#222222] rounded"></div>
        <div className="mx-2 h-3 w-3 bg-gray-200 dark:bg-[#222222] rounded-full"></div>
        <div className="h-3 w-20 bg-gray-200 dark:bg-[#222222] rounded"></div>
      </div>
      
      {/* Cover Image */}
      <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-[#222222] rounded-lg mb-8"></div>
      
      {/* Content Blocks */}
      <div className="space-y-4 mb-10">
        {/* Paragraphs */}
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-10/12"></div>
        
        {/* Space */}
        <div className="h-6"></div>
        
        {/* Subheading */}
        <div className="h-6 bg-gray-200 dark:bg-[#222222] rounded w-1/3"></div>
        
        {/* More paragraphs */}
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-9/12"></div>
        
        {/* Space */}
        <div className="h-6"></div>
        
        {/* Subheading */}
        <div className="h-6 bg-gray-200 dark:bg-[#222222] rounded w-1/4"></div>
        
        {/* Final paragraphs */}
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#222222] rounded w-3/4"></div>
      </div>
      
      {/* Categories */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-200 dark:bg-[#222222] rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-[#222222] rounded-full"></div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-[#222222] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
