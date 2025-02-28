"use client";

import { useState, useEffect } from 'react';
import { getFeatureRequests, voteFeature, getUserVotes, type FeatureRequest } from '@/services/featureRequests';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { toast } from 'react-toastify';
import SettingsHeader from '@/components/layout/Header/components/SettingsHeader';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function FeatureRequestsPage() {
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [userVotes, setUserVotes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('common');
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuresData, votesData] = await Promise.all([
          getFeatureRequests(),
          getUserVotes()
        ]);
        setFeatures(featuresData);
        setUserVotes(votesData);
      } catch (error) {
        console.error('Error loading feature requests:', error);
        toast.error(t('featureRequests.errors.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleVote = async (featureId: number) => {
    try {
      // Oy verme işlemi - güncel oy sayısını döndürüyor
      const updatedVoteCount = await voteFeature(featureId);
      
      // Eğer güncel oy sayısı döndüyse feature'ları güncelle
      if (updatedVoteCount !== undefined) {
        // Mevcut feature listesini klonla
        const updatedFeatures = [...features];
        // Güncellenecek feature'ı bul ve oy sayısını güncelle
        const featureIndex = updatedFeatures.findIndex(f => f.id === featureId);
        if (featureIndex !== -1) {
          updatedFeatures[featureIndex] = {
            ...updatedFeatures[featureIndex],
            votes: updatedVoteCount
          };
        }
        
        // Oy sayısına göre yeniden sırala
        updatedFeatures.sort((a, b) => b.votes - a.votes);
        setFeatures(updatedFeatures);
      }
      
      // Kullanıcının oy verdiği feature'ları güncelle
      const newUserVotes = await getUserVotes();
      setUserVotes(newUserVotes);
      
      toast.success(t('featureRequests.voteSuccess'));
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(t('featureRequests.errors.voteError'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <>
      <SettingsHeader 
        darkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
      />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('featureRequests.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('featureRequests.description')}
          </p>
        </div>

        {features.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {t('featureRequests.empty')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleVote(feature.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors
                      ${userVotes.includes(feature.id)
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <ArrowUp 
                      className={userVotes.includes(feature.id) ? 'fill-current' : ''} 
                      size={18} 
                    />
                    <span className="text-sm font-medium">{feature.votes}</span>
                  </button>
                  
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      {feature[`title_${language}`]}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature[`description_${language}`]}
                    </p>
                    <div className="mt-2">
                      <span className={`
                        inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                        ${feature.status === 'planned' 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10'
                          : feature.status === 'in_progress'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 ring-1 ring-inset ring-yellow-700/10'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-700/10'
                        }
                      `}>
                        {t(`featureRequests.status.${feature.status}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}