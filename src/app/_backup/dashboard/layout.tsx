"use client";
import React, { useState } from "react";
import { ContentProvider } from "@/context/ContentContext";
import Sidebar from "@/components/layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ContentProvider>
      <div className="flex bg-background-light dark:bg-background-dark">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center w-10 h-10 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 dark:text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex flex-col">
            <div className="bg-white dark:bg-gray-800 p-4 flex-1 overflow-y-auto">
              <Sidebar />
              <button
                className="text-white bg-red-500 dark:bg-red-600 px-4 py-2 rounded-lg mt-4 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-8">
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </div>
      </div>
    </ContentProvider>
  );
}