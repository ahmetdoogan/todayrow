"use client";

import React from 'react';
import { PlannerProvider } from '@/context/PlannerContext';

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlannerProvider>
      {children}
    </PlannerProvider>
  );
}