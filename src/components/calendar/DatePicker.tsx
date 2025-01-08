"use client";
import React from "react";
import ReactCalendar, { CalendarProps } from "react-calendar";
import { useContent } from "@/context/ContentContext";

export default function CalendarView() {
  const {
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    months
  } = useContent();

  // React-Calendar'ın tipine göre "CalendarProps['onChange']" şeklinde yazarsak
  // TS doğru fonksiyon imzasını beklediğini anlar.
  const handleDateChange: CalendarProps["onChange"] = (value, event) => {
    // value bazen tek bir Date, bazen de [Date, Date] (Range) olabiliyor
    if (Array.isArray(value)) {
      // Bir aralık seçildiyse ilk tarihi alalım (veya başka mantık kurabilirsin)
      setSelectedDate(value[0] || null);
    } else {
      // Tek tarih seçimi
      setSelectedDate(value || null);
    }
    // event argümanını kullanmak istersen burada kullanabilirsin
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-fit">
      <h2 className="text-lg font-semibold mb-4">Tarih Seç</h2>
      <ReactCalendar
        onChange={handleDateChange}       // Artık doğrudan setSelectedDate yerine wrapper kullanıyoruz
        value={selectedDate}
        className="mb-4"
        locale="tr-TR"
        calendarType="iso8601"
        formatShortWeekday={(locale, date) =>
          ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][
            date.getDay() === 0 ? 6 : date.getDay() - 1
          ]
        }
      />

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
      >
        <option value="">Tüm Aylar</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {new Date(month).toLocaleString("tr-TR", {
              year: "numeric",
              month: "long"
            })}
          </option>
        ))}
      </select>

      <button
        onClick={() => setSelectedDate(null)}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Tüm Tarihler
      </button>
    </div>
  );
}
