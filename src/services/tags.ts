"use client";

import { getNotes } from './notes';
import { fuzzySearchInText } from '@/utils/fuzzySearch';

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