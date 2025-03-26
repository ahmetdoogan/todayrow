"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useFocus } from '@/context/FocusContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations();
  const { settings, updateSettings } = useFocus();
  
  // Local form state
  const [pomodoroLength, setPomodoroLength] = useState(settings.pomodoroLength);
  const [shortBreakLength, setShortBreakLength] = useState(settings.shortBreakLength);
  const [longBreakLength, setLongBreakLength] = useState(settings.longBreakLength);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(settings.autoStartPomodoros);

  // Sync local state with context when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPomodoroLength(settings.pomodoroLength);
      setShortBreakLength(settings.shortBreakLength);
      setLongBreakLength(settings.longBreakLength);
      setAutoStartBreaks(settings.autoStartBreaks);
      setAutoStartPomodoros(settings.autoStartPomodoros);
    }
  }, [isOpen, settings]);

  // Save settings
  const handleSave = async () => {
    try {
      await updateSettings({
        pomodoroLength,
        shortBreakLength,
        longBreakLength,
        autoStartBreaks,
        autoStartPomodoros
      });
      onClose();
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("focus.settings.title")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Timer Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="pomodoroLength">
                {t("focus.settings.pomodoroLength")}
              </Label>
              <div className="flex items-center">
                <Input
                  id="pomodoroLength"
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroLength}
                  onChange={(e) => setPomodoroLength(Number(e.target.value))}
                  className="w-20 text-right"
                />
                <span className="ml-2 text-sm text-gray-500">
                  {t("focus.settings.minutes")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="shortBreakLength">
                {t("focus.settings.shortBreakLength")}
              </Label>
              <div className="flex items-center">
                <Input
                  id="shortBreakLength"
                  type="number"
                  min="1"
                  max="60"
                  value={shortBreakLength}
                  onChange={(e) => setShortBreakLength(Number(e.target.value))}
                  className="w-20 text-right"
                />
                <span className="ml-2 text-sm text-gray-500">
                  {t("focus.settings.minutes")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="longBreakLength">
                {t("focus.settings.longBreakLength")}
              </Label>
              <div className="flex items-center">
                <Input
                  id="longBreakLength"
                  type="number"
                  min="1"
                  max="120"
                  value={longBreakLength}
                  onChange={(e) => setLongBreakLength(Number(e.target.value))}
                  className="w-20 text-right"
                />
                <span className="ml-2 text-sm text-gray-500">
                  {t("focus.settings.minutes")}
                </span>
              </div>
            </div>
          </div>

          {/* Auto-Start Settings */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartBreaks" className="flex-1">
                {t("focus.settings.autoStartBreaks")}
              </Label>
              <Switch
                id="autoStartBreaks"
                checked={autoStartBreaks}
                onCheckedChange={setAutoStartBreaks}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartPomodoros" className="flex-1">
                {t("focus.settings.autoStartPomodoros")}
              </Label>
              <Switch
                id="autoStartPomodoros"
                checked={autoStartPomodoros}
                onCheckedChange={setAutoStartPomodoros}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("common.cancel")}
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("common.save")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
