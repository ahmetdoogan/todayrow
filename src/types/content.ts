// content.ts

export type PlatformType = 
  | 'LINKEDIN' 
  | 'TWITTER' 
  | 'INSTAGRAM' 
  | 'FACEBOOK' 
  | 'YOUTUBE' 
  | 'BLOG';

/** 
 * Burada eski formatları kaldırıp yeni formatları ekledik:
 * TEXT, VIDEO, PODCAST, CAROUSEL, REELS_SHORTS, STORIES, POLL, LIVE, INFOGRAPHIC 
 */
export type ContentFormat = 
  | 'TEXT'
  | 'VIDEO'
  | 'PODCAST'
  | 'CAROUSEL'
  | 'REELS_SHORTS'
  | 'STORIES'
  | 'POLL'
  | 'LIVE'
  | 'INFOGRAPHIC';

/** 
 * Burada da eski türleri kaldırıp yeni türleri ekledik:
 * GENERAL, EXPERIENCE, EDUCATION, INSPIRATION, REVIEW_ANALYSIS, INDUSTRY,
 * TECHNOLOGY, CAREER, PERSONAL_DEVELOPMENT, TRENDING
 */
export type ContentType = 
  | 'GENERAL'
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'INSPIRATION'
  | 'REVIEW_ANALYSIS'
  | 'INDUSTRY'
  | 'TECHNOLOGY'
  | 'CAREER'
  | 'PERSONAL_DEVELOPMENT'
  | 'TRENDING';

export interface ContentReference {
  id: number;
  source_content_id: number;
  target_content_id: number;
  created_at: string;
}

export interface Content {
  id: number;
  title: string;
  details: string;
  type: ContentType;
  format: ContentFormat;
  platforms: PlatformType[];
  timeFrame: string;
  tags: string;
  date: string;
  url?: string;
  preview_data?: {
    title?: string;
    description?: string;
    image?: string;
    site_name?: string;
  };
  slug?: string;
  is_completed: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  references_to?: ContentReference[];
  referenced_by?: ContentReference[];
}

export type ContentUpdateData = Omit<Content, 'id' | 'is_deleted' | 'created_at' | 'updated_at'>;

/**
 * İster böyle güncelleyin, isterseniz dokunmayın.
 * Örnek olarak burada yeni formatları ekliyorum.
 */
export const PLATFORM_FORMATS: Record<PlatformType, ContentFormat[]> = {
  LINKEDIN: ['TEXT', 'VIDEO', 'CAROUSEL', 'POLL'],
  TWITTER: ['TEXT', 'VIDEO', 'POLL'],
  INSTAGRAM: ['VIDEO', 'CAROUSEL', 'STORIES'],
  FACEBOOK: ['TEXT', 'VIDEO', 'CAROUSEL', 'POLL'],
  YOUTUBE: ['VIDEO', 'LIVE'],
  BLOG: ['TEXT', 'INFOGRAPHIC']
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  LINKEDIN: 'LinkedIn',
  TWITTER: 'Twitter',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  YOUTUBE: 'YouTube',
  BLOG: 'Blog/Website'
};
