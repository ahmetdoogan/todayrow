"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";

interface CategoryAccordionProps {
  categories: {
    key: string;
    label: string;
  }[];
  selectedCategory?: string;
  t: any; // Translation function
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ 
  categories, 
  selectedCategory,
  t 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const params = useParams();
  const locale = params?.locale as string || "en";

  return (
    <div className="mb-6">
      <button
        className="flex w-full justify-between items-center text-lg font-medium text-gray-900 dark:text-white mb-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{t("blog.sidebar.categories")}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/blog/${locale}/category/${category.key}`}
                  className={`block text-sm ${
                    category.key === selectedCategory ? 'font-medium' : ''
                  } text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors duration-300`}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryAccordion;
