"use client";
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            LinkedIn İçeriklerinizi 
            <span className="text-blue-600"> Profesyonelce </span>
            Planlayın
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            İçeriklerinizi önceden hazırlayın, takvimde planlayın ve LinkedIn'de etkili bir varlık oluşturun.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ücretsiz Başlayın
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Özellikler</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="text-xl font-semibold mb-4">İçerik Planlaması</h3>
              <p className="text-gray-600 dark:text-gray-400">
                İçeriklerinizi önceden hazırlayın ve organize edin. Kartlar halinde düzenleyin ve kolayca yönetin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="text-xl font-semibold mb-4">Takvim Görünümü</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gün, hafta ve ay bazında içeriklerinizi planlayın. Takvim üzerinde kolayca düzenlemeler yapın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="text-xl font-semibold mb-4">Kolay Kullanım</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Modern ve kullanıcı dostu arayüz. Sürükle-bırak özelliği ve hızlı düzenleme imkanları.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Hemen Başlayın</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            LinkedIn içerik planlamanızı profesyonelleştirin ve daha etkili bir sosyal medya varlığı oluşturun.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Ücretsiz Hesap Oluşturun
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 LinkedIn İçerik Planlayıcı. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}