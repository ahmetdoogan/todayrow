"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

// PreviewMetadata tipini tanımlayın ve export edin
export interface PreviewMetadata {
  title?: string;
  description?: string;
  image?: string;
  site_name?: string;
}

interface PreviewCardProps {
  metadata: PreviewMetadata; // metadata prop'unun tipini PreviewMetadata olarak güncelleyin
}

const PreviewCard: React.FC<PreviewCardProps> = ({ metadata }) => {
  const t = useTranslations('common.content');

  if (!metadata.title && !metadata.description) return null;

  return (
    <div className="mt-3 border dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
      {metadata.image && (
        <div className="relative w-full h-40">
          <Image
            src={metadata.image}
            alt={metadata.title || t('preview.imageAlt')}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-4">
        {metadata.site_name && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {metadata.site_name}
          </div>
        )}
        {metadata.title && (
          <h3 className="text-base font-medium text-slate-900 dark:text-white mb-2">
            {metadata.title}
          </h3>
        )}
        {metadata.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
            {metadata.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewCard;