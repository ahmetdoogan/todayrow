import { supabase } from '@/utils/supabaseClient';
import { PomodoroTask } from '@/types/focus';

// Type tanımı types/focus.ts dosyasına taşındı

export const getTasks = async (includeArchived: boolean = false): Promise<PomodoroTask[]> => {
  let query = supabase
    .from('pomodoro_tasks')
    .select('*, pomodoro_projects(*)')
  
  // Arşivlenmiş görevleri dahil etmeyelim, istenirse dahil edelim
  if (!includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data || [];
};

export const getArchivedTasks = async (): Promise<PomodoroTask[]> => {
  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .select('*, pomodoro_projects(*)')
    .eq('is_archived', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching archived tasks:', error);
    throw error;
  }

  return data || [];
};

export const createTask = async (
  title: string,
  estimatedPomodoros: number,
  projectId?: number,
  description?: string
): Promise<PomodoroTask> => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .insert({
      user_id: user.id,
      title,
      estimated_pomodoros: estimatedPomodoros,
      project_id: projectId,
      description,
      is_completed: false,
      completed_pomodoros: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
};

export const updateTask = async (
  id: number,
  updates: Partial<PomodoroTask>
): Promise<PomodoroTask> => {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.is_completed !== undefined)
    updateData.is_completed = updates.is_completed;
  if (updates.estimated_pomodoros !== undefined)
    updateData.estimated_pomodoros = updates.estimated_pomodoros;
  if (updates.completed_pomodoros !== undefined)
    updateData.completed_pomodoros = updates.completed_pomodoros;
  if (updates.project_id !== undefined)
    updateData.project_id = updates.project_id;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
};

export const incrementCompletedPomodoros = async (
  id: number
): Promise<PomodoroTask> => {
  const { data: task, error: getError } = await supabase
    .from('pomodoro_tasks')
    .select('completed_pomodoros')
    .eq('id', id)
    .single();

  if (getError) {
    console.error('Error getting task:', getError);
    throw getError;
  }

  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .update({
      completed_pomodoros: (task.completed_pomodoros || 0) + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error incrementing pomodoros:', error);
    throw error;
  }

  return data;
};

export const toggleTaskCompletion = async (
  id: number
): Promise<PomodoroTask> => {
  const { data: task, error: getError } = await supabase
    .from('pomodoro_tasks')
    .select('is_completed')
    .eq('id', id)
    .single();

  if (getError) {
    console.error('Error getting task:', getError);
    throw getError;
  }

  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .update({
      is_completed: !task.is_completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }

  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('pomodoro_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const archiveTask = async (id: number): Promise<PomodoroTask> => {
  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .update({
      is_archived: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error archiving task:', error);
    throw error;
  }

  return data;
};

export const unarchiveTask = async (id: number): Promise<PomodoroTask> => {
  const { data, error } = await supabase
    .from('pomodoro_tasks')
    .update({
      is_archived: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error unarchiving task:', error);
    throw error;
  }

  return data;
};

export const archiveCompletedTasks = async (): Promise<void> => {
  const { error } = await supabase
    .from('pomodoro_tasks')
    .update({
      is_archived: true,
      updated_at: new Date().toISOString()
    })
    .eq('is_completed', true)
    .eq('is_archived', false);

  if (error) {
    console.error('Error archiving completed tasks:', error);
    throw error;
  }
};
