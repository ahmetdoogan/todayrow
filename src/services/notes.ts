import { supabase } from '@/utils/supabaseClient';
import { createSlug, makeUniqueSlug } from '@/utils/slugUtils';
import type { Note } from '@/types/notes'; // Note tipini buradan import ediyoruz

export async function getNotes(): Promise<Note[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Note[];
}

export async function createNote(noteData: Partial<Note>): Promise<Note> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Eğer title varsa slug oluştur
  let uniqueSlug = null;
  if (noteData.title) {
    const slug = createSlug(noteData.title);
    
    // Mevcut slugları kontrol et
    const { data: existingNotes } = await supabase
      .from('Notes')
      .select('slug')
      .eq('user_id', user.id);
      
    const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
    uniqueSlug = makeUniqueSlug(slug, existingSlugs);
  }

  const { data, error } = await supabase
    .from('Notes')
    .insert([{ ...noteData, user_id: user.id, slug: uniqueSlug }])
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: number, noteData: Partial<Note>): Promise<Note> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let updateData = { ...noteData };
  
  // Eğer başlık değiştiyse yeni slug oluştur
  if (noteData.title) {
    const slug = createSlug(noteData.title);
    
    // Mevcut slugları kontrol et
    const { data: existingNotes } = await supabase
      .from('Notes')
      .select('slug')
      .eq('user_id', user.id)
      .neq('id', id);  // Kendisi hariç
      
    const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
    updateData.slug = makeUniqueSlug(slug, existingSlugs);
  }

  const { data, error } = await supabase
    .from('Notes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('Notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function toggleNotePin(id: number, isPinned: boolean): Promise<Note> {
  return updateNote(id, { is_pinned: !isPinned });
}

export async function getNoteBacklinks(noteTitle: string): Promise<Note[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // [[Title]] formatındaki referansları ara
  const pattern = `[[${noteTitle}]]`;
  
  const { data, error } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id)
    .ilike('content', `%${pattern}%`)
    .neq('title', noteTitle); // Kendisini hariç tut

  if (error) throw error;
  return data as Note[];
}

export async function migrateExistingNotesToSlug(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Tüm notları al
  const { data: notes, error: fetchError } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id);

  if (fetchError) throw fetchError;

  // Her bir not için slug oluştur ve güncelle
  for (const note of notes) {
    if (!note.slug) {
      const slug = createSlug(note.title);
      
      // Mevcut slugları kontrol et
      const { data: existingNotes } = await supabase
        .from('Notes')
        .select('slug')
        .eq('user_id', user.id)
        .neq('id', note.id);  // Kendisi hariç
        
      const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
      const uniqueSlug = makeUniqueSlug(slug, existingSlugs);

      // Notu güncelle
      const { error: updateError } = await supabase
        .from('Notes')
        .update({ slug: uniqueSlug })
        .eq('id', note.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    }
  }

  console.log('Mevcut notlar başarıyla slug ile güncellendi.');
}