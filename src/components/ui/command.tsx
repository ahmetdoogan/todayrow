import React from "react";

export function Command(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function CommandGroup(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onSelect?: () => void;
}

export function CommandItem({ value, onSelect, ...props }: CommandItemProps) {
  return <div {...props} />;
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export function CommandInput({ onValueChange, ...props }: CommandInputProps) {
  return <input
    {...props}
    onChange={(e) => onValueChange?.(e.target.value)}
  />;
}

export function CommandEmpty(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}