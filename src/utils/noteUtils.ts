// Link formatı için işlevler
export const NOTE_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

export function extractNoteLinks(content: string): string[] {
  const matches = content.match(NOTE_LINK_REGEX);
  if (!matches) return [];
  return matches.map(match => match.slice(2, -2)); // [[Note]] -> Note
}

// Link yönlendirme URL'sini oluştur
export function createNoteLinkUrl(slug: string): string {
  return `/dashboard/notes/${slug}`;
}
