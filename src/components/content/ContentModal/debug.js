/*
Bu dosya hata ayıklama için kullanılabilecek kodları içerir.

ContentModal/index.tsx dosyasının handleSubmit fonksiyonuna eklenebilecek debug kodları:

// "YYYY-MM-DD" formatındaki date string'ini ve "HH:mm" formatındaki timeFrame string'ini parçalayalım ve değerleri loglayalım
console.log('Form date değeri:', date);
console.log('Form timeFrame değeri:', timeFrame);

const [year, month, day] = date.split('-').map(Number);
const [hrs, mins] = timeFrame.split(':').map(Number);
console.log(`Parçalanmış değerler - Yıl: ${year}, Ay: ${month}, Gün: ${day}, Saat: ${hrs}, Dakika: ${mins}`);

// Yerel zaman olarak yeni bir Date nesnesi oluşturuyoruz.
const localTimestamp = new Date(year, month - 1, day, hrs || 0, mins || 0, 0, 0);
console.log('Oluşturulan yerel zaman nesnesi:', localTimestamp.toString());

// localTimestamp.toISOString() UTC zamanını üretir.
const isoDate = localTimestamp.toISOString();
console.log('ISO formatına çevrilmiş UTC zamanı:', isoDate);
console.log('Bu UTC zamanı tekrar yerel gösterimde:', new Date(isoDate).toString());
*/
