# Todayrow Analytics Dashboard Kurulumu

## 1. Ana Metrikler Paneli

Google Analytics'te "Özel Raporlar" bölümüne gidin ve aşağıdaki panelleri oluşturun:

### Kullanıcı Aktivitesi Paneli
- Aktif Kullanıcılar
- Yeni Kayıtlar
- Oturum Süreleri
- Özellik Kullanım Oranları

Metrikler:
- user_id
- session_duration
- feature_usage_count

Boyutlar:
- Event Category
- Event Action
- User Type

### Özellik Kullanım Paneli
- Dashboard Kullanımı
- İçerik Planlama
- Not Alma
- Takvim Kullanımı

Metrikler:
- feature_view
- feature_use
- time_spent

### Dönüşüm İzleme Paneli
- Trial Başlangıçları
- Premium Dönüşümler
- Ödeme Başarı Oranı
- Churn Oranı

## 2. Özel Segment Oluşturma

### Power Users Segmenti
Koşullar:
- Son 7 günde 5'ten fazla oturum
- Ortalama oturum süresi > 10 dakika
- En az 3 farklı özellik kullanımı

### Trial Users Segmenti
Koşullar:
- Trial başlangıcından bu yana < 14 gün
- Premium özellik görüntüleme var

### Premium Users Segmenti
Koşullar:
- Başarılı ödeme eventi var
- Aktif abonelik durumu

## 3. Özel Dönüşüm Hedefleri

1. Free Trial Hedefi:
   - Başlangıç: Kayıt olma
   - Orta: Dashboard görüntüleme
   - Son: Trial başlatma

2. Premium Dönüşüm Hedefi:
   - Başlangıç: Premium plan görüntüleme
   - Orta: Ödeme sayfası
   - Son: Başarılı ödeme

## 4. Cohort Analizi Ayarları

Acquisition cohortları için:
- Cohort Size: Month
- Metric: User retention
- Date range: Last 3 months

## 5. Önemli Custom Dimensions

1. User Properties:
   - user_type (free/trial/premium)
   - registration_date
   - last_login_date

2. Session Properties:
   - features_used
   - session_value
   - device_type

## 6. Özel Alertler

1. Kritik Metrikler için:
   - Daily active users < threshold
   - Failed payments > threshold
   - Error rates > threshold

2. Büyüme Metrikleri için:
   - New user registration spike
   - Premium conversion spike
   - Churn rate anomaly

## Günlük Kontrol Listesi

1. Kullanıcı Aktivitesi:
   - Aktif kullanıcı sayısı
   - Yeni kayıtlar
   - Ortalama oturum süresi

2. Özellik Kullanımı:
   - En çok kullanılan özellikler
   - Feature adoption rate
   - Kullanıcı başına özellik kullanımı

3. Dönüşümler:
   - Trial conversion rate
   - Premium conversion rate
   - Churn signals

4. Performans:
   - Sayfa yükleme süreleri
   - Hata oranları
   - API yanıt süreleri