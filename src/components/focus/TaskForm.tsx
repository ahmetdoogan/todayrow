"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import { PomodoroProject } from "@/types/focus";

interface TaskFormProps {
  onSave: (title: string, estimatedPomodoros: number, projectId?: number, description?: string) => void;
  onCancel: () => void;
  projects?: PomodoroProject[];
  initialValues?: {
    title?: string;
    estimatedPomodoros?: number;
    projectId?: number;
    description?: string;
  };
}

export default function TaskForm({
  onSave,
  onCancel,
  projects = [],
  initialValues = {},
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    initialValues.estimatedPomodoros || 1
  );
  const [projectId, setProjectId] = useState<number | undefined>(
    initialValues.projectId
  );
  const [description, setDescription] = useState(initialValues.description || "");

  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(title.trim(), estimatedPomodoros, projectId, description.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("focus.taskList.whatAreYouWorkingOn")}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("focus.taskList.taskDescription", { defaultValue: "Detailed task description (optional)" })}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("focus.taskList.estimatedPomodoros")}
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setEstimatedPomodoros((prev) => Math.max(1, prev - 1))
                }
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-l-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={estimatedPomodoros}
                onChange={(e) =>
                  setEstimatedPomodoros(parseInt(e.target.value) || 1)
                }
                className="w-12 h-8 text-center bg-gray-100 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setEstimatedPomodoros((prev) => Math.min(10, prev + 1))
                }
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-r-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t("focus.projects.title")}
              </label>
              <select
                value={projectId || ""}
                onChange={(e) =>
                  setProjectId(e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">
                  {t("focus.projects.none", { defaultValue: "None" })}
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
