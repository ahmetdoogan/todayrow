"use client";
import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function VerifyPage() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold mb-2">{t('verify.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('verify.description')}
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('verify.checkSpam')}
          </p>
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline block"
          >
            {commonT('navigation.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}