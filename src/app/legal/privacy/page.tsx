"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const sections = useTranslations('common.legal.privacyPolicy.sections');
  const common = useTranslations('common.legal');
  const privacyPolicy = useTranslations('common.legal.privacyPolicy');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose dark:prose-invert prose-slate max-w-none">
          <h1>{privacyPolicy('title')}</h1>
          <p>{privacyPolicy('lastUpdate')}: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>{sections('dataCollection.title')}</h2>
            <p>{sections('dataCollection.intro')}</p>

            <h3>{sections('dataCollection.collectedInfo.title')}</h3>
            <ul>
              <li>{sections('dataCollection.collectedInfo.items.email')}</li>
              <li>{sections('dataCollection.collectedInfo.items.google')}</li>
              <li>{sections('dataCollection.collectedInfo.items.content')}</li>
            </ul>

            <h3>{sections('dataCollection.dataUsage.title')}</h3>
            <p>{sections('dataCollection.dataUsage.intro')}</p>
            <ul>
              <li>{sections('dataCollection.dataUsage.items.account')}</li>
              <li>{sections('dataCollection.dataUsage.items.quality')}</li>
              <li>{sections('dataCollection.dataUsage.items.support')}</li>
            </ul>
          </section>

          <section>
            <h2>{sections('security.title')}</h2>
            <p>{sections('security.content')}</p>
          </section>

          <section>
            <h2>{sections('thirdParty.title')}</h2>
            <p>{sections('thirdParty.intro')}</p>
            <ul>
              <li>{sections('thirdParty.items.google')}</li>
              <li>{sections('thirdParty.items.supabase')}</li>
            </ul>
          </section>

          <section>
            <h2>{sections('dataDeletion.title')}</h2>
            <p>{sections('dataDeletion.content')}</p>
          </section>

          <section>
            <h2>{sections('contact.title')}</h2>
            <p>{sections('contact.content')}</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-violet-600 dark:text-violet-400 hover:underline"
          >
            {common('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}