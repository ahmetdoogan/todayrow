"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  ListChecks,
  Archive,
  ArrowUpFromLine,
  ArchiveRestore,
} from "lucide-react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { useFocus } from "@/context/FocusContext";
import type { PomodoroTask } from "@/types/focus"; // <-- Dikkat: import types/focus
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PomodoroTask | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const t = useTranslations();

  const {
    tasks,
    isLoadingTasks,
    archivedTasks,
    isLoadingArchivedTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    archiveTask,
    unarchiveTask,
    archiveCompletedTasks,
    loadArchivedTasks,
    startTimer,
    setActiveTask,
    activeTask,
    isRunning,
    pauseTimer,
    projects,
  } = useFocus();

  // Archive/açma butonuna tıklandığında verileri hemen yükleme
  useEffect(() => {
    if (showArchived) {
      loadArchivedTasks();
    }
  }, [showArchived]);

  const handleAddTask = async (
    title: string,
    estimatedPomodoros: number,
    projectId?: number,
    description?: string
  ) => {
    try {
      await createTask(title, estimatedPomodoros, projectId, description);
      setIsAddingTask(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTask = async (
    title: string,
    estimatedPomodoros: number,
    projectId?: number,
    description?: string
  ) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, {
        title,
        estimated_pomodoros: estimatedPomodoros,
        project_id: projectId,
        description,
      });
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleStartTask = (task: PomodoroTask) => {
    try {
      if (activeTask?.id === task.id && isRunning) {
        pauseTimer();
      } else {
        // Önce UI güncelle
        setActiveTask(task);
        try {
          startTimer(task.id);
        } catch (err) {
          console.error("Error starting timer from task:", err);
        }
      }
    } catch (err) {
      console.error("Unexpected error in handleStartTask:", err);
    }
  };

  const handleEditTask = (taskId: number) => {
    const found = tasks.find((t) => t.id === taskId);
    if (!found) return;
    setEditingTask(found);
    setIsAddingTask(false);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            {showArchived
              ? t("focus.taskList.archivedTasks", {
                  defaultValue: "Arşivlenmiş Görevler",
                })
              : t("focus.taskList.title")}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            {!showArchived && !isAddingTask && !editingTask && (
              <button
                onClick={archiveCompletedTasks}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs sm:text-sm rounded-lg transition-colors"
                title={t("focus.taskList.archiveCompleted", {
                  defaultValue: "Tamamlananları Arşivle",
                })}
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("focus.taskList.archiveCompletedShort", {
                    defaultValue: "Arşivle",
                  })}
                </span>
              </button>
            )}

            <button
            onClick={() => {
              if (!showArchived) {
                // Görevleri yükleyin ve sonra arşivi gösterin
              loadArchivedTasks().catch(err => console.error("Error loading archived tasks:", err));
            }
            setShowArchived(!showArchived);
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm rounded-lg transition-colors"
            title={
            showArchived
                ? t("focus.taskList.currentTasks", {
                        defaultValue: "Aktif Görevler",
                      })
                    : t("focus.taskList.showArchived", {
                        defaultValue: "Arşivlenmiş Görevleri Göster",
                      })
                }
            >
              {showArchived ? (
                <>
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("focus.taskList.currentTasksShort", {
                      defaultValue: "Aktif",
                    })}
                  </span>
                </>
              ) : (
                <>
                  <ArchiveRestore className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("focus.taskList.showArchivedShort", {
                      defaultValue: "Arşivi Aç",
                    })}
                  </span>
                </>
              )}
            </button>

            {!isAddingTask && !editingTask && (
              <button
                onClick={() => {
                  setIsAddingTask(true);
                  setEditingTask(null);
                }}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("focus.taskList.addTask")}
                </span>
              </button>
            )}
          </div>
        </div>

        {showArchived && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t("focus.taskList.archivedTasksDescription", {
              defaultValue:
                "Arşivlenmiş görevler burada görüntülenir. Arşivden çıkarmak istediğiniz görevleri seçebilirsiniz.",
            })}
          </p>
        )}
      </div>

      {/* Ekleme Formu */}
      <AnimatePresence>
        {isAddingTask && !editingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <TaskForm
              onSave={handleAddTask}
              onCancel={() => setIsAddingTask(false)}
              projects={projects}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Düzenleme Formu */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <TaskForm
              onSave={(title, est, projId, desc) =>
                handleUpdateTask(title, est, projId, desc)
              }
              onCancel={() => setEditingTask(null)}
              projects={projects}
              initialValues={{
                title: editingTask.title,
                estimatedPomodoros: editingTask.estimated_pomodoros,
                projectId: editingTask.project_id,
                description: editingTask.description,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Görev Listesi */}
      <AnimatePresence mode="wait">
        {showArchived ? (
          <motion.div
            key="archivedTasks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoadingArchivedTasks ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("common.loading", { defaultValue: "Yükleniyor..." })}
                </p>
              </div>
            ) : archivedTasks.length > 0 ? (
              <div className="space-y-3">
                {archivedTasks.map((task) => {
                  const taskProject = task.project_id
                    ? projects.find((p) => p.id === task.project_id)
                    : null;

                  return (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      isCompleted={task.is_completed}
                      estimatedPomodoros={task.estimated_pomodoros}
                      completedPomodoros={task.completed_pomodoros}
                      projectId={task.project_id}
                      projectColor={taskProject?.color}
                      projectTitle={taskProject?.title}
                      isArchived={true}
                      onComplete={(id) => toggleTaskCompletion(id)}
                      onStart={() => handleStartTask(task)}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onArchive={(id) => unarchiveTask(id)}
                      archiveActionLabel={t("focus.taskList.unarchive", {
                        defaultValue: "Arşivden Çıkar",
                      })}
                      isActive={activeTask?.id === task.id}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("focus.taskList.noArchivedTasks", {
                    defaultValue: "Arşivlenmiş görev bulunmuyor.",
                  })}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="activeTasks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoadingTasks ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("common.loading", { defaultValue: "Yükleniyor..." })}
                </p>
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const taskProject = task.project_id
                    ? projects.find((p) => p.id === task.project_id)
                    : null;
                  return (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      isCompleted={task.is_completed}
                      estimatedPomodoros={task.estimated_pomodoros}
                      completedPomodoros={task.completed_pomodoros}
                      projectId={task.project_id}
                      projectColor={taskProject?.color}
                      projectTitle={taskProject?.title}
                      isArchived={false}
                      onComplete={(id) => toggleTaskCompletion(id)}
                      onStart={() => handleStartTask(task)}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onArchive={(id) => archiveTask(id)}
                      archiveActionLabel={t("focus.taskList.archive", {
                        defaultValue: "Arşivle",
                      })}
                      isActive={activeTask?.id === task.id}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("focus.taskList.noTasks")}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
