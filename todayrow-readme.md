## Typecheck Hataları (25 Mart 2025)
- `npm run typecheck` komutunda 5 dosyada 9 hata tespit edildi
- Landing ve auth sayfalarında tip tanımlamalarında düzeltmeler yapılması gerekiyor
- Bazı bileşenlerde eksik prop tanımlamaları mevcut
- next-intl çeviri namespace'lerinde tutarsızlıklar giderilmeli
- Deploy öncesinde bu hataların tamamının çözülmesi planlanıyor

### Landing ve Auth Sayfaları Güncellenmesi (25 Mart 2025)
- Mevcut landing sayfası yeni landing tasarımıyla değiştirildi (new-landing içeriklerini src/app/page.tsx'e taşıdık)
- Yeni landing komponentleri src/components/landing/ altına taşındı
- Auth sayfaları yeni tasarımlarla güncellendi (login, signup, forgot-password, reset-password, verify sayfaları)
- Google logosu login ve signup sayfalarında düzenlendi, gerçek logo kullanıldı
- Şifre sıfırlama sürecindeki çeviri eksiklikleri giderildi
- Supabase email template'leri şifre sıfırlama için güncellendi, doğru URL yapısı kullanıldı
- Auth layout.tsx dosyasındaki genişlik kısıtlaması kaldırıldı (max-w-md -> w-full)

# TodayRow - Planlama, İçerik ve Not Alma Web Uygulaması

*Son güncelleme: 25.03.2025*

### Assistant için Önemli Hatırlatmalar

- Tüm açıklamalar teknik bilgisi olmayan bir kullanıcıya anlatılır gibi basit ve net olmalı
- Her senaryoda en kötü durum da düşünülerek planlama yapılmalı
- MCP ile tüm dosyalara erişim mevcut, gereksiz izin istemeye gerek yok
- Herhangi bir şey düzenlemeden önce daima `search_files` veya `read_file` komutları kullanılmalı
- Büyük dosyalar için `write_file` yerine `edit_file` tercih edilmeli (limit sorunu ve olası donmalar nedeniyle)
- Projenin teknik bilgisi olmayan kişiler tarafından yönetildiği unutulmamalı, tüm açıklamalar buna göre yapılmalı

### Çalışma Prensipleri ve Teknik Notlar

#### Kod Geliştirme
- Kod güncellemeleri tam yapılmalı, yorum satırları ile kısaltma yapılmamalı
- İlgili konuda çalışmaya başlamadan önce mutlaka tüm ilgili dosyalar incelenmeli
- Kod eklerken gerekli import'lar unutulmamalı
- Her değişiklik öncesi potansiyel çakışmalar kontrol edilmeli

#### Veritabanı ve Backend
- Supabase ile ilgili işlemlerde mutlaka önce SQL sorguları çalıştırılıp tablolar ve policies kontrol edilmeli
- Edge functions ve webhook'larda değişiklik yapılırken çok dikkatli olunmalı

#### UI ve Tasarım
- Stilleme yaparken dikkatli olunmalı, özellikle dark mode sorunları oluşabilir
- Yeni UI değişikliklerinde ShadCN UI tasarım sistemi tercih edilmeli
- UI güncellemeleri önce izole bir ortamda test edilmeli

#### Çeviri ve Lokalizasyon
- Çeviri sistemi (next-intl) her zaman doğru şekilde kullanılmalı
- Yeni eklenen her UI metni için `messages` klasöründeki `tr.json` ve `en.json` dosyalarına çeviriler eklenmelidir
- Çeviri anahtarları nested yapıda ve mantıklı bir hiyerarşi ile düzenlenmeli

#### Tasarım Vizyonu
- Uygulama, ShadCN UI bileşenleri kullanılarak daha modern bir tasarıma doğru evrilmektedir
- Giriş sayfaları ve landing sayfası öncelikli olarak yenilenmiştir
- Gelecekte iç sayfalarda da tasarımsal iyileştirmeler planlanmaktadır

## Proje Durumu

TodayRow şu anda **canlıda** ve kullanıcılar tarafından aktif olarak kullanılmaktadır. Proje bir SaaS ürünü haline gelmiş olup, ücretli üyelik sistemi (Pro Plan) entegre edilmiştir. Tüm yeni kullanıcılara 14 günlük ücretsiz Pro deneme süresi sunulmaktadır.

## Proje Özeti

TodayRow, profesyonellerin günlük ve ertesi gün planlarını yönetmelerine, notlarını düzenlemelerine ve (ek olarak) sosyal medya içeriklerini planlamalarına yardımcı olan bir web uygulamasıdır. Ana odak noktası planlamadır. Hedef kitle girişimciler, startup sahipleri, yöneticiler, freelancerlar ve planlı yaşamak isteyen kişilerdir.

## Temel Özellikler

### 1. Planla (Dashboard - Ana Sayfa)
- **Sadece bugün ve yarın için** plan oluşturma (odaklanmayı teşvik etmek için)
- Plan oluşturma yöntemleri:
  1. Sidebar'daki "Plan Oluştur" butonu ile
  2. Plan listesi boşsa görünen "Plan Oluştur" butonu ile
  3. Saat aralıklarında hover yapınca beliren butonlarla
  4. Mevcut planı sürükleyip başka bir saat aralığına bırakarak
  5. Hazır planları sürükleyip bırakarak (En çok teşvik edilen yöntem)
- Hazır plan şablonları (5 default + özelleştirilebilir)
- Öncelik ayarları (Low, Medium, High) ve renk kodlaması
- Plan tamamlama takibi
- E-posta ile hatırlatma sistemi (10-30-60 dk öncesi)

### 2. Notlar
- Hızlı not alma
- Not pinleme (drag & drop)
- Düzenleme ve silme özelliği
- Not oluşturma yöntemleri:
  1. Sidebar'daki "Not Oluştur" butonu ile
  2. Not sayfası boşsa görünen "Not Oluştur" butonu ile

### 3. İçerikler
- LinkedIn ve diğer sosyal medya içerikleri için planlama
- Takvime bağlama
- İçerik durumu takibi
- İçerik oluşturma yöntemleri:
  1. Sidebar'daki "İçerik Oluştur" butonu ile
  2. İçerik sayfası boşsa görünen "İçerik Oluştur" butonu ile

### 4. Ayarlar
- Tema yönetimi (Dark/Light mode)
- Kullanıcı tercihleri
- Profil bilgisi düzenleme

### 5. Ödeme ve Üyelik Sistemi
- 14 günlük ücretsiz Pro deneme süresi
- Aylık (3$) ve yıllık (30$) ödeme seçenekleri
- Üyelik durumu göstergeleri (sidebar ve profil sayfasında)
- Üyelik sonlandığında "soft paywall" uygulaması

## Teknik Altyapı

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- ShadCN UI (Yeni tasarımlarda)

### Backend & Servisler
- Supabase (Authentication ve PostgreSQL veritabanı)
- Supabase Edge Functions (Plan hatırlatıcıları için)
- Vercel (Hosting ve Cron Jobs)
- Google Workspace (SMTP mail gönderimi - hello@todayrow.app)
- Polar.sh (Ödeme sistemi)
- Google Analytics

### Mail Sistemi
- **Supabase Email Templates (2 adet):**
  - Kayıt onaylama maili
  - Şifre sıfırlama maili
- **Özel Mail Gönderimleri (6 adet):**
  - Welcome maili
  - Pro iptal maili
  - Deneme süresi uyarı maili
  - Plan hatırlatma maili
  - vb.
- **Cron Jobs (2 adet - Vercel Hobby plan sınırı):**
  - check-subscription.ts (Sabah 9'da)
  - check-trials.ts (Sabah 10'da)

## Dosya Yapısı ve Kritik Dosyalar

### Ana Dizin Yapısı

Proje dizini: `/users/ahmetdogan/linkedin-content-planner/linkedin-planner`

### Detaylı Klasör Yapısı

- `app` - Sayfalar ve rotalar (Next.js App Router yapısı)
  - `auth` - **Mevcut** giriş/kayıt/şifre sayfaları (canlıda aktif olan)
  - `auth-new` - Yeni tasarlanmış giriş/kayıt/şifre sayfaları (canlıya henüz alınmadı)
  - `auth-new kopyası` - Yedek dosyalar (geçici)
  - `dashboard` - Ana planlama sayfası ve alt sayfalar
    - `page.tsx` - Ana planlama sayfası
    - `calendar` - Takvim görünümü
    - `contents` - İçerik sayfası
    - `notes` - Notlar sayfası
    - `settings` - Ayarlar ve profil sayfası
    - `feature-requests` - Özellik istekleri sayfası
    - `focus/` - Pomodoro/Focus timer sayfası (Mart 2025)
      - `page.tsx` - Ana focus timer sayfası
  - `new-landing` - Yeni ana sayfa tasarımı (canlıya henüz alınmadı)
    - `components` - Yeni landing sayfası bileşenleri
    - `yedekler` - Yedek sayfalar (geçici)
  - `legal` - Yasal sayfalar (Gizlilik Politikası ve Kullanım Şartları)
  - `page.tsx` - Mevcut ana sayfa (landing)
  - `paywall` - Ödeme duvarı sayfası
  - `upgrade` - Üyelik yükseltme sayfası

- `components` - Yeniden kullanılabilir bileşenler
  - `RootLayoutClient.tsx` - Yetkilendirme ve yönlendirme kontrolü (middleware yerine)
  - `auth` - Kimlik doğrulama bileşenleri
  - `planner` - Planlama sayfası bileşenleri
    - `PlanCard` - Plan kartı görünümü
    - `PlanForm` - Plan oluşturma/düzenleme formu
    - `PlanList` - Plan listesi
    - `PlanModal` - Plan oluşturma/düzenleme modalı
    - `QuickPlans` - Hazır planlar bileşenleri
  - `notes` - Not bileşenleri
  - `content` - İçerik bileşenleri
  - `focus` - Pomodoro/Focus timer bileşenleri (Mart 2025)
    - `PomodoroTimer.tsx` - Zamanlayıcı bileşeni
    - `TaskList.tsx` - Görev listesi
    - `TaskItem.tsx` - Tekil görev öğesi
    - `TaskForm.tsx` - Görev ekleme/düzenleme formu
    - `ProjectSelector.tsx` - Proje yönetimi
    - `StatsDisplay.tsx` - İstatistik gösterimi
    - `SettingsModal.tsx` - Pomodoro ayarları
  - `layout` - Düzen bileşenleri
    - `Header` - Üst menü bileşenleri
      - `FocusHeader.tsx` - Focus sayfası üst menüsü
    - `Sidebar` - Yan menü bileşenleri
  - `ui` - Temel UI bileşenleri (buton, input, logo, vs.)

- `context` - React context dosyaları
  - `AuthContext.tsx` - Kimlik doğrulama context
  - `ContentContext.tsx` - İçerik context
  - `NotesContext.tsx` - Notlar context
  - `PlannerContext.tsx` - Planlama context
  - `FocusContext.tsx` - Pomodoro/Focus Timer context

- `pages/api` - API rotaları
  - `email` - Email gönderim fonksiyonları
    - `sendProCancelled.ts`
    - `sendProStarted.ts`
    - `sendSubscriptionExpired.ts`
    - `sendTrialEnded.ts`
    - `sendTrialWarning.ts`
    - `sendWelcome.ts`
  - `cron` - Cron job fonksiyonları
    - `check-subscription.ts`
    - `check-trials.ts`
  - `checkout.ts` - Ödeme işlemi
  - `open-portal.ts` - Ödeme portalı
  - `polar-webhook.ts` - Polar.sh webhook'u

- `hooks` - Özel React hook'ları
  - `useProfile.ts` - Profil bilgilerine erişim
  - `useSubscription.ts` - Abonelik bilgilerine erişim
  - `useKeyboardShortcuts.ts` - Klavye kısayolları

- `services` - Servis fonksiyonları
  - `contentService.ts` - İçerik servisleri
  - `plannerService.ts` - Planlama servisleri
  - `notes.ts` - Not servisleri
  - `profile.ts` - Profil servisleri
  - `focus/` - Pomodoro/Focus timer servisleri
    - `taskService.ts` - Görev işlemleri
    - `projectService.ts` - Proje işlemleri
    - `sessionService.ts` - Oturum işlemleri
    - `settingsService.ts` - Pomodoro ayarları

- `messages` - Çoklu dil desteği
  - `en.json` - İngilizce çeviriler
  - `tr.json` - Türkçe çeviriler

- `styles` - CSS dosyaları
  - `globals.css` - Genel stiller ve Tailwind ayarları

- `types` - TypeScript tip tanımlamaları
  - `content.ts` - İçerik tipleri
  - `notes.ts` - Not tipleri
  - `planner.ts` - Planlama tipleri
  - `profile.ts` - Profil tipleri
  - `subscription.ts` - Abonelik tipleri
  - `focus.ts` - Pomodoro/Focus timer tipleri

- `utils` - Yardımcı fonksiyonlar
  - `dateUtils.ts` - Tarih işlemleri
  - `supabaseClient.ts` - Supabase bağlantısı
  - `constants.ts` - Sabit değerler
  - `notificationHelper.ts` - Bildirim ve ses yardımcısı

## Devam Eden Geliştirmeler

### Focus/Pomodoro İstatistikleri İyileştirmeleri
- İstatistik panelindeki başarımlar (achievements) bölümü için daha kapsamlı bir oyunlaştırma sistemi planlanıyor
  - 3-Gün seri tamamlama, 1-Hafta seri tamamlama, 1-Ay seri tamamlama vb. başarımlar eklenecek
  - Başarımlar için gerçek zamanlı veri analizi ve kullanıcıya bildirim mekanizması geliştirilecek
  - Kullanıcıların kendi günlük hedeflerini ayarlayabileceği bir ayarlar sayfası eklenecek
- Haftalık özet grafiğinin gerçek verilerle daha detaylı gösterimi için backend desteği
- Son yapılan güncellemeler (22 Mart 2025):
  - Mobil görünümde checkbox'ların dairesel görünümü düzeltildi (`min-w-[1.25rem] min-h-[1.25rem]` eklendi)
  - Task ve Project görünümlerindeki butonların aralığı düzenlendi (daha kompakt hale getirildi - `gap-0.5`)
  - Hover animasyonları daha akıcı ve tutarlı hale getirildi
  - Görev ve projelerde metin hizalamaları iyileştirildi
  - İstatistikler açılır-kapanır (collapable) hale getirildi
  - Dinamik günlük hedef sistemine geçildi: Kullanıcının deneyimine göre günlük hedef belirleniyor
  - Haftalık özet artık veritabanından gelen gerçek verileri kullanıyor
  - "Günlük Hedef" yerine daha nedenötral ifade olan "Günlük İlerleme" kullanımına geçildi
  - Çeşitli UI iyileştirmeleri
  - Görevler ve projeler için detail görüntüsü eklendi
  - Görev ve proje detayları için açılır-kapanır panel eklendi
  - Açıklama alanı eklendi
  - Weekly Overview görünürlüğü iyileştirildi

#### Profil Sayfası İyileştirmeleri (22 Mart 2025)
- Profil fotoğrafının dairesel görünümü tüm mobil ekran boyutlarında korunacak şekilde düzeltildi (`min-w-[4rem] min-h-[4rem]`)
- Mobil görünümde email ve plan bilgisi gibi metin öğelerinin küçük ekranlarda daha kompakt görünmesi sağlandı
- Profil ve plan bilgilerindeki tüm metinler daha küçük ekranlar için optimize edildi (`text-[0.7rem]` mobil, `text-sm` tablet ve üzeri)

### Auth ve Landing Sayfaları Yenilenmesi
- Yeni landing sayfası tasarlandı (`app/new-landing`)
  - Mart 2025: Get Started butonunun dark/light mode kontrastı düzeltildi
  - Mart 2025: Hero section'a karakter görselleri smile şeklinde düzenli eklendi
  - Mart 2025: Feature kartlarına (Minimal Planning, Smart Reminders, Quick Notes) ilgili görsellerle desteklendi
  - Mart 2025: Dark mode arka plan renkleri tutarlı hale getirildi (#111111)
- Yeni auth sayfaları tasarlandı (`app/auth-new`)
- ShadCN UI kullanılarak modern tasarım oluşturuldu
- Henüz canlıya alınmadılar

### İçerik Sayfası Yeniden Konumlandırması
- İçerik sayfası ana odak noktası olmaktan çıkarılıp, notlar sayfasına entegre edilmesi veya sadeleştirilmesi planlanıyor
- Web uygulamasının planlama odaklı konumlandırması güçlendirilecek

### Pomodoro/Fokus Çalışma Özelliği
- Pomodoro tekniği kullanan bir odaklanma aracı eklendi (Mart 2025)
  - Temel Pomodoro işlevselliği (25 dk çalışma, 5 dk kısa mola, 15 dk uzun mola)
  - Görev ve proje yönetimi sistemi
  - Kullanıcı bazlı istatistikler ve görev tamamlama ölçümleri
  - İstatistik panelinde çalışma süreleri, tamamlanan görevler ve başarı ödülleri
  - Ayarlanabilir zamanlayıcı süreleri
  - Otomatik başlatma seçenekleri
  - Ses ve bildirim sistemi
  - Kompakt ve responsive kullanıcı arayüzü
- Pro üyelik özelliği olarak konumlandırıldı
- Focus Timer'ı, tamamlanan görevleri Plan sistemine entegre etme çalışmaları devam ediyor

## Supabase ve Veritabanı Yapısı

### Supabase Tabloları

#### Ana Tablolar
- `plans` - Kullanıcı planları (id, user_id, title, details, start_time, end_time, priority, vs.)
- `quick_plans` - Hazır plan şablonları (id, user_id, title)
- `profiles` - Kullanıcı profil bilgileri (id, first_name, last_name, title, linkedin, pomodoro_settings, vs.)
- `Notes` - Kullanıcı notları (id, title, content, is_pinned, user_id, vs.)
- `Content` - Kullanıcı içerikleri (id, title, date, type, format, platforms, vs.)
- `subscriptions` - Üyelik bilgileri
- `pomodoro_projects` - Pomodoro projeleri (Mart 2025)
- `pomodoro_tasks` - Pomodoro görevleri (Mart 2025)
- `pomodoro_sessions` - Pomodoro oturumları (Mart 2025)

#### Diğer Tablolar
- `user_hidden_plans` - Kullanıcıların gizlediği hazır planlar
- `cron_logs` - Cron job logları
- `deleted_users` - Silinen kullanıcı kayıtları
- `google_calendar_tokens` - Google Calendar entegrasyonu için tokenlar
- `feature_requests` - Özellik istekleri
- `webhook_logs` - Webhook logları

### Dikkat Edilmesi Gerekenler
- Supabase'de hem `auth.users` hem de `profiles` tablosu var, bu ikisi bazen karışabilir
- Supabase işlemlerinde RLS (Row Level Security) politikalarına dikkat edilmeli
- Yeni özellikler eklerken ilgili tablo ve politikalar kontrol edilmeli

### SEO ve Görünürlük Planlaması

#### Mevcut Durum
- `robots.txt` dosyası bulunuyor ve `/new-landing/` dizini arama motorlarından gizleniyor
- Henüz bir `sitemap.xml` dosyası bulunmuyor (robots.txt'de referans var ama oluşturulmamış)
- Yeni sayfalar (`auth-new`, `new-landing`) henüz arama motorlarından tamamen gizlenmemiş

#### Yapılacaklar
- Yeni sayfaları (`auth-new`, `new-landing`) arama motorlarından gizleme
- İleriki aşamalarda blog sayfası ekleme
- Meta etiketleri ve keywords için SEO optimizasyonu yapma

> Not: SEO konusu önemli ama mevcut önceliklerimiz arasında orta düzeyde. Önce diğer önceliği yüksek olan işlemleri tamamlayalım.

## Güncel Görevler ve Roadmap

### Öncelikli Görevler:
1. İçerik sayfasının yeniden konumlandırılması/iyileştirilmesi
   - Notlar ile birleştirme veya daha az öne çıkarma
   - UI'da iyileştirmeler

2. ~~Pomodoro/Fokus çalışma özelliğinin eklenmesi~~ ✅ Tamamlandı (Mart 2025)
   - Temel Pomodoro işlevselliği, görev ve proje yönetimi, istatistikler
   - İlerleyen süreçte Plan sayfası ile daha sıkı entegrasyon yapılacak

3. ~~Yeni landing ve auth sayfalarının canlıya alınması~~ ✅ Tamamlandı
   - ~~Mevcut auth sayfalarını güvenli şekilde değiştirme~~ ✅
   - ~~Landing sayfasının güncellenmesi~~ ✅
   
4. Blog sistemi genişletme ve yeni blog yazıları ekleme
   - Yeni içeriklerle blog kısmını zenginleştirme
   - SEO için kaliteli içerik üretimi

### Tamamlanan İşler - Güncel (5 Nisan 2025)

### 1. Focus Sayfası (CANLI)
- [x] ~~TaskItem'daki tamamlama butonunun mobilde dairesel görünmesi~~ ✅
- [x] ~~ProjectItem'daki renk noktasının mobilde dairesel görünmesi~~ ✅
- [x] ~~Butonlar arası boşlukların düzenlenmesi~~ ✅
- [x] ~~Görevler ve projeler bölümünün header kısmına küçük tooltip yardımları eklenebilir~~ ✅
- [x] ~~İstatistik bölümünün detaylı kontrolleri~~ ✅
- [x] ~~Pomodoro timer tamamlanma durumunda bildirim ve ses eklenmesi~~ ✅
- [x] ~~Üyeliği sona eren kullanıcılar için paywall uygulaması~~ ✅

### 2. Auth ve Landing Sayfaları (TAMAMLANMAK ÜZERE)
- [x] ~~Çevirilerin tamamlanması (next-intl ile sarmalanması)~~ ✅
- [x] ~~Landing sayfasının güncellenmesi~~ ✅
- [x] ~~Auth sayfalarının güncellenmesi~~ ✅
- [x] ~~Responsive görünüm için tüm ekran boyutlarında testler~~ ✅
- [ ] Dark/Light mode son kontroller ve arka plan renk uyum ayarlamaları
- [x] ~~Mevcut auth sayfalarından yenilerine geçiş için yönlendirme kontrolü~~ ✅

### 3. İçerik Sayfası Yeniden Konumlandırılması
- [ ] İçerik sayfasının konumu/kullanımı için nihai karar:
  - Notlar içine buton olarak entegre etme? 
  - Sidebar'da aynı kategoride gösterme?
  - Daha sönük bir şekilde mevcut halinde bırakma?
  - Tamamen iptal etme?
- [ ] Seçilen stratejiye göre UI değişikliklerinin yapılması

### 4. Deployment Kontrolleri
- [ ] Tüm sayfalar için `npm run typecheck` kontrolü
- [ ] Tüm gerekli çevirilerin tamamlanmış olması
- [ ] Karanlık/aydınlık mod geçişlerinde görsel sorunların kontrolü
- [ ] Farklı ekran boyutlarında (özellikle mobil) görünüm testleri

> **Not:** Focus sayfası ve özellikleri geliştirilmiş, test edilmiş ve başarıyla canlıya alınmıştır. Ek olarak, üyeliği biten kullanıcılar için Focus sayfasında paywall uygulaması da hayata geçirilmiştir. Şu an önceliğimiz auth/landing sayfalarının güncellenmesi ve içerik sayfasının konumlandırılması üzerinedir.

## Blog Sistemi

### Yeni Blog Yazısı Ekleme Süreci

1. **Blog Yazılarının Hazırlanması:**
   - Her blog yazısı hem Türkçe hem İngilizce dillerinde hazırlanmalıdır
   - Yazılar `.mdx` formatında olmalıdır
   - Dosyalar `blog-content/en` ve `blog-content/tr` klasörlerine eklenmelidir
   - Yazıların dosya isimleri anlamlı URL yapısına uygun olmalıdır (örn: `effective-daily-planning.mdx` ve `etkili-gunluk-planlama.mdx`)

2. **Çeviri Eşleştirmesi:**
   - İki dildeki blog yazılarını eşleştirmek için `src/lib/blog.ts` dosyasındaki `translationPairs` dizisine yeni çeviri çifti eklenmelidir
   - Örnek format: `{ en: 'effective-daily-planning', tr: 'etkili-gunluk-planlama' }`

3. **Kategori Eklemesi:**
   - Blog yazıları için yeni bir kategori oluşturulacaksa, bu kategorinin çevirileri çeviri dosyalarına eklenmelidir
   - **İngilizce çeviri için:** `/src/messages/en.json` dosyasındaki `blog.categories` altına yeni kategori eklenmelidir
   - **Türkçe çeviri için:** `/src/messages/tr.json` dosyasındaki `blog.categories` altına yeni kategori eklenmelidir
   - Örnek: Yeni bir "İş Stratejileri" kategorisi eklemek için:
     ```json
     "blog": {
       "categories": {
         "businessStrategies": "İş Stratejileri"
       }
     }
     ```
     İngilizce versiyonu için:
     ```json
     "blog": {
       "categories": {
         "businessStrategies": "Business Strategies"
       }
     }
     ```

4. **Meta Bilgileri:**
   - Her blog yazısı, başında meta bilgilerini içermelidir
   - Örnek meta bilgileri:
     ```mdx
     ---
     title: "Etkili Günlük Planlama Rutinleri"
     excerpt: "İş-yaşam dengesini korurken üretkenliği en üst düzeye çıkaran günlük rutinler nasıl oluşturulur?"
     date: "2025-04-01"
     author: "Ahmet Doğan"
     category: "timeManagement"
     image: "/images/blog/effective-daily-planning.jpg"
     ---
     ```

5. **İçerik Hazırlama:**
   - Blog içeriği Markdown formatında yazılmalıdır
   - Başlıklar, listeler, vurgular vb. için standart Markdown sözdizimi kullanılmalıdır
   - Gerekirse özel MDX bileşenleri eklenebilir (örn: CalloutBox, Blockquote, etc.)

6. **Görseller:**
   - Blog ile ilgili görseller `/public/images/blog/` klasörüne eklenmelidir
   - Görseller optimize edilmiş (uygun boyut ve sıkıştırma) olmalıdır
   - Her blog yazısı için en az bir öne çıkan görsel (featured image) hazırlanmalıdır

7. **Test Etme:**
   - Yeni blog yazısını ekledikten sonra, lokal geliştirme ortamında test edilmelidir
   - Hem Türkçe hem İngilizce versiyonların doğru görüntülendiğinden emin olunmalıdır
   - Kategori filtreleme, dil değiştirme ve bağlantıların doğru çalıştığı kontrol edilmelidir

8. **Yayınlama:**
   - Testler tamamlandıktan sonra değişiklikler ana branch'e merge edilmeli ve canlı ortama deploy edilmelidir

### Orta Vadeli Planlar:
1. ShadCN tasarım sisteminin tüm uygulamaya entegrasyonu
   - Sidebar tasarımının modernleştirilmesi
   - Form ve popup tasarımlarının yenilenmesi

2. Mobil deneyimin iyileştirilmesi
   - Responsive tasarım sorunlarının giderilmesi
   - Mobil-öncelikli özellikler

3. Kullanıcı deneyiminin iyileştirilmesi
   - Onboarding süreci
   - Yardım ve ipuçları

## Teknik Notlar

### Deployment Prosedürü
1. Değişikliklerin test edilmesi (typecheck dahil)
2. `git add .`
3. `git commit -m "Commit mesajı"`
4. `git push origin main`
5. Vercel otomatik deploy edecektir

### Olası Sorunlar ve Çözümleri
- **Dark Mode Sorunları:** Yeni bileşenler eklerken dark mode kontrolü yapılmalı
- **Typecheck Hataları:** Deployment öncesi kontrol edilmeli
- **Çeviri Eksiklikleri:** Yeni metinler için `messages` klasöründeki çeviri dosyaları güncellenmeli

---

*Bu README her konuşmada güncellenmektedir. Projede yapılan önemli değişiklikler, yeni özellikler ve güncel görevler burada kaydedilir.*
