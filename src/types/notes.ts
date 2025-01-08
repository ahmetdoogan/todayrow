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