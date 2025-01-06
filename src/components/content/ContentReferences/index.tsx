"use client";

import React from 'react';
import { useContent } from '@/context/ContentContext';
import { Content } from '@/types/content';
import { LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ContentReferencesProps {
  content: Content;
}

const ContentReferences: React.FC<ContentReferencesProps> = ({ content }) => {
  const { contents } = useContent();
  const t = useTranslations('common.content');

  // Referans verilen içerikleri bul
  const referencedContents = content.references_to?.map(ref => {
    return contents.find(c => c.id === ref.target_content_id);
  }).filter(Boolean) as Content[];

  // Bu içeriğe referans veren içerikleri bul
  const referencingContents = content.referenced_by?.map(ref => {
    return contents.find(c => c.id === ref.source_content_id);
  }).filter(Boolean) as Content[];

  if (!referencedContents?.length && !referencingContents?.length) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      {referencedContents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            {t('references.referencedContents')}
          </h3>
          <div className="space-y-2">
            {referencedContents.map(refContent => (
              <div
                key={refContent.id}
                className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
              >
                <div className="font-medium text-slate-900 dark:text-white">
                  {refContent.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1">
                  {refContent.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {referencingContents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            {t('references.referencingContents')}
          </h3>
          <div className="space-y-2">
            {referencingContents.map(refContent => (
              <div
                key={refContent.id}
                className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
              >
                <div className="font-medium text-slate-900 dark:text-white">
                  {refContent.title}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1">
                  {refContent.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentReferences;