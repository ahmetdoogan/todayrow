"use client";
import Script from "next/script";

export default function GoogleOneTapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
      />
      {children}
    </>
  );
}