"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./ThemeProvider";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
        style={{ zIndex: 10000 }}
        toastStyle={{
          borderRadius: "1rem",
          boxShadow: theme === 'dark' 
            ? '0 2px 8px rgba(255, 255, 255, 0.08)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
          backgroundColor: theme === 'dark' ? 'rgb(15 23 42)' : 'white',
          color: theme === 'dark' ? 'white' : 'rgb(15 23 42)'
        }}
        className="!mb-2"
      /> 
    </>
  );
}