import { SupabaseClient } from '@supabase/supabase-js';
import { ProfileMetadata, ProfileFormData } from '@/types/profile';

export async function updateUserMetadata(
  supabase: SupabaseClient,
  metadata: Partial<ProfileMetadata>
) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...userData.user.user_metadata,
        ...metadata,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { data: null, error };
  }
}

export async function updateProfileData(
  supabase: SupabaseClient,
  profileData: ProfileFormData
) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...userData.user.user_metadata,
        profile: profileData,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}

export async function startTrialPeriod(
  supabase: SupabaseClient
) {
  try {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 günlük trial

    const { data, error } = await updateUserMetadata(supabase, {
      subscription: {
        status: 'trial',
        trial_ends_at: trialEndDate.toISOString(),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error starting trial:', error);
    return { data: null, error };
  }
}