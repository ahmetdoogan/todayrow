"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header/index";
import ContentCard from "@/components/content/ContentCard";
import ContentDetailPopup from "@/components/content/ContentDetailPopup";
import ContentModal from "@/components/content/ContentModal";
import { useContent } from "@/context/ContentContext";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { contents, filteredContents, selectedContent } = useContent();

  return (
    <>
      <Header 
        darkMode={theme === "dark"} 
        toggleTheme={toggleTheme} 
        setIsModalOpen={setIsModalOpen} 
      />

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
          />
        ))}
      </div>

      {/* Modals */}
      {selectedContent && <ContentDetailPopup />}

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}