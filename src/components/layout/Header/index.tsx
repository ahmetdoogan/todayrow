"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardHeader from './components/DashboardHeader';
import BaseHeader from './components/BaseHeader';
import NotesHeader from './components/NotesHeader';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  setIsModalOpen: (value: boolean) => void;
  notesData?: {
    notes: any[];
    setNotes: () => Promise<void>;
    isSelectionMode: boolean;
    setIsSelectionMode: (value: boolean) => void;
    selectedNotes: number[];
    setSelectedNotes: React.Dispatch<React.SetStateAction<number[]>>;
  };
}

const Header: React.FC<HeaderProps> = (props) => {
  const pathname = usePathname();
  
  switch(pathname) {
    case '/dashboard':
      return <DashboardHeader {...props} />;
    case '/dashboard/notes':
      if (props.notesData) {
        return <NotesHeader 
          darkMode={props.darkMode} 
          toggleTheme={props.toggleTheme}
          {...props.notesData}
        />;
      }
      return <BaseHeader darkMode={props.darkMode} toggleTheme={props.toggleTheme} />;
    case '/dashboard/calendar':
    case '/dashboard/settings':
      return <BaseHeader darkMode={props.darkMode} toggleTheme={props.toggleTheme} />;
    default:
      return <DashboardHeader {...props} />;
  }
};

export default Header;