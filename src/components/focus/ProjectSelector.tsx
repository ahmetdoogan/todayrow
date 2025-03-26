"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit, Trash, FolderKanban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocus } from "@/context/FocusContext";
import type { PomodoroProject } from "@/types/focus"; // <-- tipi buradan çektiğinizi varsayıyorum

export default function ProjectSelector() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<PomodoroProject | null>(null);
  const [activeProject, setActiveProject] = useState<PomodoroProject | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const t = useTranslations();
  const { projects, tasks, createProject, updateProject, deleteProject } = useFocus();

  const colors = [
    { name: "blue", hex: "#3B82F6" },
    { name: "green", hex: "#10B981" },
    { name: "purple", hex: "#8B5CF6" },
    { name: "pink", hex: "#EC4899" },
    { name: "orange", hex: "#F59E0B" },
    { name: "gray", hex: "#6B7280" },
  ];

  // Yeni proje ekle
  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    // Artık 3. parametreyi de destekliyoruz (description)
    createProject(newProjectTitle.trim(), selectedColor, newProjectDescription.trim())
      .then(() => {
        setNewProjectTitle("");
        setNewProjectDescription("");
        setIsAddingProject(false);
      })
      .catch((err) => console.error("Error creating project:", err));
  };

  // Düzenlemeyi kaydet
  const handleUpdateProject = () => {
    if (!editingProject || !newProjectTitle.trim()) return;
    // Object literal’da "description" property’sini de ekle (PomodoroProject tipinde de bu field tanımlanmış olmalı)
    updateProject(editingProject.id, {
      title: newProjectTitle.trim(),
      color: selectedColor,
      description: newProjectDescription.trim(),
    })
      .then(() => {
        setEditingProject(null);
        setNewProjectTitle("");
        setNewProjectDescription("");
        setSelectedColor("#3B82F6");
      })
      .catch((err) => console.error("Error updating project:", err));
  };

  // Proje sil
  const handleDeleteProject = (projectId: number) => {
    deleteProject(projectId).catch((err) =>
      console.error("Error deleting project:", err)
    );
  };

  // Düzenleme formunu aç
  const startEditingProject = (project: PomodoroProject) => {
    setEditingProject(project);
    setIsAddingProject(false);
    setNewProjectTitle(project.title);
    // Project tipinde description varsa
    setNewProjectDescription(project.description || "");
    setSelectedColor(project.color || "#3B82F6");
  };

  // Proje detaylarını aç/kapat
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const toggleProjectDetails = (project: PomodoroProject) => {
    if (activeProjectId === project.id) {
      setActiveProjectId(null);
    } else {
      setActiveProjectId(project.id);
    }
  };

  // Belirli proje ID’sine ait görevleri al
  const getProjectTasks = (projectId: number) => {
    return tasks.filter((task) => task.project_id === projectId);
  };

  // Tamamlanma yüzdesi
  const getCompletionPercentage = (projectId: number) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter((task) => task.is_completed).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const renderForm = () => {
    const isEdit = editingProject !== null;
    const handleSave = isEdit ? handleUpdateProject : handleAddProject;

    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            placeholder={t("focus.projects.projectName", { defaultValue: "Project name" })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <textarea
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            placeholder={t("focus.projects.projectDescription", { defaultValue: "Project description (optional)" })}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("focus.projects.projectColor", { defaultValue: "Project Color" })}
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.hex)}
                className={`w-8 h-8 rounded-full border ${
                  selectedColor === color.hex ? "ring-2 ring-offset-2 ring-gray-400" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setEditingProject(null);
              setIsAddingProject(false);
              setNewProjectTitle("");
              setNewProjectDescription("");
              setSelectedColor("#3B82F6");
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!newProjectTitle.trim()}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <h2 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          {t("focus.projects.title")}
        </h2>
        {!editingProject && !isAddingProject && (
          <button
            onClick={() => {
              setIsAddingProject(true);
              setEditingProject(null);
              setNewProjectTitle("");
              setNewProjectDescription("");
              setSelectedColor("#3B82F6");
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-xs sm:text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("focus.projects.addProject")}</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAddingProject || editingProject) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {renderForm()}
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length > 0 ? (
        <div className="space-y-2">
          {projects.map((project) => {
            const completion = getCompletionPercentage(project.id);
            return (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/90 overflow-hidden transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Proje üst satırı */}
                <motion.div
                  className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80"
                  onClick={() => toggleProjectDetails(project)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  <div
                    className="w-4 h-4 rounded-full min-w-[1rem] min-h-[1rem] mr-3 flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-grow">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {project.title}
                    </span>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getProjectTasks(project.id).length}{" "}
                        <span className="hidden sm:inline">görev</span>
                      </span>
                      {project.description && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                          {t("focus.projects.hasDescription", {
                            defaultValue: "Has description",
                          })}
                        </span>
                      )}
                      {getProjectTasks(project.id).length > 0 && (
                        <div className="ml-2 flex items-center">
                          <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            %{completion}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center ml-auto gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingProject(project);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            t("focus.projects.deleteConfirm", {
                              defaultValue:
                                "Are you sure you want to delete this project?",
                            })
                          )
                        ) {
                          handleDeleteProject(project.id);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-1"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {activeProjectId === project.id && (
                    <motion.div
                      className="border-t border-gray-200 dark:border-gray-600/90 bg-gray-50 dark:bg-gray-800/50 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="p-4">
                        {project.description && (
                          <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              {t("focus.projects.projectDescription", {
                                defaultValue: "Project description",
                              })}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                              {project.description}
                            </p>
                          </div>
                        )}
                        {getProjectTasks(project.id).length > 0 ? (
                          <div className="space-y-2">
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              {t("focus.projects.projectTasks", {
                                defaultValue: "Project Tasks",
                              })}
                            </h3>
                            {getProjectTasks(project.id).map((task) => (
                              <div
                                key={task.id}
                                className={`p-2 rounded-md text-sm flex items-center ${
                                  task.is_completed
                                    ? "bg-gray-100 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400"
                                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                <span
                                  className={task.is_completed ? "line-through" : ""}
                                >
                                  {task.title}
                                </span>
                                <div className="ml-auto flex items-center gap-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {task.completed_pomodoros}/
                                    {task.estimated_pomodoros}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                            Bu projeye ait görev bulunmuyor.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {t("focus.projects.noProjects")}
          </p>
        </div>
      )}
    </div>
  );
}
