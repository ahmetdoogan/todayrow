// src/hooks/useProfile.ts
import { useState } from 'react';

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  title: string;
  location: string;
  bio: string;
  website: string;
  linkedin: string;
}

export interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  title?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
}

export function useProfile() {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    title: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // (İsteğe bağlı) Basit validasyon örneği
  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    if (formData.first_name && formData.first_name.length > 50) {
      newErrors.first_name = 'İsim 50 karakteri aşamaz.';
    }
    // vs. diğer alanlar için...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    loading,
    setLoading,
    errors,
    validateForm,
  };
}
