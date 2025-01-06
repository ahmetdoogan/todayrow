import { supabase } from '../utils/supabaseClient';
import { Content, ContentUpdateData } from '../types/content';
import { createSlug, makeUniqueSlug } from '../utils/slugUtils';

export const contentService = {
  getAllContents: async (userId: string): Promise<Content[]> => {
    const { data, error } = await supabase
      .from("Content")
      .select(`
        *,
        references_to:ContentReference!source_content_id(
          id,
          target_content_id
        ),
        referenced_by:ContentReference!target_content_id(
          id,
          source_content_id
        )
      `)
      .eq("is_deleted", false)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return (data || []).map(content => ({
      ...content,
      platforms: content.platforms || (content.platform ? [content.platform] : ['LINKEDIN']),
      references_to: content.references_to || [],
      referenced_by: content.referenced_by || []
    }));
  },

  getContentBySlug: async (slug: string, userId: string): Promise<Content | null> => {
    const { data, error } = await supabase
      .from("Content")
      .select(`
        *,
        references_to:ContentReference!source_content_id(
          id,
          target_content_id
        ),
        referenced_by:ContentReference!target_content_id(
          id,
          source_content_id
        )
      `)
      .eq("slug", slug)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return {
      ...data,
      references_to: data.references_to || [],
      referenced_by: data.referenced_by || []
    };
  },

  deleteContent: async (id: number, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("Content")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  },

  updateContent: async (id: number, data: ContentUpdateData, userId: string): Promise<void> => {
    // Sadece gerekli alanları içeren veriyi hazırla
    const updateData = {
      title: data.title,
      details: data.details,
      type: data.type,
      format: data.format,
      platforms: data.platforms,
      timeFrame: data.timeFrame,
      tags: data.tags,
      date: data.date,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("Content")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  },

  updateCompletionStatus: async (id: number, isCompleted: boolean, userId: string): Promise<void> => {
    const { error } = await supabase
      .from("Content")
      .update({ 
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  },

  addContentReference: async (sourceId: number, targetId: number): Promise<void> => {
    // Önce referansın zaten var olup olmadığını kontrol et
    const { data: existingRef, error: checkError } = await supabase
      .from("ContentReference")
      .select("*")
      .eq("source_content_id", sourceId)
      .eq("target_content_id", targetId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Referans yoksa ekle
    if (!existingRef) {
      const { error } = await supabase
        .from("ContentReference")
        .insert([{
          source_content_id: sourceId,
          target_content_id: targetId,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        throw error;
      }
    }
  },

  removeContentReference: async (sourceId: number, targetId: number): Promise<void> => {
    const { error } = await supabase
      .from("ContentReference")
      .delete()
      .eq("source_content_id", sourceId)
      .eq("target_content_id", targetId);

    if (error) {
      throw error;
    }
  }
};