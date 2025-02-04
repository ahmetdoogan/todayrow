import { supabase } from '@/utils/supabaseClient';
import { createSlug, makeUniqueSlug } from '@/utils/slugUtils';
import type { Note } from '@/types/notes';

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

  // Aynı kullanıcıya ait mevcut notları kontrol et (kullanıcı filtresi eklendi)
  const { data: existingNotes } = await supabase
    .from('Notes')
    .select('title, slug')
    .eq('user_id', user.id);
  
  let uniqueSlug = null;
  let uniqueTitle = noteData.title;
  
  // Eğer aynı başlık varsa, başlığı değiştir (title-1, title-2 gibi)
  if (existingNotes?.some(n => n.title === noteData.title)) {
    let counter = 1;
    while (existingNotes.some(n => n.title === `${noteData.title}-${counter}`)) {
      counter++;
    }
    uniqueTitle = `${noteData.title}-${counter}`;
  }
  
  // Benzersiz slug oluştur
  if (uniqueTitle) {
    const slug = createSlug(uniqueTitle);
    const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
    uniqueSlug = makeUniqueSlug(slug, existingSlugs);
  }

  const insertData = { 
    ...noteData, 
    title: uniqueTitle,
    slug: uniqueSlug, 
    user_id: user.id 
  };

  const { data, error } = await supabase
    .from('Notes')
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: number, noteData: Partial<Note>): Promise<Note> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let updateData = { ...noteData };
  
  if (noteData.title) {
    const slug = createSlug(noteData.title);
    // Sadece ilgili kullanıcıya ait notları kontrol et (kullanıcı filtresi eklendi)
    const { data: existingNotes } = await supabase
      .from('Notes')
      .select('slug')
      .eq('user_id', user.id);
      
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

  const pattern = `[[${noteTitle}]]`;
  
  const { data, error } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id)
    .ilike('content', `%${pattern}%`)
    .neq('title', noteTitle);

  if (error) throw error;
  return data as Note[];
}

export async function migrateExistingNotesToSlug(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: notes, error: fetchError } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id);

  if (fetchError) throw fetchError;

  for (const note of notes) {
    if (!note.slug) {
      const slug = createSlug(note.title);
      // Kullanıcıya özel mevcut slug'ları al (kullanıcı filtresi eklendi)
      const { data: existingNotes } = await supabase
        .from('Notes')
        .select('slug')
        .eq('user_id', user.id);
        
      const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
      const uniqueSlug = makeUniqueSlug(slug, existingSlugs);

      const { error: updateError } = await supabase
        .from('Notes')
        .update({ slug: uniqueSlug })
        .eq('id', note.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    }
  }
}
