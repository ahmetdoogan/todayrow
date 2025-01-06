import { supabase } from '../utils/supabaseClient';
import { createSlug, makeUniqueSlug } from '../utils/slugUtils';

export interface Note {
  id: number;
  title: string;
  content: string;
  slug: string | null;
  is_pinned: boolean;
  tags: string;
  folder_path: string;
  format_settings: any;
  parent_id: number | null;
  order_index: number;
  created_at: string;
  user_id: string;
}

export async function getNotes() {
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

export async function createNote(note: Omit<Note, 'id' | 'created_at' | 'user_id' | 'slug'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Slug oluştur
  const slug = createSlug(note.title);
  
  // Mevcut slugları kontrol et
  const { data: existingNotes } = await supabase
    .from('Notes')
    .select('slug')
    .eq('user_id', user.id);
    
  const existingSlugs = existingNotes?.map(n => n.slug).filter(Boolean) || [];
  const uniqueSlug = makeUniqueSlug(slug, existingSlugs);

  const { data, error } = await supabase
    .from('Notes')
    .insert([{ ...note, user_id: user.id, slug: uniqueSlug }])
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: number, note: Partial<Note>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let updateData = { ...note };
  
  // Eğer başlık değiştiyse yeni slug oluştur
  if (note.title) {
    const slug = createSlug(note.title);
    
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

export async function deleteNote(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('Notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function toggleNotePin(id: number, isPinned: boolean) {
  return updateNote(id, { is_pinned: !isPinned });
}

export async function getNoteBacklinks(noteTitle: string) {
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
