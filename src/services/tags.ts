"use client";

import { getNotes } from './notes';
import { fuzzySearchInText } from '@/utils/fuzzySearch';
import { supabase } from '@/utils/supabaseClient';

export interface TagOrFolder {
  name: string;
  count: number;
  type: 'tag' | 'folder';
}

// Tüm etiketleri getir
export async function getAllTags(): Promise<TagOrFolder[]> {
  try {
    const notes = await getNotes();
    const tagsMap = new Map<string, number>();

    notes.forEach(note => {
      if (!note.tags) return;
      
      const tags = note.tags.split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      tags.forEach(tag => {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagsMap.entries())
      .map(([name, count]) => ({ name, count, type: 'tag' as const }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Tüm klasörleri getir
export async function getAllFolders(): Promise<TagOrFolder[]> {
  try {
    const notes = await getNotes();
    const foldersMap = new Map<string, number>();

    notes.forEach(note => {
      if (!note.folder_path) return;

      const folder = note.folder_path.trim();
      if (folder) {
        foldersMap.set(folder, (foldersMap.get(folder) || 0) + 1);
      }
    });

    return Array.from(foldersMap.entries())
      .map(([name, count]) => ({ name, count, type: 'folder' as const }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
}

// Arama terimine göre etiket ve klasör önerileri getir
export async function searchTagsAndFolders(
  searchTerm: string,
  type: 'tag' | 'folder'
): Promise<TagOrFolder[]> {
  try {
    const items = type === 'tag' ? await getAllTags() : await getAllFolders();
    
    if (!searchTerm.trim()) {
      return items.slice(0, 10); // En çok kullanılan 10 tanesini göster
    }

    return items
      .filter(item => fuzzySearchInText(item.name, searchTerm))
      .sort((a, b) => {
        // Tam eşleşmeler önce gelsin
        const aExact = a.name.toLowerCase() === searchTerm.toLowerCase();
        const bExact = b.name.toLowerCase() === searchTerm.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Sonra kullanım sayısına göre sırala
        return b.count - a.count;
      })
      .slice(0, 10); // En alakalı 10 tanesini göster
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
}

// Klasör silme fonksiyonu
export async function deleteFolder(folderPath: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  // Önce klasöre ait notları güncelle
  const { error: updateError } = await supabase
    .from('Notes')
    .update({ folder_path: '' })
    .eq('user_id', user.id)
    .eq('folder_path', folderPath);

  if (updateError) throw updateError;

  // Sonra profiles tablosundan klasör rengini sil
  const { data: profile } = await supabase
    .from('profiles')
    .select('folder_settings')
    .eq('id', user.id)
    .single();

  if (profile?.folder_settings?.folder_colors) {
    const newSettings = { ...profile.folder_settings };
    delete newSettings.folder_colors[folderPath];

    const { error: settingsError } = await supabase
      .from('profiles')
      .update({ folder_settings: newSettings })
      .eq('id', user.id);

    if (settingsError) throw settingsError;
  }

  return { success: true };
}

// Etiket silme fonksiyonu
export async function deleteTag(tagName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not found');

  // Notlardan bu etiketi kaldır
  const { data: notes } = await supabase
    .from('Notes')
    .select('id, tags')
    .eq('user_id', user.id);

  for (const note of notes || []) {
    if (!note.tags) continue;
    
    const tags = note.tags.split(',').map(t => t.trim());
    const newTags = tags.filter(t => t !== tagName).join(',');

    const { error: updateError } = await supabase
      .from('Notes')
      .update({ tags: newTags })
      .eq('id', note.id);

    if (updateError) throw updateError;
  }

  return { success: true };
}