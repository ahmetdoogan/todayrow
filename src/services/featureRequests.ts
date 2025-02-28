import { supabase } from '@/utils/supabaseClient';

export interface FeatureRequest {
  id: number;
  title_en: string;
  title_tr: string;
  description_en: string;
  description_tr: string;
  status: string;
  votes: number;
  created_at: string;
}

// 1) Özellik taleplerini çek
export async function getFeatureRequests() {
  // "2025-02" gibi
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data, error } = await supabase
    .from('feature_requests')
    .select('*')
    .eq('month_tag', currentMonth)       // <-- YENİ!
    .order('votes', { ascending: false });

  if (error) throw error;
  return data;
}


// 2) Kullanıcı oy veriyor veya oyu geri çekiyor
export async function voteFeature(featureId: number) {
  // Kullanıcı oturumda mı kontrol edelim
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  // Mevcut oyu çek
  const { data: existingVote, error: selectError } = await supabase
    .from('user_votes')
    .select()
    .eq('user_id', user.id)
    .eq('feature_id', featureId)
    .single();

  if (selectError) {
    // selectError code === 'PGRST116' => row not found, sorun değil
    // Onun haricinde bir hata varsa loglayabiliriz
    if (selectError.code !== 'PGRST116') {
      console.error('Vote check error:', selectError);
    }
  }

  try {
    if (existingVote) {
      // Oyu geri çekmek için DELETE
      const { error: deleteError } = await supabase
        .from('user_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('feature_id', featureId);

      if (deleteError) throw deleteError;
    } else {
      // Oy vermek için INSERT
      const { error: insertError } = await supabase
        .from('user_votes')
        .insert({ user_id: user.id, feature_id: featureId });

      if (insertError) throw insertError;
    }
    
    // Kısa bir bekleme ekleyelim ki trigger çalışsın ve votlar güncellensin
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Güncel veriyi direkt olarak feature_requests tablosundan çekelim
    const { data: updatedFeature, error: featureError } = await supabase
      .from('feature_requests')
      .select('votes')
      .eq('id', featureId)
      .single();
      
    if (featureError) {
      console.error('Error fetching updated votes:', featureError);
    }
    
    // Güncel vote sayısını döndür
    return updatedFeature?.votes;
    
  } catch (error) {
    console.error('Vote operation error:', error);
    throw error;
  }
}

// 3) Kullanıcının hangi feature’lara oy verdiğini bul
export async function getUserVotes() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_votes')
    .select('feature_id')
    .eq('user_id', user.id);

  if (error) throw error;
  // Örn. [ { feature_id: 2 }, { feature_id: 5 } ] => [2, 5]
  return data?.map(v => v.feature_id) || [];
}
