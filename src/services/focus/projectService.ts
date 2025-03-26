import { supabase } from '@/utils/supabaseClient';
import type { PomodoroProject } from '@/types/focus';

export const getProjects = async (): Promise<PomodoroProject[]> => {
  const { data, error } = await supabase
    .from('pomodoro_projects')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
};

export const createProject = async (
  title: string,
  color: string = '#000000',
  description?: string
): Promise<PomodoroProject> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('pomodoro_projects')
    .insert({
      user_id: user.id,
      title,
      color,
      description,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data as PomodoroProject;
};

export const updateProject = async (
  id: number,
  updates: Partial<PomodoroProject>
): Promise<PomodoroProject> => {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.color !== undefined) updateData.color = updates.color;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('pomodoro_projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data as PomodoroProject;
};

export const deleteProject = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('pomodoro_projects')
    .update({
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
