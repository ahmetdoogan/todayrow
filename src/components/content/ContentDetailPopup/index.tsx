"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Pencil, Trash2, Clock, Check, ArrowLeft, Calendar, Tag, Link, Globe, FileType, Layout, X } from "lucide-react";
import { useContent } from '@/context/ContentContext';
import { Content, ContentType, ContentFormat, PlatformType } from '@/types/content';
import ContentReferences from '../ContentReferences';
import ContentEditor from '../ContentEditor';
import PlatformSelector from '../PlatformSelector';
import PreviewCard, { PreviewMetadata } from '../PreviewCard';
import { toast } from 'react-toastify';
import PlatformIcons from '@/components/common/PlatformIcons';
import ConfirmModal from '@/components/modals/ConfirmModal';

const WIKI_LINK_REGEX = /\[\[(.+?)\]\]/g;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedContent: Content | null;
  onContentUpdated?: () => void;
}

// Tarih formatını date input (yyyy-mm-dd) formatına çevirir
const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (err) {
    console.error('Tarih input formatına çevirilirken hata:', err);
    return '';
  }
};

const ContentDetailPopup: React.FC<Props> = ({ isOpen, onClose, selectedContent: initialContent, onContentUpdated }) => {
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
  const [editData, setEditData] = useState<Content | null>(selectedContent);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // İçerikte değişiklik var mı kontrol et
  const hasChanges = () => {
    if (!editData || !selectedContent) return false;
    
    // İçeriğin farklı alanlarını karşılaştır
    if (editData.title !== selectedContent.title) return true;
    if (editData.details !== selectedContent.details) return true;
    if (editData.type !== selectedContent.type) return true;
    if (editData.format !== selectedContent.format) return true;
    if (editData.timeFrame !== selectedContent.timeFrame) return true;
    if (editData.tags !== selectedContent.tags) return true;
    if (editData.url !== selectedContent.url) return true;
    
    // Platformları karşılaştır
    if (JSON.stringify(editData.platforms) !== JSON.stringify(selectedContent.platforms)) return true;
    
    // Değişiklik yok
    return false;
  };
  
  // Düzenleme moduna geçildiğinde, orijinal içerikten kopyalanmış bir kopya oluştur
  const startEditing = () => {
    try {
      if (!selectedContent) return;
      
      // İçerik bilgilerini kopyala ve id'nin mutlaka olmasını sağla
      const copiedContent = { 
        ...selectedContent,
        id: selectedContent.id // id'nin Content tipine uygun olmasını sağla
      };
      
      // Tarih ve saati düzgün formatta ayarla
      console.log('Düzenlemeye başlarken tarih/saat:', copiedContent.date, copiedContent.timeFrame);
      
      // EditData state'ini güncelle
      setEditData(copiedContent);
      
      // Düzenleme modunu aç
      setIsEditing(true);
    } catch (err) {
      console.error('Düzenleme başlatılırken hata:', err);
    }
  };

  if (!selectedContent) return null;

  const processContent = (content: string) => {
    const parts: (string | JSX.Element)[] = [];
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
    if (!editData || !selectedContent) return;

    try {
      console.log('Güncellenecek tarih/saat bilgileri:', editData.date, editData.timeFrame);
      
      // Tarih ve saat düzenlemelerini işle
      let updatedDate = editData.date;
      let updatedTimeFrame = editData.timeFrame;
      
      try {
        // Tarih formatını kontrol et ve işle
        if (typeof editData.date === 'string') {
          let localDate;
          
          if (editData.date.includes('-')) {
            // "YYYY-MM-DD" formatındaki metni işle
            const [year, month, day] = editData.date.split('-').map(Number);
            
            // Saat bilgisini kontrol et ve işle
            let hours = 0;
            let minutes = 0;
            
            if (editData.timeFrame && typeof editData.timeFrame === 'string') {
              if (editData.timeFrame.includes(':')) {
                const [hoursStr, minutesStr] = editData.timeFrame.split(':');
                hours = parseInt(hoursStr) || 0;
                minutes = parseInt(minutesStr) || 0;
              } else {
                // Saat bilgisi yoksa veya geçersizse 12:00 olarak ayarla
                hours = parseInt(editData.timeFrame) || 12;
                minutes = 0;
              }
            }
            
            // Geçerli değer aralığını zorla
            hours = Math.max(0, Math.min(23, hours));
            minutes = Math.max(0, Math.min(59, minutes));
            
            // Geçerli bir tarih oluştur
            if (isNaN(year) || isNaN(month) || isNaN(day) || 
                year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
              throw new Error('Geçersiz tarih değerleri');
            }
            
            // Yerel zamanı oluştur
            localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
            
            // Formatlı saat güncelleme
            updatedTimeFrame = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          } else {
            // Eğer tarih input formatında değilse, orijinal tarihi kullan
            localDate = new Date(editData.date);
          }
          
          // Tarih geçerli mi kontrol et
          if (isNaN(localDate.getTime())) {
            throw new Error('Geçersiz tarih');
          }
          
          // Güvenli ve geçerli bir ISO string oluştur
          updatedDate = localDate.toISOString();
          console.log('Oluşturulan ISO tarih:', updatedDate);
        }
      } catch (dateError) {
        console.error('Tarih işleme hatası:', dateError);
        // Tarih hatası olsa bile içeriğin orijinal tarihini korumaya çalış
        updatedDate = selectedContent.date;
        updatedTimeFrame = selectedContent.timeFrame;
        toast.error(t('messages.dateError'));
      }

      const updateData = {
        title: editData.title,
        details: editData.details,
        type: editData.type as ContentType,
        format: editData.format as ContentFormat,
        timeFrame: updatedTimeFrame,
        date: updatedDate, // Güncellenmiş tarih
        tags: editData.tags,
        platforms: editData.platforms,
        url: editData.url,
        preview_data: editData.preview_data,
        is_completed: editData.is_completed,
        is_deleted: editData.is_deleted
      };

      console.log('Gönderilecek güncellenmiş veri:', updateData);

      const updated = await handleUpdate(selectedContent.id, updateData);
      if (updated) {
        setSelectedContent(updated);
        setIsEditing(false);
        onContentUpdated?.();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('messages.updateError'));
    }
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    if (!editData) return;
    
    setEditData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        platforms: prev.platforms.includes(platform)
          ? prev.platforms.filter(p => p !== platform)
          : [...prev.platforms, platform]
      };
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm"
        style={{ zIndex: 50 + modalStack.length }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (isEditing && hasChanges()) {
            setIsConfirmModalOpen(true);
          } else {
            if (modalStack.length > 0) {
              popFromModalStack();
            } else {
              clearModalStack();
            }
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                    selectedPlatforms={editData?.platforms || []}
                    onPlatformToggle={handlePlatformToggle}
                  />
                </div>

                  <input
                    type="text"
                    value={editData?.title || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditData(prev => prev ? { ...prev, title: e.target.value } : prev)
                    }
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    placeholder={t('fields.title.placeholder')}
                  />

                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                    {t('fields.url.label')}
                  </label>
                  <input
                    type="text"
                    value={editData?.url || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditData(prev => prev ? { ...prev, url: e.target.value } : prev)
                    }
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    placeholder={t('fields.url.placeholder')}
                  />
                  {editData?.preview_data && Object.keys(editData.preview_data).length > 0 && (
                    <PreviewCard metadata={editData.preview_data as PreviewMetadata} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                      <FileType className="w-4 h-4" />
                      {t('fields.type.label')}
                    </label>
                    <select
                      value={editData?.type || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setEditData(prev => prev ? { ...prev, type: e.target.value as ContentType } : prev)
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    >
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
                      value={editData?.format || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setEditData(prev => prev ? { ...prev, format: e.target.value as ContentFormat } : prev)
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    >
                      <option value="TEXT">{t('fields.format.options.TEXT')}</option>
                      <option value="VIDEO">{t('fields.format.options.VIDEO')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('fields.date')}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={editData?.date ? formatDateForInput(editData.date) : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditData(prev => prev ? { ...prev, date: e.target.value } : prev)
                        }
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                      {t('fields.time.label')}
                    </label>
                    <input
                      type="time"
                      value={editData?.timeFrame || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditData(prev => prev ? { ...prev, timeFrame: e.target.value } : prev)
                      }
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                      placeholder="HH:MM"
                      pattern="[0-9]{2}:[0-9]{2}"
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
                    value={editData?.tags || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setEditData(prev => prev ? { ...prev, tags: e.target.value } : prev)
                    }
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    placeholder={t('fields.tags.placeholder')}
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                    {t('fields.description.label')}
                  </label>
                  <ContentEditor
                    value={editData?.details || ''}
                    onChange={(value) => 
                      setEditData(prev => prev ? { ...prev, details: value } : prev)
                    }
                    placeholder={t('fields.description.placeholder')}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsConfirmModalOpen(true)}
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
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedContent.is_completed 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {selectedContent.is_completed ? t('status.completed') : t('status.active')}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEditing && hasChanges()) {
                          setIsConfirmModalOpen(true);
                        } else {
                          if (modalStack.length > 0) {
                            popFromModalStack();
                          } else {
                            clearModalStack();
                          }
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

                {/* Platform bilgilerini metin yerine ikonlarla gösteriyoruz */}
                <div className="flex items-center gap-2">
                  <PlatformIcons platforms={selectedContent.platforms} showAll={true} />
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  {processContent(selectedContent.details)}
                </div>

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
                    onClick={() => startEditing()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>{t('buttons.edit')}</span>
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
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
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          setIsEditing(false);
        }}
        message={t('messages.confirmCloseMessage')}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedContent) {
            handleDelete(selectedContent.id);
            setIsDeleteModalOpen(false);
          }
        }}
        message={t('messages.deleteConfirmation')}
      />
    </>
  );
};

export default ContentDetailPopup;
