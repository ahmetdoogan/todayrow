"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Pencil, Trash2, Clock, Check, ArrowLeft, Calendar, Tag, Link, Globe, FileType, Layout, X } from "lucide-react";
import { useContent } from '@/context/ContentContext';
import ContentReferences from '../ContentReferences';
import ContentEditor from '../ContentEditor';
import PlatformSelector from '../PlatformSelector';
import PreviewCard from '../PreviewCard';
import { toast } from 'react-toastify';

const WIKI_LINK_REGEX = /\[\[(.+?)\]\]/g;

const ContentDetailPopup: React.FC = () => {
  const t = useTranslations('common.content.detail');
  const {
    selectedContent,
    setSelectedContent,
    handleDelete,
    handleUpdate,
    handleMarkAsCompleted,
    handleMarkAsIncomplete,
    formatDate,
    findContentByTitle,
    pushToModalStack,
    modalStack,
    popFromModalStack,
    clearModalStack
  } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedContent);

  if (!selectedContent) return null;

  const processContent = (content: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const title = match[1];
      const referencedContent = findContentByTitle(title);

      parts.push(
        referencedContent ? (
          <button
            key={match.index}
            onClick={() => {
              if (referencedContent) {
                pushToModalStack(referencedContent);
              }
            }}
            className="font-bold hover:underline text-gray-900 dark:text-white"
          >
            {title}
          </button>
        ) : (
          <span key={match.index} className="text-gray-400">
            {title}
          </span>
        )
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  const handleUpdateContent = async () => {
    try {
      const updated = await handleUpdate(selectedContent.id, editData);
      if (updated) {
        setSelectedContent(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('messages.updateError'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm"
      style={{ zIndex: 50 + modalStack.length }}
      onClick={() => {
        if (modalStack.length > 0) {
          popFromModalStack();
        } else {
          clearModalStack();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('editTitle')}
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('fields.platforms')}
                </label>
                <PlatformSelector 
                  selectedPlatforms={editData.platforms}
                  onPlatformToggle={(platform) => {
                    setEditData(prev => ({
                      ...prev,
                      platforms: prev.platforms.includes(platform) 
                        ? prev.platforms.filter(p => p !== platform)
                        : [...prev.platforms, platform]
                    }));
                  }}
                />
              </div>

              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                placeholder={t('fields.title.placeholder')}
              />

              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('fields.url.label')}
                </label>
                <input
                  type="text"
                  value={editData.url || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  placeholder={t('fields.url.placeholder')}
                />
                {editData.preview_data && Object.keys(editData.preview_data).length > 0 && (
                  <PreviewCard metadata={editData.preview_data} />
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <FileType className="w-4 h-4" />
                    {t('fields.type.label')}
                  </label>
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  >
                    {/* Yeni tür seçenekleri */}
                    <option value="GENERAL">{t('fields.type.options.GENERAL')}</option>
                    <option value="EXPERIENCE">{t('fields.type.options.EXPERIENCE')}</option>
                    <option value="EDUCATION">{t('fields.type.options.EDUCATION')}</option>
                    <option value="INSPIRATION">{t('fields.type.options.INSPIRATION')}</option>
                    <option value="REVIEW_ANALYSIS">{t('fields.type.options.REVIEW_ANALYSIS')}</option>
                    <option value="INDUSTRY">{t('fields.type.options.INDUSTRY')}</option>
                    <option value="TECHNOLOGY">{t('fields.type.options.TECHNOLOGY')}</option>
                    <option value="CAREER">{t('fields.type.options.CAREER')}</option>
                    <option value="PERSONAL_DEVELOPMENT">{t('fields.type.options.PERSONAL_DEVELOPMENT')}</option>
                    <option value="TRENDING">{t('fields.type.options.TRENDING')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    {t('fields.format.label')}
                  </label>
                  <select
                    value={editData.format}
                    onChange={(e) => setEditData(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  >
                    {/* Yeni format seçenekleri */}
                    <option value="TEXT">{t('fields.format.options.TEXT')}</option>
                    <option value="VIDEO">{t('fields.format.options.VIDEO')}</option>
                    <option value="PODCAST">{t('fields.format.options.PODCAST')}</option>
                    <option value="CAROUSEL">{t('fields.format.options.CAROUSEL')}</option>
                    <option value="REELS_SHORTS">{t('fields.format.options.REELS_SHORTS')}</option>
                    <option value="STORIES">{t('fields.format.options.STORIES')}</option>
                    <option value="POLL">{t('fields.format.options.POLL')}</option>
                    <option value="LIVE">{t('fields.format.options.LIVE')}</option>
                    <option value="INFOGRAPHIC">{t('fields.format.options.INFOGRAPHIC')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('fields.date')}
                  </label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                    {t('fields.time.label')}
                  </label>
                  <input
                    type="text"
                    value={editData.timeFrame}
                    onChange={(e) => setEditData(prev => ({ ...prev, timeFrame: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    placeholder={t('fields.time.placeholder')}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t('fields.tags.label')}
                </label>
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  placeholder={t('fields.tags.placeholder')}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('fields.description.label')}
                </label>
                <ContentEditor
                  value={editData.details}
                  onChange={(value) => setEditData(prev => ({ ...prev, details: value }))}
                  placeholder={t('fields.description.placeholder')}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  onClick={handleUpdateContent}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {t('buttons.update')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('title')}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`
                    px-3 py-1 rounded-full text-sm
                    ${selectedContent.is_completed 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }
                  `}>
                    {selectedContent.is_completed ? t('status.completed') : t('status.active')}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (modalStack.length > 0) {
                        popFromModalStack();
                      } else {
                        clearModalStack();
                      }
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {selectedContent.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedContent.platforms.map((platform) => (
                  <span 
                    key={platform}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>

              {selectedContent.url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={selectedContent.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {selectedContent.url}
                    </a>
                  </div>
                  {selectedContent.preview_data && Object.keys(selectedContent.preview_data).length > 0 && (
                    <PreviewCard metadata={selectedContent.preview_data} />
                  )}
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                {processContent(selectedContent.details)}
              </div>

              {/* Type & Format rozeti */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm">
                  {t(`fields.type.options.${selectedContent.type}`)}
                </span>
                <span className="px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-xl text-sm">
                  {t(`fields.format.options.${selectedContent.format}`)}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedContent.date)}</span>
                </div>
                {selectedContent.timeFrame && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedContent.timeFrame}</span>
                  </div>
                )}
                {selectedContent.tags && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{selectedContent.tags}</span>
                  </div>
                )}
              </div>

              <ContentReferences content={selectedContent} />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1"
                >
                  <Pencil className="w-4 h-4" />
                  <span>{t('buttons.edit')}</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedContent.id)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('buttons.delete')}</span>
                </button>
                {!selectedContent.is_completed ? (
                  <button
                    onClick={() => handleMarkAsCompleted(selectedContent.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('buttons.complete')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkAsIncomplete(selectedContent.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('buttons.undo')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContentDetailPopup;
