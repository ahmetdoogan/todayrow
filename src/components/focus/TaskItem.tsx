"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from "react";
import ReactDOM from "react-dom";
import { useTranslations } from "next-intl";
import {
  Check,
  MoreVertical,
  Play,
  Trash,
  Edit,
  Pause,
  Archive,
  ArrowUpFromLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocus } from "@/context/FocusContext";

// PORTAL BİLEŞENİ (client tarafında body içine render eder)
function ClientPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(children, document.body);
}

// DROPDOWN'U HEDEF KARTA GÖRE KONUMLANDIRMAK İÇİN BASİT BİR BİLEŞEN
function DropdownPositioner({
  targetRef,
  children,
  offsetTop = 40
}: {
  targetRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  offsetTop?: number;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      // Burada konumu dilediğiniz gibi hesaplayabilirsiniz.
      // Örnek olarak: menüyü kartın sağ üst köşesinin altına yerleştiriyoruz.
      setPos({
        x: rect.right - 160,  // menü genişliği ~ 160px varsayıyoruz
        y: rect.top + offsetTop
      });
    }
  }, [targetRef, offsetTop]);

  return (
    <div
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x
      }}
    >
      {children}
    </div>
  );
}

interface TaskItemProps {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  projectId?: number;
  projectColor?: string;
  projectTitle?: string;
  onComplete: (id: number) => void;
  onStart: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onArchive?: (id: number) => void;
  archiveActionLabel?: string;
  isActive?: boolean;
  isArchived?: boolean;
}

export default function TaskItem({
  id,
  title,
  description,
  isCompleted,
  estimatedPomodoros,
  completedPomodoros,
  projectId,
  projectColor,
  projectTitle,
  onComplete,
  onStart,
  onEdit,
  onDelete,
  onArchive,
  archiveActionLabel = "Arşivle",
  isActive = false,
  isArchived = false
}: TaskItemProps) {
  const t = useTranslations();
  const { isRunning, activeTask } = useFocus();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Görev kartı ve dropdown referansları
  const dropdownRef = useRef<HTMLDivElement>(null);
  const taskItemRef = useRef<HTMLDivElement>(null);

  // Dışarıya tıklayıp dropdown'ı kapatma
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Pomodoro noktaları
  const renderPomodoroDots = () => {
    return Array.from({ length: estimatedPomodoros }).map((_, i) => (
      <div
        key={i}
        className={
          "w-4 h-4 rounded-full " +
          (i < completedPomodoros
            ? "bg-red-500"
            : "bg-gray-200 dark:bg-gray-700")
        }
      />
    ));
  };

  return (
    <motion.div
      ref={taskItemRef}
      className={`
        p-4 mb-2 rounded-lg border relative cursor-pointer
        ${
          isActive && !isCompleted
            ? "border-2 border-blue-400 dark:border-blue-600"
            : projectColor
            ? "border-l-4 border-gray-200 dark:border-gray-600/90"
            : "border-gray-200 dark:border-gray-600/90"
        }
        ${
          isArchived
            ? "bg-gray-50 dark:bg-gray-900/40 border-dashed"
            : isCompleted
            ? "bg-gray-50 dark:bg-gray-800/20"
            : "bg-white dark:bg-gray-800"
        }
      `}
      style={projectColor && !isActive ? { borderLeftColor: projectColor } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // Hover animasyonu, dropdown açıksa iptal
      whileHover={
        !showDropdown
          ? { scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
          : {}
      }
      whileTap={!showDropdown ? { scale: 0.99 } : {}}
      onClick={() => {
        if (description) setShowDetails(!showDetails);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Tamamla butonu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(id);
            }}
            className={`min-w-[1.25rem] min-h-[1.25rem] w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-400 dark:border-gray-600"
            }`}
          >
            {isCompleted && <Check className="w-3 h-3" />}
          </button>

          {/* Başlık ve pomodoro noktaları */}
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                isCompleted
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {title}
            </span>
            <div className="flex flex-wrap items-center mt-1 gap-1">
              {/* Proje etiket */}
              {projectId && projectTitle && (
                <div
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs mr-1"
                  style={{
                    backgroundColor: projectColor
                      ? `${projectColor}20`
                      : "#eee",
                    color: projectColor || "#666"
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                    style={{ backgroundColor: projectColor }}
                  />
                  {projectTitle}
                </div>
              )}
              <div className="flex space-x-1">{renderPomodoroDots()}</div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {completedPomodoros}/{estimatedPomodoros}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ taraftaki butonlar */}
        <div className="flex items-center gap-0.5 ml-2">
          {!isCompleted && !isArchived && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                try {
                  onStart(id);
                } catch (err) {
                  console.error("Error in task start button:", err);
                }
              }}
              className={`w-8 h-8 flex items-center justify-center ${
                isActive && isRunning
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } rounded-lg mr-1`}
              title={
                isActive && isRunning
                  ? t("focus.pauseButton")
                  : t("focus.startButton")
              }
            >
              {isActive && isRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Açılır/Kapanır görev detayı */}
      <AnimatePresence>
        {description && showDetails && (
          <motion.div
            className="border-t border-gray-200 dark:border-gray-600/90 bg-gray-50 dark:bg-gray-800/50 overflow-hidden mt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DROPDOWN MENÜ (PORTAL) */}
      {showDropdown && (
        <ClientPortal>
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Menünün kendisi - absolute yerleştirip positioner ile konumlandırıyoruz */}
            <DropdownPositioner targetRef={taskItemRef}>
              <div
                ref={dropdownRef}
                className="
                  relative w-40
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-600/90
                  rounded-lg shadow-lg
                  pointer-events-auto
                "
              >
                {/* Menü içeriği */}
                {!isCompleted && !isArchived && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                      setShowDropdown(false);
                    }}
                    className="
                      w-full text-left px-4 py-2 text-sm
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      flex items-center
                    "
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t("focus.taskList.edit", { defaultValue: "Edit" })}
                  </button>
                )}

                {onArchive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(id);
                      setShowDropdown(false);
                    }}
                    className="
                      w-full text-left px-4 py-2 text-sm
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      flex items-center
                    "
                  >
                    {isArchived ? (
                      <>
                        <ArrowUpFromLine className="w-4 h-4 mr-2" />
                        {archiveActionLabel}
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" />
                        {archiveActionLabel}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                    setShowDropdown(false);
                  }}
                  className="
                    w-full text-left px-4 py-2 text-sm
                    text-red-600 dark:text-red-400
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    flex items-center
                  "
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {t("focus.taskList.delete", { defaultValue: "Delete" })}
                </button>
              </div>
            </DropdownPositioner>
          </motion.div>
        </ClientPortal>
      )}
    </motion.div>
  );
}
