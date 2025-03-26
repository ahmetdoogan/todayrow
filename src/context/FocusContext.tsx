"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { notifyWithSound, requestNotificationPermission } from "@/utils/notificationHelper";
import { useTranslations } from "next-intl";
import {
  PomodoroTask,
  PomodoroProject,
  PomodoroSession,
  PomodoroSettings,
  PomodoroStats,
} from "@/types/focus";
import * as focusService from "@/services/focus";

interface FocusContextType {
  // Tasks
  tasks: PomodoroTask[];
  archivedTasks: PomodoroTask[];
  isLoadingTasks: boolean;
  isLoadingArchivedTasks: boolean;
  createTask: (title: string, estimatedPomodoros: number, projectId?: number, description?: string) => Promise<PomodoroTask>;
  updateTask: (id: number, updates: Partial<PomodoroTask>) => Promise<PomodoroTask>;
  toggleTaskCompletion: (id: number) => Promise<PomodoroTask>;
  deleteTask: (id: number) => Promise<void>;
  archiveTask: (id: number) => Promise<PomodoroTask>;
  unarchiveTask: (id: number) => Promise<PomodoroTask>;
  archiveCompletedTasks: () => Promise<void>;
  loadArchivedTasks: () => Promise<void>;
  incrementTaskPomodoros: (id: number) => Promise<PomodoroTask>;

  // Projects
  projects: PomodoroProject[];
  isLoadingProjects: boolean;
  createProject: (title: string, color?: string, description?: string) => Promise<PomodoroProject>;
  updateProject: (id: number, updates: Partial<PomodoroProject>) => Promise<PomodoroProject>;
  deleteProject: (id: number) => Promise<void>;

