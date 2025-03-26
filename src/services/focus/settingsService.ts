import { supabase } from "@/utils/supabaseClient";

export interface PomodoroSettings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const getSettings = async (): Promise<PomodoroSettings> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("pomodoro_settings")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("Error fetching pomodoro settings:", error);
    throw error;
  }

  if (!data?.pomodoro_settings) {
    return DEFAULT_SETTINGS;
  }
  return data.pomodoro_settings as PomodoroSettings;
};

export const updateSettings = async (
  settings: Partial<PomodoroSettings>
): Promise<PomodoroSettings> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const currentSettings = await getSettings().catch(() => DEFAULT_SETTINGS);
  const updatedSettings = { ...currentSettings, ...settings };

  const { data, error } = await supabase
    .from("profiles")
    .update({
      pomodoro_settings: updatedSettings,
    })
    .eq("id", user.id)
    .select("pomodoro_settings")
    .single();
  if (error) {
    console.error("Error updating pomodoro settings:", error);
    throw error;
  }
  return data.pomodoro_settings as PomodoroSettings;
};
