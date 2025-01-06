"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TagOrFolder } from '@/services/tags';
import { useTranslations } from 'next-intl'; // useTranslations hook'unu ekledik

interface FilterSectionProps {
  titleKey: string; // title yerine titleKey kullanıyoruz
  icon: React.ReactNode;
  items: TagOrFolder[];
  selectedItems: string[];
  onItemSelect: (item: string) => void;
  expanded?: boolean;
}

export function FilterSection({
  titleKey, // title yerine titleKey kullanıyoruz
  icon,
  items,
  selectedItems,
  onItemSelect,
  expanded = false
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const t = useTranslations("filterSection"); // Çevirileri yükledik

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{t(titleKey)}</span> {/* titleKey'i çeviri anahtarı olarak kullanıyoruz */}
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`space-y-1 transition-all duration-200 ${isExpanded ? 'block' : 'block'}`}>
        {visibleItems.map(item => (
          <button
            key={item.name}
            onClick={() => onItemSelect(item.name)}
            className={`
              w-full px-3 py-1.5 rounded-lg text-sm flex items-center justify-between
              transition-colors duration-200
              ${selectedItems.includes(item.name)
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="truncate">{item.name}</span>
            <span className="text-xs opacity-75 ml-2">({item.count})</span>
          </button>
        ))}

        {!isExpanded && items.length > 3 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full px-3 py-1.5 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left"
          >
            {t("showMore", { count: items.length - 3 })} {/* Çeviri anahtarı */}
          </button>
        )}
      </div>
    </div>
  );
}