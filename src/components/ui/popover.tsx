import React from "react";

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ open, onOpenChange, ...props }: PopoverProps) {
  return <div {...props} />;
}

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverTrigger({ asChild, ...props }: PopoverTriggerProps) {
  return <button {...props} />;
}

export function PopoverContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}