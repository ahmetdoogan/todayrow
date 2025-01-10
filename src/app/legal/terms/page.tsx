"use client";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function TermsOfService() {
  const sections = useTranslations('common.legal.termsOfService.sections');
  const common = useTranslations('common.legal');
  const termsOfService = useTranslations('common.legal.termsOfService');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose dark:prose-invert prose-slate max-w-none">
          <h1>{termsOfService('title')}</h1>
          <p>{termsOfService('lastUpdate')}: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>{sections('serviceUsage.title')}</h2>
            <p>{sections('serviceUsage.content')}</p>

            <h3>{sections('serviceUsage.accountSecurity.title')}</h3>
            <p>{sections('serviceUsage.accountSecurity.content')}</p>
          </section>

          <section>
            <h2>{sections('userResponsibilities.title')}</h2>
            <p>{sections('userResponsibilities.intro')}</p>
            <ul>
              <li>{sections('userResponsibilities.items.legal')}</li>
              <li>{sections('userResponsibilities.items.copyright')}</li>
              <li>{sections('userResponsibilities.items.security')}</li>
              <li>{sections('userResponsibilities.items.privacy')}</li>
            </ul>
          </section>

          <section>
            <h2>{sections('contentRights.title')}</h2>
            <p>{sections('contentRights.content')}</p>
          </section>

          <section>
            <h2>{sections('serviceChanges.title')}</h2>
            <p>{sections('serviceChanges.content')}</p>
          </section>

          <section>
            <h2>{sections('pricing.title')}</h2>
            <p>{sections('pricing.content')}</p>
          </section>

          <section>
            <h2>{sections('accountCancellation.title')}</h2>
            <p>{sections('accountCancellation.content')}</p>
          </section>

          <section>
            <h2>{sections('limitations.title')}</h2>
            <p>{sections('limitations.content')}</p>
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