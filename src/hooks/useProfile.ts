import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileFormData } from '@/types/profile';

interface ValidationErrors {
  title?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string; // Yeni eklendi
}

export function useProfile() {
  const { session, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Başlangıç state'ine linkedin eklendi
  const [formData, setFormData] = useState<ProfileFormData>({
    title: session?.user?.user_metadata?.profile?.title || '',
    location: session?.user?.user_metadata?.profile?.location || '',
    bio: session?.user?.user_metadata?.profile?.bio || '',
    website: session?.user?.user_metadata?.profile?.website || '',
    linkedin: session?.user?.user_metadata?.profile?.linkedin || ''
  });

  // Session değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (session?.user?.user_metadata?.profile) {
      const { profile } = session.user.user_metadata;
      setFormData({
        title: profile.title || '',
        location: profile.location || '',
        bio: profile.bio || '',
        website: profile.website || '',
        linkedin: profile.linkedin || ''
      });
    }
  }, [session]);

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (formData.title && formData.title.length > 50) {
      newErrors.title = 'Unvan 50 karakterden uzun olamaz';
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Konum 100 karakterden uzun olamaz';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio 500 karakterden uzun olamaz';
    }

    if (formData.website && !formData.website.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
      newErrors.website = 'Geçerli bir website adresi giriniz';
    }

    // LinkedIn validasyonu eklendi
    if (formData.linkedin && !formData.linkedin.match(/^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/in\/[\w-]+\/?$/)) {
      newErrors.linkedin = 'Geçerli bir LinkedIn profil linki giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateForm()) return { success: false, error: 'Validation failed' };
    
    try {
      setLoading(true);
      
      if (!session?.user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const currentMetadata = session.user.user_metadata || {};

      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...currentMetadata,
          profile: {
            ...(currentMetadata.profile || {}),
            title: formData.title,
            location: formData.location,
            website: formData.website,
            bio: formData.bio,
            linkedin: formData.linkedin, // LinkedIn bilgisi eklendi
            updated_at: new Date().toISOString()
          }
        }
      });

      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    errors,
    saveProfile
  };
}