  // Timer
  activeTimerType: "pomodoro" | "short_break" | "long_break";
  setActiveTimerType: (type: "pomodoro" | "short_break" | "long_break") => void;
  timeLeft: number;
  setTimeLeft: (seconds: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  currentSession: PomodoroSession | null;
  activeTask: PomodoroTask | null;
  setActiveTask: (task: PomodoroTask | null) => void;
  startTimer: (taskId?: number) => Promise<PomodoroSession | null>;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => Promise<void>;

  // Settings
  settings: PomodoroSettings;
  isLoadingSettings: boolean;
  updateSettings: (updates: Partial<PomodoroSettings>) => Promise<PomodoroSettings>;

  // Stats
  stats: PomodoroStats | null;
  isLoadingStats: boolean;
  refreshStats: () => Promise<void>;
}

const defaultContext: FocusContextType = {
  // ... (Aynı, değişmeden bırak)
  tasks: [],
  archivedTasks: [],
  isLoadingTasks: false,
  isLoadingArchivedTasks: false,
  createTask: async () => { throw new Error("Not implemented"); },
  updateTask: async () => { throw new Error("Not implemented"); },
  toggleTaskCompletion: async () => { throw new Error("Not implemented"); },
  deleteTask: async () => { throw new Error("Not implemented"); },
  archiveTask: async () => { throw new Error("Not implemented"); },
  unarchiveTask: async () => { throw new Error("Not implemented"); },
  archiveCompletedTasks: async () => { throw new Error("Not implemented"); },
  loadArchivedTasks: async () => { throw new Error("Not implemented"); },
  incrementTaskPomodoros: async () => { throw new Error("Not implemented"); },

  projects: [],
  isLoadingProjects: false,
  createProject: async () => { throw new Error("Not implemented"); },
  updateProject: async () => { throw new Error("Not implemented"); },
  deleteProject: async () => { throw new Error("Not implemented"); },

  activeTimerType: "pomodoro",
  setActiveTimerType: () => {},
  timeLeft: 0,
  setTimeLeft: () => {},
  isRunning: false,
  setIsRunning: () => {},
  currentSession: null,
  activeTask: null,
  setActiveTask: () => {},
  startTimer: async () => { throw new Error("Not implemented"); },
  pauseTimer: () => {},
  resetTimer: () => {},
  completeTimer: async () => { throw new Error("Not implemented"); },

  settings: {
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  isLoadingSettings: false,
  updateSettings: async () => { throw new Error("Not implemented"); },

  stats: null,
  isLoadingStats: false,
  refreshStats: async () => { throw new Error("Not implemented"); },
};

const FocusContext = createContext<FocusContextType>(defaultContext);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const t = useTranslations();

  // ---------------------------
  // States
  const [tasks, setTasks] = useState<PomodoroTask[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<PomodoroTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingArchivedTasks, setIsLoadingArchivedTasks] = useState(false);

  const [projects, setProjects] = useState<PomodoroProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [activeTimerType, setActiveTimerType] = useState<"pomodoro" | "short_break" | "long_break">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [activeTask, setActiveTask] = useState<PomodoroTask | null>(null);

  const [settings, setSettings] = useState<PomodoroSettings>(defaultContext.settings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // ---------------------------
  // On mount (if user logged in)
  useEffect(() => {
    if (user) {
      loadTasks();
      loadProjects();
      loadSettings();
      loadStats();

      requestNotificationPermission();
    }
  }, [user]);

  // ---------------------------
  // Functions

  function updateTimerBasedOnType() {
    switch (activeTimerType) {
      case "pomodoro":
        setTimeLeft(settings.pomodoroLength * 60);
        break;
      case "short_break":
        setTimeLeft(settings.shortBreakLength * 60);
        break;
      case "long_break":
        setTimeLeft(settings.longBreakLength * 60);
        break;
    }
  }

  // Tasks
  async function loadTasks() {
    if (!user) return;
    setIsLoadingTasks(true);
    try {
      const data = await focusService.getTasks(false);
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error(t("focus.errors.loadingTasks", { defaultValue: "Error loading tasks" }));
    } finally {
      setIsLoadingTasks(false);
    }
  }

  async function loadArchivedTasks(): Promise<void> {
    if (!user) return;
    setIsLoadingArchivedTasks(true);
    try {
      // null kontrolü ekleyelim
      const data = await focusService.getArchivedTasks();
      if (data) {
        setArchivedTasks(data);
      } else {
        setArchivedTasks([]);
      }
    } catch (error) {
      console.error("Error loading archived tasks:", error);
      toast.error(t("focus.errors.loadingArchivedTasks", { defaultValue: "Error loading archived tasks" }));
      // Boş dizi ile tamamla
      setArchivedTasks([]);
    } finally {
      setIsLoadingArchivedTasks(false);
    }
  }

  async function createTask(
    title: string,
    estimatedPomodoros: number,
    projectId?: number,
    description?: string
  ): Promise<PomodoroTask> {
    try {
      const newTask = await focusService.createTask(title, estimatedPomodoros, projectId, description);
      setTasks((prev) => [newTask, ...prev]);
      toast.success(t("focus.notifications.taskAdded", { defaultValue: "Task added!" }));
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(t("focus.errors.addingTask", { defaultValue: "Error adding task" }));
      throw error;
    }
  }

  async function updateTask(id: number, updates: Partial<PomodoroTask>): Promise<PomodoroTask> {
    try {
      const updatedTask = await focusService.updateTask(id, updates);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
      toast.success(t("focus.notifications.taskUpdated", { defaultValue: "Task updated!" }));
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(t("focus.errors.updatingTask", { defaultValue: "Error updating task" }));
      throw error;
    }
  }

  async function toggleTaskCompletion(id: number): Promise<PomodoroTask> {
    try {
      const updatedTask = await focusService.toggleTaskCompletion(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));

      if (updatedTask.is_completed) {
        toast.success(t("focus.notifications.taskCompleted", { defaultValue: "Task completed!" }));
      }
      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error(t("focus.errors.toggleTaskCompletion", { defaultValue: "Error changing task status" }));
      throw error;
    }
  }

  async function incrementTaskPomodoros(id: number): Promise<PomodoroTask> {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        // Return or throw error so that the function always returns a PomodoroTask or fails
        throw new Error("Task not found");
      }

      const updatedTask = await focusService.incrementCompletedPomodoros(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (error) {
      console.error("Error incrementing task pomodoros:", error);
      toast.error(t("focus.errors.incrementPomodoros", {
        defaultValue: "Error increasing pomodoro count",
      }));
      throw error;
    }
  }

  async function deleteTask(id: number): Promise<void> {
    try {
      await focusService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setArchivedTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success(t("focus.notifications.taskDeleted", { defaultValue: "Task deleted!" }));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(t("focus.errors.deletingTask", { defaultValue: "Error deleting task" }));
      throw error;
    }
  }

  async function archiveTask(id: number): Promise<PomodoroTask> {
    try {
      const archivedTask = await focusService.archiveTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setArchivedTasks((prev) => [archivedTask, ...prev]);
      toast.success(t("focus.notifications.taskArchived", { defaultValue: "Task archived" }));
      return archivedTask;
    } catch (error) {
      console.error("Error archiving task:", error);
      toast.error(t("focus.errors.archivingTask", { defaultValue: "Error archiving task" }));
      throw error;
    }
  }

  async function unarchiveTask(id: number): Promise<PomodoroTask> {
    try {
      const unarchivedTask = await focusService.unarchiveTask(id);
      setArchivedTasks((prev) => prev.filter((t) => t.id !== id));
      setTasks((prev) => [unarchivedTask, ...prev]);
      toast.success(t("focus.notifications.taskUnarchived", { defaultValue: "Task unarchived" }));
      return unarchivedTask;
    } catch (error) {
      console.error("Error unarchiving task:", error);
      toast.error(t("focus.errors.unarchivingTask", { defaultValue: "Error unarchiving task" }));
      throw error;
    }
  }

  async function archiveCompletedTasks(): Promise<void> {
    try {
      await focusService.archiveCompletedTasks();
      const completedTasks = tasks.filter((t) => t.is_completed);
      setTasks((prev) => prev.filter((t) => !t.is_completed));
      setArchivedTasks((prev) => [
        ...completedTasks.map((t) => ({ ...t, is_archived: true })),
        ...prev,
      ]);
      toast.success(t("focus.notifications.completedTasksArchived", {
        defaultValue: "Completed tasks archived",
      }));
    } catch (error) {
      console.error("Error archiving completed tasks:", error);
      toast.error(t("focus.errors.archivingCompletedTasks", {
        defaultValue: "Error archiving completed tasks",
      }));
      throw error;
    }
  }

  // Projects
  async function loadProjects() {
    if (!user) return;
    setIsLoadingProjects(true);
    try {
      const data = await focusService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error(t("focus.errors.loadingProjects", { defaultValue: "Error loading projects" }));
    } finally {
      setIsLoadingProjects(false);
    }
  }

  async function createProject(title: string, color = "#000000", description?: string): Promise<PomodoroProject> {
    try {
      const newProj = await focusService.createProject(title, color, description);
      setProjects((prev) => [newProj, ...prev]);
      toast.success(t("focus.notifications.projectCreated", { defaultValue: "Project created" }));
      return newProj;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(t("focus.errors.creatingProject", { defaultValue: "Error creating project" }));
      throw error;
    }
  }

  async function updateProject(id: number, updates: Partial<PomodoroProject>): Promise<PomodoroProject> {
    try {
      const updated = await focusService.updateProject(id, updates);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(t("focus.notifications.projectUpdated", { defaultValue: "Project updated" }));
      return updated;
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(t("focus.errors.updatingProject", { defaultValue: "Error updating project" }));
      throw error;
    }
  }

  async function deleteProject(id: number): Promise<void> {
    try {
      await focusService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("focus.notifications.projectDeleted", {
        defaultValue: "Project deleted (inactivated)",
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(t("focus.errors.deletingProject", { defaultValue: "Error deleting project" }));
      throw error;
    }
  }

  // Timer
  async function startTimer(taskId?: number): Promise<PomodoroSession | null> {
    try {
      // Sayaç zaten çalışıyorsa -> durdur
      if (isRunning) {
        pauseTimer();
        return currentSession;
      }

      // Devam eden oturum varsa iptal
      if (currentSession) {
        try {
          await focusService.cancelSession(currentSession.id);
        } catch (err) {
          console.error("Error canceling old session:", err);
        }
      }

      let duration = 0;
      if (activeTimerType === "pomodoro") {
        duration = settings.pomodoroLength * 60;
      } else if (activeTimerType === "short_break") {
        duration = settings.shortBreakLength * 60;
      } else {
        duration = settings.longBreakLength * 60;
      }

      setIsRunning(true);

      const taskIdToSend =
        taskId !== undefined && taskId !== null
          ? taskId
          : activeTask !== null
          ? activeTask.id
          : undefined;

      try {
        const newSession = await focusService.startSession(activeTimerType, duration, taskIdToSend);
        setCurrentSession(newSession);

        if (taskId && !activeTask) {
          const found = tasks.find((t) => t.id === taskId);
          if (found) setActiveTask(found);
        }

        return newSession;
      } catch (dbErr) {
        console.error("Database error in startTimer:", dbErr);
        return null;
      }
    } catch (err) {
      console.error("startTimer error:", err);
      toast.error(t("focus.errors.startingTimer", { defaultValue: "Could not start timer" }));
      setIsRunning(true);
      return null;
    }
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    updateTimerBasedOnType();

    if (currentSession) {
      focusService
        .cancelSession(currentSession.id)
        .then(() => setCurrentSession(null))
        .catch((error) => console.error("Error canceling session:", error));
    }
  }

  async function completeTimer(): Promise<void> {
    if (!currentSession) return;
    try {
      const done = await focusService.completeSession(currentSession.id);
      setCurrentSession(null);

      if (done.session_type === "pomodoro" && done.task_id) {
        await loadTasks();
      }
      console.log("Timer completed!");
      refreshStats();
    } catch (err) {
      console.error("completeTimer error:", err);
      toast.error(t("focus.errors.completingTimer", { defaultValue: "Error completing timer" }));
    }
  }

  // Settings
  async function loadSettings() {
    if (!user) return;
    setIsLoadingSettings(true);
    try {
      const data = await focusService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
      setSettings(focusService.DEFAULT_SETTINGS);
    } finally {
      setIsLoadingSettings(false);
    }
  }

  async function updateSettings(updates: Partial<PomodoroSettings>): Promise<PomodoroSettings> {
    try {
      const updated = await focusService.updateSettings(updates);
      setSettings(updated);
      toast.success(t("focus.notifications.settingsUpdated", { defaultValue: "Settings updated" }));
      return updated;
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error(t("focus.errors.updatingSettings", { defaultValue: "Error updating settings" }));
      throw err;
    }
  }

  // Stats
  async function loadStats() {
    if (!user) return;
    setIsLoadingStats(true);
    try {
      const data = await focusService.getSessionStatistics();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  }

  async function refreshStats() {
    await loadStats();
  }

  // ---------------------------
  // useEffect (burada completeTimer ve startTimer fonksiyonu zaten yukarıda tanımlı)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);

      if (currentSession) {
        completeTimer(); // Sorunsuz referans
        if (activeTimerType === "pomodoro") {
          notifyWithSound(
            t("focus.notifications.pomodoroComplete", { defaultValue: "Pomodoro completed!" }),
            undefined,
            "pomodoro"
          );
          if (settings.autoStartBreaks) {
            setActiveTimerType("short_break");
            setTimeout(() => {
              startTimer();
            }, 1000);
          }
        } else if (activeTimerType === "short_break") {
          notifyWithSound(
            t("focus.notifications.shortBreakComplete", { defaultValue: "Short break completed!" }),
            undefined,
            "break"
          );
          if (settings.autoStartPomodoros) {
            setActiveTimerType("pomodoro");
            setTimeout(() => {
              startTimer(activeTask?.id);
            }, 1000);
          }
        } else if (activeTimerType === "long_break") {
          notifyWithSound(
            t("focus.notifications.longBreakComplete", { defaultValue: "Long break completed!" }),
            undefined,
            "break"
          );
          if (settings.autoStartPomodoros) {
            setActiveTimerType("pomodoro");
            setTimeout(() => {
              startTimer(activeTask?.id);
            }, 1000);
          }
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    currentSession,
    activeTimerType,
    settings,
    activeTask,
    startTimer, // fonksiyon
    completeTimer, // fonksiyon
    t,
  ]);

  // ---------------------------
  const value: FocusContextType = {
    // Tasks
    tasks,
    archivedTasks,
    isLoadingTasks,
    isLoadingArchivedTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    archiveTask,
    unarchiveTask,
    archiveCompletedTasks,
    loadArchivedTasks,
    incrementTaskPomodoros,

    // Projects
    projects,
    isLoadingProjects,
    createProject,
    updateProject,
    deleteProject,

    // Timer
    activeTimerType,
    setActiveTimerType,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    currentSession,
    activeTask,
    setActiveTask,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,

    // Settings
    settings,
    isLoadingSettings,
    updateSettings,

    // Stats
    stats,
    isLoadingStats,
    refreshStats,
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
};
