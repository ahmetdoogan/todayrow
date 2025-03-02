"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { createSlug, makeUniqueSlug } from "@/utils/slugUtils";
import { X, Calendar, Tag, FileType, Layout } from "lucide-react";
import { toast } from "react-toastify";
import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import PlatformSelector from "../PlatformSelector";
import PreviewCard from "../PreviewCard";
import ContentEditor from "../ContentEditor";
import { PlatformType, ContentFormat, PLATFORM_FORMATS } from "@/types/content";
import { useTranslations } from 'next-intl';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: number; // Eğer update yapılacaksa, güncellenecek içeriğin id'si
}

interface MetaData {
  title: string;
  description: string;
  image: string;
  site_name: string;
}

const normalizeUrl = (url: string): string => {
  if (!url) return '';
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  return normalizedUrl;
};

// Yardımcı: Date input (yyyy-mm-dd) formatına çevirir
const toDateInputValue = (date: Date): string => {
  try {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (err) {
    console.error('Tarih formatına çevirirken hata:', err);
    // Bugünün tarihini varsayılan olarak döndür
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
};

// Yardımcı: Time input (HH:mm) formatına çevirir
const toTimeInputValue = (date: Date): string => {
  try {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch (err) {
    console.error('Saat formatına çevirirken hata:', err);
    // Şu anki saati varsayılan olarak döndür
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
};

const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  contentId,
}) => {
  const { handleAddContent, contents } = useContent();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [format, setFormat] = useState<ContentFormat>("TEXT");
  const [type, setType] = useState("GENERAL");
  const [timeFrame, setTimeFrame] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(["LINKEDIN"]);
  const [url, setUrl] = useState("");
  const [normalizedUrl, setNormalizedUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [urlInputTimer, setUrlInputTimer] = useState<NodeJS.Timeout | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [initialFormData, setInitialFormData] = useState({
    title: "",
    details: "",
    format: "TEXT",
    type: "GENERAL",
    timeFrame: "",
    tags: "",
    date: "",
    selectedPlatforms: ["LINKEDIN"],
    url: "",
    normalizedUrl: "",
    metadata: null as MetaData | null,
  });

  const t = useTranslations('common.contentModal');

  // Eğer güncelleme modunda isen, mevcut içeriğin verilerini form alanlarına yükleyelim.
 // Düzenleme modunda (contentId varsa) içeriği form alanlarına yükleyen useEffect:
useEffect(() => {
  if (isOpen && contentId) {
    const content = contents.find(c => c.id === contentId);
    if (content) {
      setTitle(content.title);
      setDetails(content.details);
      setFormat(content.format);
      setType(content.type);
      
      if (content.date) {
        try {
          // ISO tarih formatından (UTC) yerel tarihe çevirme
          const contentDate = new Date(content.date);
          console.log('Düzenlenen içeriğin tarihi (UTC):', content.date);
          console.log('Yerel tarihe çevrildi:', contentDate);
          
          // YYYY-MM-DD formatında tarih ayarla
          const dateValue = toDateInputValue(contentDate);
          console.log('Form için tarih değeri:', dateValue);
          setDate(dateValue);
          
          // İçerikte timeFrame alanı varsa onu kullan
          if (content.timeFrame && typeof content.timeFrame === 'string' && content.timeFrame.includes(':')) {
            console.log('Kaydedilmiş saat değeri (timeFrame):', content.timeFrame);
            setTimeFrame(content.timeFrame);
          } else {
            // HH:MM formatında saat ayarla - içerik tarihinden
            const timeValue = toTimeInputValue(contentDate);
            console.log('Form için hesaplanan saat değeri:', timeValue);
            setTimeFrame(timeValue);
          }
        } catch (err) {
          console.error('Tarih çevirme hatası:', err);
          // Hata durumunda bugünün tarihini kullan
          const today = new Date();
          setDate(toDateInputValue(today));
          setTimeFrame(toTimeInputValue(today));
        }
      } else {
        console.error('Content.date boş veya null!');
        // Null date durumunda bugünün tarihini göster
        const today = new Date();
        setDate(toDateInputValue(today));
        setTimeFrame(toTimeInputValue(today));
      }
      
      setTags(content.tags || "");
      setSelectedPlatforms(content.platforms || ["LINKEDIN"]);
      setUrl(content.url || "");
      setNormalizedUrl(content.url || "");
      setMetadata(
        content.preview_data
          ? {
              title: content.preview_data.title ?? "",
              description: content.preview_data.description ?? "",
              image: content.preview_data.image ?? "",
              site_name: content.preview_data.site_name ?? "",
            }
          : null
      );
    }
  }
}, [isOpen, contentId, contents]);


  // Modal açıldığında formdaki başlangıç değerlerini saklıyoruz.
  useEffect(() => {
    if (isOpen) {
      setInitialFormData({
        title,
        details,
        format,
        type,
        timeFrame,
        tags,
        date,
        selectedPlatforms,
        url,
        normalizedUrl,
        metadata,
      });
    }
  }, [isOpen]);

  const hasChanges = () => {
    return (
      title !== initialFormData.title ||
      details !== initialFormData.details ||
      format !== initialFormData.format ||
      type !== initialFormData.type ||
      timeFrame !== initialFormData.timeFrame ||
      tags !== initialFormData.tags ||
      date !== initialFormData.date ||
      JSON.stringify(selectedPlatforms) !== JSON.stringify(initialFormData.selectedPlatforms) ||
      url !== initialFormData.url ||
      normalizedUrl !== initialFormData.normalizedUrl ||
      metadata !== initialFormData.metadata
    );
  };

  const handleClose = () => {
    if (hasChanges()) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    onClose();
    toast.info(t('notifications.undoSuccess'));
  };

  const handleCancelClose = () => {
    setIsConfirmModalOpen(false);
  };

  const availableFormats = Array.from(new Set(
    selectedPlatforms.flatMap(platform => PLATFORM_FORMATS[platform])
  ));

  if (!isOpen) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (urlInputTimer) {
      clearTimeout(urlInputTimer);
    }

    if (!newUrl.trim()) {
      setMetadata(null);
      setNormalizedUrl("");
      return;
    }

    const timer = setTimeout(() => {
      const normalized = normalizeUrl(newUrl);
      setNormalizedUrl(normalized);
      fetchMetadata(normalized);
    }, 1000);

    setUrlInputTimer(timer);
  };

  const fetchMetadata = async (url: string) => {
    if (!url) return;
    try {
      setIsLoadingMetadata(true);
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      const data = await response.json();
      if (data.title || data.description) {
        setMetadata(data);
      } else {
        setMetadata(null);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setMetadata(null);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) {
    toast.error(t('errors.loginRequired'));
    return;
  }

  // Tarih ve saat işleme - iyileştirilmiş sürüm
  let parsedHours = 0;
  let parsedMinutes = 0;
  
  try {
    // Saat formatını güçlü bir şekilde işle
    if (timeFrame && timeFrame.includes(':')) {
      // Normal HH:MM formatı
      const [hoursStr, minutesStr] = timeFrame.split(':');
      parsedHours = parseInt(hoursStr) || 0;
      parsedMinutes = parseInt(minutesStr) || 0;
    } else if (timeFrame) {
      // Sadece saat girilmiş olabilir
      parsedHours = parseInt(timeFrame) || 12;
      parsedMinutes = 0;
    } else {
      // Varsayılan zaman 12:00
      parsedHours = 12;
      parsedMinutes = 0;
    }
    
    // Geçerli aralıkta olduğundan emin ol
    parsedHours = Math.max(0, Math.min(23, parsedHours));
    parsedMinutes = Math.max(0, Math.min(59, parsedMinutes));
    
    // YYYY-MM-DD formatını işle ve geçerliliğini kontrol et
    const [year, month, day] = date.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day) || 
        year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error('Geçersiz tarih değerleri');
    }
    
    // Yerel zaman olarak doğru şekilde Date nesnesi oluştur
    const localTimestamp = new Date(year, month - 1, day, parsedHours, parsedMinutes, 0, 0);
    
    // ISO string ile UTC formatına çevir
    const isoDate = localTimestamp.toISOString();
    
    // Saat bilgisini tutarlı formatta sakla
    const formattedTimeFrame = `${String(parsedHours).padStart(2, '0')}:${String(parsedMinutes).padStart(2, '0')}`;
    
    // Debug bilgileri
    console.log('Tarih/saat bilgileri:');
    console.log('Girilen Tarih:', date);
    console.log('Girilen Saat:', timeFrame);
    console.log('İşlenen Saat:', formattedTimeFrame);
    console.log('Yerel Tarih:', localTimestamp.toString());
    console.log('UTC Tarih:', isoDate);
  } catch (error) {
    // Hata durumunda şu anki tarihi kullan
    console.error('Tarih işleme hatası:', error);
    const now = new Date();
    const isoDate = now.toISOString();
    const formattedTimeFrame = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    toast.error(t('errors.dateFormatError'));
    
    // Devam et, ama geçerli tarihi kullan
  }

  // Benzersiz slug oluşturma
const baseSlug = createSlug(title);
const { data: existingSlugs } = await supabase
  .from("Content")
  .select('slug')
  .eq("user_id", user.id) // SADECE mevcut kullanıcının slug'larını çek
  .eq("is_deleted", false); // İsteğe bağlı: Silinmemiş içerikleri kontrol et

const slug = makeUniqueSlug(baseSlug, existingSlugs?.map(c => c.slug) || []);

const now = new Date().toISOString();

// Saat bilgisini standart formatına çevir
let formattedTimeFrame = `${String(parsedHours).padStart(2, '0')}:${String(parsedMinutes).padStart(2, '0')}`;

// Hazırlanan tarih ve zaman bilgilerini contentData'ya ekle
const contentData = {
  title,
  details,
  format,
  type,
  timeFrame: formattedTimeFrame, // Standart formatta saat bilgisi kaydediyoruz
  date: isoDate,  // ISO formatında UTC tarih/saat
  platforms: selectedPlatforms,
  url: normalizedUrl || null,
  preview_data: metadata || {},
  is_completed: false,
  user_id: user.id,
  slug,
  updated_at: now,
};

  if (contentId) {
    // UPDATE işlemi
    const { data, error } = await supabase
      .from("Content")
      .update(contentData)
      .eq("id", contentId)
      .select();

    if (error || !data || data.length === 0) {
      console.error("Güncelleme hatası:", error);
      toast.error(t('errors.updateError'));
      return;
    }

    // updateContent fonksiyonu kullanılmadığı için sadece handleAddContent ile state güncellemesi yapalım
    handleAddContent(data[0]);
    toast.success(t('notifications.updateSuccess'));
  } else {
    // INSERT işlemi: Yeni içerik ekleniyor.
    const insertData = {
      ...contentData,
      created_at: now,
    };

    const { data, error } = await supabase
      .from("Content")
      .insert(insertData)
      .select();

    if (error || !data || data.length === 0) {
      console.error("Ekleme hatası:", error);
      toast.error(t('errors.addError'));
      return;
    }
    handleAddContent(data[0]);
    toast.success(t('notifications.addSuccess'));
  }

  // Form alanlarını sıfırlıyoruz.
  setTitle("");
  setDetails("");
  setFormat("TEXT");
  setType("GENERAL");
  setTimeFrame("");
  setTags("");
  setDate("");
  setSelectedPlatforms(["LINKEDIN"]);
  setUrl("");
  setNormalizedUrl("");
  setMetadata(null);

  onClose();
};


  const handlePlatformToggle = (platform: PlatformType) => {
    setSelectedPlatforms(prev => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      const newAvailableFormats = Array.from(new Set(
        newPlatforms.flatMap(p => PLATFORM_FORMATS[p])
      ));
      if (!newAvailableFormats.includes(format)) {
        setFormat(newAvailableFormats[0]);
      }
      return newPlatforms.length > 0 ? newPlatforms : ["LINKEDIN"];
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t('addNewContent')}
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('platforms')}
                </label>
                <PlatformSelector
                  selectedPlatforms={selectedPlatforms}
                  onPlatformToggle={handlePlatformToggle}
                />
              </div>
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('title')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  placeholder={t('titlePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('urlOptional')}
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  placeholder={t('urlPlaceholder')}
                />
                {isLoadingMetadata && (
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {t('previewLoading')}
                  </div>
                )}
                {metadata && <PreviewCard metadata={metadata} />}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <FileType className="w-4 h-4" />
                    {t('type')}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    required
                  >
                    <option value="GENERAL">{t('types.GENERAL')}</option>
                    <option value="EXPERIENCE">{t('types.EXPERIENCE')}</option>
                    <option value="EDUCATION">{t('types.EDUCATION')}</option>
                    <option value="INSPIRATION">{t('types.INSPIRATION')}</option>
                    <option value="REVIEW_ANALYSIS">{t('types.REVIEW_ANALYSIS')}</option>
                    <option value="INDUSTRY">{t('types.INDUSTRY')}</option>
                    <option value="TECHNOLOGY">{t('types.TECHNOLOGY')}</option>
                    <option value="CAREER">{t('types.CAREER')}</option>
                    <option value="PERSONAL_DEVELOPMENT">{t('types.PERSONAL_DEVELOPMENT')}</option>
                    <option value="TRENDING">{t('types.TRENDING')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    {t('format')}
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ContentFormat)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    required
                  >
                    {availableFormats.map(f => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('date')}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                    {t('time')}
                  </label>
                  <input
                    type="time"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                    placeholder="HH:MM"
                    pattern="[0-9]{2}:[0-9]{2}"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t('tags')}
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-600 focus:border-transparent"
                  placeholder={t('tagsPlaceholder')}
                />
              </div>
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                  {t('description')}
                </label>
                <ContentEditor
                  value={details}
                  onChange={setDetails}
                  placeholder={t('descriptionPlaceholder')}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        message={t('confirmCloseMessage')}
      />
    </>
  );
};

export default ContentModal;
