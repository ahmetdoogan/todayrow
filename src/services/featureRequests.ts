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
  console.log('getFeatureRequests çağrıldı, ay:', currentMonth);

  const { data, error } = await supabase
    .from('feature_requests')
    .select('*')
    .eq('month_tag', currentMonth)
    .order('votes', { ascending: false });

  if (error) {
    console.error('Feature requests çekme hatası:', error);
    throw error;
  }
  
  console.log('Feature requests çekildi:', data);
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

  console.log('Mevcut oy durumu:', existingVote ? 'Bu feature için oy verilmiş' : 'Oy verilmemiş');

  if (existingVote) {
    // Oyu geri çekmek için DELETE
    console.log('Oy silme işlemi başlıyor...');
    const { error: deleteError, data: deleteData } = await supabase
      .from('user_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('feature_id', featureId)
      .select();

    if (deleteError) {
      console.error('Oy silme hatası:', deleteError);
      throw deleteError;
    }
    
    console.log('Oy başarıyla silindi:', deleteData);
    
  } else {
    // Oy vermek için INSERT
    console.log('Oy ekleme işlemi başlıyor...');
    const { error: insertError, data: insertData } = await supabase
      .from('user_votes')
      .insert({ user_id: user.id, feature_id: featureId })
      .select();

    if (insertError) {
      console.error('Oy ekleme hatası:', insertError);
      throw insertError;
    }
    
    console.log('Oy başarıyla eklendi:', insertData);
  }
  
  // RLS ve trigger'ın çalışması için kısa bir bekleme ekleyelim
  await new Promise(resolve => setTimeout(resolve, 200));
}

// 3) Kullanıcının hangi feature’lara oy verdiğini bul
export async function getUserVotes() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  console.log('getUserVotes çağrıldı, kullanıcı id:', user.id);

  const { data, error } = await supabase
    .from('user_votes')
    .select('feature_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('Kullanıcı oyları çekme hatası:', error);
    throw error;
  }
  
  // Örn. [ { feature_id: 2 }, { feature_id: 5 } ] => [2, 5]
  const votes = data?.map(v => v.feature_id) || [];
  console.log('Kullanıcı oyları çekildi:', votes);
  return votes;
}
