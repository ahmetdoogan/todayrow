"use client";

import * as React from "react";
// Radix UI Switch henüz yüklenmediği için daha basit bir switch oluşturalım

import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    // Kontrol edilmiş durumu takip ediyoruz
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-gray-900 dark:bg-gray-50" : "bg-gray-200 dark:bg-gray-800",
          className
        )}
        onClick={() => onCheckedChange?.(!checked)}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-white dark:bg-gray-950 shadow-lg transform transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
