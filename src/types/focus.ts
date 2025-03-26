export interface PomodoroTask {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  is_archived?: boolean;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  project_id?: number;
  created_at: string;
  updated_at: string;
  pomodoro_projects?: PomodoroProject;
}

export interface PomodoroProject {
  id: number;
  user_id: string;
  title: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
}

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
  pomodoro_tasks?: PomodoroTask;
}

export interface PomodoroSettings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface PomodoroStats {
  today: {
    pomodoros: number;
    minutes: number;
  };
  allTime: {
    pomodoros: number;
    minutes: number;
  };
  weeklyData?: number[];
}
