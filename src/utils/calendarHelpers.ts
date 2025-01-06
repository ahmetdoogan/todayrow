// İki tarihin aynı güne ait olup olmadığını kontrol eder
export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// İki tarihin aynı haftaya ait olup olmadığını kontrol eder
export const isSameWeek = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Haftanın başlangıcını Pazartesi olarak ayarla
  const diff1 = d1.getDate() - d1.getDay() + (d1.getDay() === 0 ? -6 : 1);
  const diff2 = d2.getDate() - d2.getDay() + (d2.getDay() === 0 ? -6 : 1);
  
  const weekStart1 = new Date(d1.setDate(diff1));
  const weekStart2 = new Date(d2.setDate(diff2));
  
  return (
    weekStart1.getFullYear() === weekStart2.getFullYear() &&
    weekStart1.getMonth() === weekStart2.getMonth() &&
    weekStart1.getDate() === weekStart2.getDate()
  );
};

// İki tarihin aynı aya ait olup olmadığını kontrol eder
export const isSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

// Haftanın ilk gününü (Pazartesi) döndürür
export const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Haftanın son gününü (Pazar) döndürür
export const getWeekEnd = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff));
};

// Ayın ilk gününü döndürür
export const getMonthStart = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Ayın son gününü döndürür
export const getMonthEnd = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};