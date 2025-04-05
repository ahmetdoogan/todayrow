"use client";

import React, { useEffect, useRef } from "react";
import CategoryAccordion from "./CategoryAccordion";

interface BlogSidebarProps {
  categories: {
    key: string;
    label: string;
  }[];
  selectedCategory?: string;
  t: any; // Translation function
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ categories, selectedCategory, t }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bu, sticky davranışının düzgün çalışmasını sağlayacak
    if (sidebarRef.current) {
      sidebarRef.current.style.position = 'sticky';
      sidebarRef.current.style.top = '90px';
      sidebarRef.current.style.zIndex = '10';
    }
  }, []);

  return (
    <div className="mt-8 lg:mt-0 w-full" ref={sidebarRef}>
      <div 
        className="bg-gray-50 dark:bg-[#191919] rounded-xl p-6 border border-gray-100 dark:border-gray-800 h-fit"
      >
        <CategoryAccordion 
          categories={categories} 
          selectedCategory={selectedCategory}
          t={t}
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t("blog.sidebar.newsletter.title")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t("blog.sidebar.newsletter.description")}
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder={t("blog.sidebar.newsletter.placeholder")}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            />
            <button className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium text-sm transition-colors duration-300">
              {t("blog.sidebar.newsletter.button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
