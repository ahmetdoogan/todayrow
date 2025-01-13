import { sendEvent, EventCategories } from './ga-manager';

// Kullanıcı segmentlerini tanımla
export const UserSegments = {
  FREE: 'free',
  TRIAL: 'trial',
  PREMIUM: 'premium',
  CHURNED: 'churned'
} as const;

// Özellik kullanımını izle
export const trackFeatureUsage = (userId: string, feature: 'planner' | 'notes' | 'content', action: string) => {
  sendEvent({
    action: 'feature_use',
    category: EventCategories.FEATURE,
    user_id: userId,
    feature_name: feature,
    action_type: action,
    timestamp: Date.now()
  });
};

// Kullanıcı durumunu izle
export const trackUserStatus = (userId: string, segment: keyof typeof UserSegments) => {
  sendEvent({
    action: 'user_segment_change',
    category: EventCategories.USER,
    user_id: userId,
    segment,
    timestamp: Date.now()
  });
};

// Kullanıcı aktivitesini izle
export const trackUserActivity = (userId: string, lastActive: Date) => {
  const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceActive >= 7) {
    sendEvent({
      action: 'user_inactive',
      category: EventCategories.USER,
      user_id: userId,
      days_inactive: daysSinceActive,
      risk_level: daysSinceActive > 14 ? 'high' : 'medium'
    });
  }
};

// Özellik kullanım oranlarını hesapla
export const calculateFeatureAdoption = (totalUsers: number, featureUsers: number) => {
  const adoptionRate = (featureUsers / totalUsers) * 100;
  
  sendEvent({
    action: 'feature_adoption',
    category: EventCategories.FEATURE,
    value: adoptionRate,
    total_users: totalUsers,
    feature_users: featureUsers
  });
};