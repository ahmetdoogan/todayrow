"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase entegrasyonu sonrası burada signup işlemi yapılacak
    console.log("Signup attempt:", { name, email, password });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">LinkedIn İçerik Planlayıcı</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Yeni hesap oluşturun</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">İsim</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kayıt Ol
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p>
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
}