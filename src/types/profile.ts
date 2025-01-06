export type SubscriptionStatus = 'trial' | 'premium' | 'expired';

export interface ProfileMetadata {
  // Google Auth'dan gelen alanlar
  name?: string;
  email?: string;
  avatar_url?: string;
  picture?: string;
  email_verified?: boolean;
  provider_id?: string;
  
  // Bizim eklediğimiz profil alanları
  profile?: {
    title?: string;
    location?: string;
    bio?: string;
    website?: string;
    linkedin?: string; // Yeni eklendi
  };
  
  // Subscription bilgileri
  subscription?: {
    status: SubscriptionStatus;
    trial_ends_at?: string;
    subscription_ends_at?: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  user_metadata: ProfileMetadata;
  created_at: string;
  updated_at: string;
}

export type ProfileFormData = {
  title: string;
  location: string;
  bio: string;
  website: string;
  linkedin: string; // Yeni eklendi
};