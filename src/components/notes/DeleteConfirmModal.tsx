"use client";

import { useTranslations } from "next-intl";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleKey: string; // title yerine titleKey kullanıyoruz
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titleKey // title yerine titleKey kullanıyoruz
}: DeleteConfirmModalProps) {
  const t = useTranslations("common.notes.deleteConfirmation"); // Çevirileri yüklemek için useTranslations hook'unu kullanıyoruz

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 m-0 [&>*]:m-0"
      style={{ margin: 0, padding: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm mx-4 w-full shadow-xl">
        <div className="text-center">
          <h3 className="text-gray-900 dark:text-white mb-4">
            {t(titleKey)} {/* titleKey'i çeviri anahtarı olarak kullanıyoruz */}
          </h3>

          <div className="flex gap-2 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("cancelButton")} {/* "İptal" metnini çeviri anahtarıyla değiştiriyoruz */}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              {t("confirmButton")} {/* "Sil" metnini çeviri anahtarıyla değiştiriyoruz */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}