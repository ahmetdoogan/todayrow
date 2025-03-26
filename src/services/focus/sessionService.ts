import { supabase } from '@/utils/supabaseClient';

export interface PomodoroSession {
  id: number;
  user_id: string;
  task_id?: number;
  session_type: 'pomodoro' | 'short_break' | 'long_break';
  start_time: string;
  end_time?: string;
  duration: number;
  is_completed: boolean;
  created_at: string;
}

export const getSessions = async (limit: number = 50): Promise<PomodoroSession[]> => {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .select('*, pomodoro_tasks(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  return data || [];
};

export const startSession = async (
  sessionType: 'pomodoro' | 'short_break' | 'long_break',
  duration: number,
  taskId?: number
): Promise<PomodoroSession> => {
  // Mevcut user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .insert({
      user_id: user.id,
      session_type: sessionType,
      start_time: new Date().toISOString(),
      duration,
      task_id: taskId,
      is_completed: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting session:', error);
    throw error;
  }

  return data;
};

export const completeSession = async (
  id: number
): Promise<PomodoroSession> => {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .update({
      end_time: new Date().toISOString(),
      is_completed: true
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error completing session:', error);
    throw error;
  }

  // Eğer pomodoro session ve görev varsa DB'de increment
  if (data.session_type === 'pomodoro' && data.task_id) {
    try {
      const { data: task, error: getError } = await supabase
        .from('pomodoro_tasks')
        .select('completed_pomodoros')
        .eq('id', data.task_id)
        .single();

      if (getError) throw getError;

      await supabase
        .from('pomodoro_tasks')
        .update({
          completed_pomodoros: (task.completed_pomodoros || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.task_id);
    } catch (e) {
      console.error('Error incrementing task pomodoros:', e);
    }
  }

  return data;
};

export const cancelSession = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('pomodoro_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error canceling session:', error);
    throw error;
  }
};

export const getSessionStatistics = async () => {
  // Mevcut user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);

  // Bugünkü oturumlar
  const { data: todayData, error: todayError } = await supabase
    .from('pomodoro_sessions')
    .select('session_type, duration, is_completed')
    .eq('user_id', user.id)
    .gte('start_time', currentDay.toISOString())
    .is('is_completed', true);

  if (todayError) {
    console.error('Error fetching today stats:', todayError);
    throw todayError;
  }

  // Tüm zamanlar
  const { data: allTimeData, error: allTimeError } = await supabase
    .from('pomodoro_sessions')
    .select('session_type, duration, is_completed')
    .eq('user_id', user.id)
    .is('is_completed', true);

  if (allTimeError) {
    console.error('Error fetching all time stats:', allTimeError);
    throw allTimeError;
  }

  // Son 7 günün verileri - Haftalık özet için
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Bugün + 6 gün öncesi = 7 gün
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: weeklyData, error: weeklyError } = await supabase
    .from('pomodoro_sessions')
    .select('start_time, session_type')
    .eq('user_id', user.id)
    .eq('session_type', 'pomodoro')
    .is('is_completed', true)
    .gte('start_time', sevenDaysAgo.toISOString());

  if (weeklyError) {
    console.error('Error fetching weekly stats:', weeklyError);
    throw weeklyError;
  }

  // Günlere göre pomodoro sayılarını hesapla
  const daysArray = Array(7).fill(0); // [0, 0, 0, 0, 0, 0, 0] - Pazartesi - Pazar
  
  // Bugünün hangi gün olduğunu al (0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi)
  const dayOfWeek = new Date().getDay(); // 0-6
  
  // Haftayı bir Pazartesi ile başlatmak için indeks dönüşümü yapalım
  // 0 (Pazar) -> 6, 1 (Pazartesi) -> 0, 2 (Salı) -> 1, ..., 6 (Cumartesi) -> 5
  const mondayBasedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Gerçek verileri doldur
  weeklyData.forEach(session => {
    const sessionDate = new Date(session.start_time);
    const sessionDay = sessionDate.getDay(); // 0-6
    
    // Günü Pazartesi bazından indekse çevir
    const mondayBasedDay = sessionDay === 0 ? 6 : sessionDay - 1;
    
    // Günün kaydını arttır
    daysArray[mondayBasedDay]++;
  });
  
  // Hata ayıklamak için haftalık veri hakkında detaylı bilgi konsola yazdır
  console.log("Weekly data debug info:");
  console.log("Date range:", sevenDaysAgo.toISOString(), "to", new Date().toISOString());
  console.log("Today is day:", dayOfWeek, "(0=Sun, 1=Mon, ..., 6=Sat)");
  console.log("Monday-based today index:", mondayBasedToday);
  console.log("Raw session count:", weeklyData.length);
  console.log("Resulting days array:", daysArray);

  const todayPomodoros = todayData.filter((s) => s.session_type === 'pomodoro').length;
  const todayMinutes = todayData.reduce((acc, s) => acc + s.duration / 60, 0);

  const allTimePomodoros = allTimeData.filter((s) => s.session_type === 'pomodoro').length;
  const allTimeMinutes = allTimeData.reduce((acc, s) => acc + s.duration / 60, 0);

  return {
    today: {
      pomodoros: todayPomodoros,
      minutes: Math.round(todayMinutes)
    },
    allTime: {
      pomodoros: allTimePomodoros,
      minutes: Math.round(allTimeMinutes)
    },
    weeklyData: daysArray // Her gün için pomodoro sayısı [Pazartesi, Salı, ..., Pazar]
  };
};
