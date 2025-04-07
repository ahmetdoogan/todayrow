"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Inter } from "next/font/google";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mail, MessageCircle, Clock, Send, MapPin, PhoneCall, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// En başta fontları yüklüyoruz
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Simulate form submission
    setTimeout(() => {
      // Success simulation - in production, you'd handle actual form submission here
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset form status after some time
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-[#111111] ${inter.variable} font-sans`}>
      <NavBar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 bg-white dark:bg-[#111111] relative z-10">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-medium text-gray-900 dark:text-white mb-6 text-4xl md:text-5xl">
                {t("common.navigation.login") === "Giriş" ? (
                  <>İletişim</>
                ) : (
                  <>Contact <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-gray-900 dark:text-white">Us</span></>
                )}
              </h1>
              
              {/* Font yükleme */}
              <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
              `}</style>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("pages.contact.description")}
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="bg-white dark:bg-[#161616] rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors duration-300">
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* Contact us via email */}
                  <div className="group bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                         mixBlendMode: 'multiply',
                       }}
                    />
                    <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
                         mixBlendMode: 'soft-light',
                       }}
                    />
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-4 text-center group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                      {t("pages.contact.email.title")}
                    </h2>
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <p className="font-medium text-gray-900 dark:text-white text-lg mb-2 text-center">
                        {t("pages.contact.email.address")}
                      </p>
                      <a 
                        href={`mailto:${t("pages.contact.email.address")}`}
                        className="inline-flex items-center justify-center px-3 md:px-5 py-1.5 md:py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black border border-transparent dark:border-gray-300 rounded-xl font-medium transition-colors text-sm md:text-base group"
                      >
                        <Mail className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        {t("pages.contact.email.button")}
                      </a>
                    </div>
                  </div>

                  {/* Follow us */}
                  <div className="group bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out dark:hidden opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 30%, transparent 70%)`,
                         mixBlendMode: 'multiply',
                       }}
                    />
                    <div className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out hidden dark:block opacity-0 group-hover:opacity-100" 
                       style={{
                         background: `radial-gradient(circle 120px at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 70%)`,
                         mixBlendMode: 'soft-light',
                       }}
                    />
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-4 text-center group-hover:-translate-y-1 transition-transform duration-300 relative z-10">
                      {t("pages.contact.followUs.title")}
                    </h2>
                    <div className="flex flex-col items-center relative z-10">
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        {t("pages.contact.followUs.description")}
                      </p>
                      <div className="flex justify-center gap-4">
                        {/* Twitter/X */}
                        <a href="https://x.com/todayrowapp" target="_blank" rel="noopener noreferrer" className="group/social bg-gray-200 dark:bg-[#222222] hover:bg-gray-300 dark:hover:bg-[#2a2a2a] p-3 rounded-full transition-colors">
                          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover/social:-translate-y-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                          </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/todayrow" target="_blank" rel="noopener noreferrer" className="group/social bg-gray-200 dark:bg-[#222222] hover:bg-gray-300 dark:hover:bg-[#2a2a2a] p-3 rounded-full transition-colors">
                          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover/social:-translate-y-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Form Side */}
                  <div className="md:col-span-2 bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300">
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
                      {t("pages.contact.form.title")}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.form.name")}</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white dark:bg-[#222222] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all outline-none dark:hover:border-gray-600 dark:focus:border-gray-600"
                          placeholder={t("pages.contact.form.namePlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.form.email")}</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white dark:bg-[#222222] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all outline-none dark:hover:border-gray-600 dark:focus:border-gray-600"
                          placeholder={t("pages.contact.form.emailPlaceholder")}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.form.message")}</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-2 bg-white dark:bg-[#222222] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all outline-none resize-none dark:hover:border-gray-600 dark:focus:border-gray-600"
                          placeholder={t("pages.contact.form.messagePlaceholder")}
                          required
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={formStatus === "submitting"}
                          className="px-6 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {formStatus === "submitting" ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t("pages.contact.form.sending")}
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {t("pages.contact.form.sendButton")}
                            </>
                          )}
                        </button>
                        
                        {formStatus === "success" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg flex items-center text-green-700 dark:text-green-400"
                          >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t("pages.contact.form.successMessage")}
                          </motion.div>
                        )}
                        
                        {formStatus === "error" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center text-red-700 dark:text-red-400"
                          >
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {t("pages.contact.form.errorMessage")}
                          </motion.div>
                        )}
                      </div>
                    </form>
                  </div>
                  
                  {/* Contact Info Side */}
                  <div className="bg-gray-50 dark:bg-[#191919] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300">
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
                      {t("pages.contact.info.title")}
                    </h2>
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.info.location.title")}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{t("pages.contact.info.location.value")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.info.email.title")}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{t("pages.contact.email.address")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.info.hours.title")}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{t("pages.contact.info.hours.weekdays")}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{t("pages.contact.info.hours.weekend")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.contact.info.response.title")}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{t("pages.contact.info.response.value")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
