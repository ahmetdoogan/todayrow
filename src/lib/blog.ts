// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogDir = path.join(process.cwd(), 'src/blog-content');

// İki dil arasında çeviri eşleştirmeleri
// Bu yapı, bir blog yazısının farklı dil versiyonlarını eşleştirir
type TranslationPair = {
  en: string;
  tr: string;
};

// Bu konfigürasyon, her dil çiftinin slug eşleştirmesini içerir
// Yeni blog yazıları eklendiğinde bu listeye ekleme yapılmalıdır
const translationPairs: TranslationPair[] = [
  {
    en: 'effective-daily-planning-routines',
    tr: 'etkili-gunluk-planlama-rutinleri'
  },
  {
    en: 'focus-techniques-for-productivity',
    tr: 'uretkenlik-icin-odaklanma-teknikleri'
  },
  {
    en: 'minimalist-planning-approach',
    tr: 'minimalist-planlama-yaklasimi'
  },
  {
    en: 'note-taking-strategies-for-success',
    tr: 'basari-icin-not-alma-stratejileri'
  },
  {
    en: 'time-blocking-productivity-technique',
    tr: 'zaman-bloklama-uretkenlik-teknigi'
  },
  {
    en: 'productivity-enhancing-morning-routines',
    tr: 'uretkenliginizi-arttiracak-sabah-rutinleri'
  }
  // Yeni blog yazıları eklendikçe bu listeyi güncelleyin
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
  categories: string[];
  locale: string;
  content: string;      // Orijinal MDX
  contentHtml: string;  // Markdown -> HTML dönüştürülmüş
}

// Mevcut dilleri döndürür (ör. ['en','tr'])
export function getAvailableLocales(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter(item => fs.statSync(path.join(blogDir, item)).isDirectory());
}

// Bir dil klasöründeki MDX dosyalarını slug olarak döndürür
export function getBlogSlugs(locale: string): string[] {
  const dir = path.join(blogDir, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}

// Verilen dil ve slug için blog yazısını döndürür
export function getBlogPostBySlug(locale: string, slug: string): BlogPost | null {
  const filePath = path.join(blogDir, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  const html = marked(content);

  return {
    slug,
    title: data.title ?? 'Untitled',
    excerpt: data.excerpt ?? '',
    date: data.date ?? '',
    author: data.author ?? '',
    coverImage: data.coverImage ?? '',
    categories: data.categories ?? [],
    locale,
    content,
    contentHtml: html
  };
}

// Bir dildeki tüm yazıları döndürür, tarihe göre sıralar (yeniden eskiye)
export function getAllBlogPosts(locale: string): BlogPost[] {
  const slugs = getBlogSlugs(locale);
  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    const p = getBlogPostBySlug(locale, slug);
    if (p) posts.push(p);
  }

  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

// Kategori listesini döndürür
export function getCategories(locale: string): string[] {
  const all = getAllBlogPosts(locale);
  const catSet = new Set<string>();
  all.forEach(p => {
    p.categories.forEach(c => catSet.add(c));
  });
  return Array.from(catSet);
}

// Belirli bir kategorideki tüm blog yazılarını döndürür
export function getPostsByCategory(category: string, locale: string): BlogPost[] {
  const allPosts = getAllBlogPosts(locale);
  return allPosts.filter(post => post.categories.includes(category));
}

// Bir blog yazısının diğer dildeki karşılığını bulur
export function findTranslatedSlug(slug: string, currentLocale: string, targetLocale: string): string | null {
  // Slug'ın hangi dile ait olduğundan emin olalım
  if (currentLocale !== 'en' && currentLocale !== 'tr') return null;
  if (targetLocale !== 'en' && targetLocale !== 'tr') return null;
  
  // İlgili çeviri çiftini bulalım
  const pair = translationPairs.find(p => p[currentLocale as keyof TranslationPair] === slug);
  if (!pair) return null;
  
  // Hedef dildeki slug'ı döndürelim
  return pair[targetLocale as keyof TranslationPair];
}
