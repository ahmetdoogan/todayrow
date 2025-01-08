"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePlanner } from "@/context/PlannerContext";
import { useTranslations } from 'next-intl';

const colors = [
  { name: "blue", value: "bg-blue-500" },
  { name: "green", value: "bg-green-500" },
  { name: "purple", value: "bg-purple-500" },
  { name: "orange", value: "bg-orange-500" },
  { name: "pink", value: "bg-pink-500" },
] as const;

type Color = typeof colors[number]["value"];

interface QuickPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickPlanModal = ({ isOpen, onClose }: QuickPlanModalProps) => {
  // Burada user varsa, "usePlanner()" içinden alıyoruz (örnek). Yoksa "const { user } = useAuth();" yap.
  const { createQuickPlan, user } = usePlanner(); 
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState<Color>("bg-blue-500");
  const [error, setError] = useState("");
  const t = useTranslations('common.quickPlansSection');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createQuickPlan({
        title: title.trim(),
        color: selectedColor,
        // Zorunlu alanlar:
        user_id: user?.id || 0, 
        is_system: false,
      });
      onClose();
      setTitle("");
      setSelectedColor("bg-blue-500");
      setError("");
    } catch (error) {
      console.error("Error creating quick plan:", error);
      setError(t('createModal.error'));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('createModal.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('createModal.form.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder={t('createModal.form.titlePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('createModal.form.color')}
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${c.value}
                    ${
                      selectedColor === c.value
                        ? "border-gray-900 dark:border-white scale-110"
                        : "border-transparent hover:scale-105"
                    }
                  `}
                  title={t(`createModal.form.colorNames.${c.name}`)}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t('createModal.buttons.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all"
            >
              {t('createModal.buttons.create')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default QuickPlanModal;
