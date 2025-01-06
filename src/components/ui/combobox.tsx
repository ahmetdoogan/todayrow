"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  onAdd?: (value: string) => void
  options: { name: string; count: number }[]
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder: string
  emptyText?: string
  className?: string
}

export function Combobox({
  value,
  onChange,
  onAdd,
  options,
  searchTerm,
  onSearchChange,
  placeholder,
  emptyText = "Sonuç bulunamadı.",
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`${placeholder} ara...`}
            value={searchTerm}
            onValueChange={onSearchChange}
          />
          <CommandEmpty className="p-2">
            {emptyText}
            {onAdd && searchTerm && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-sm"
                onClick={() => {
                  onAdd(searchTerm);
                  setOpen(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                &quot;{searchTerm}&quot; ekle
              </Button>
            )}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.name}
                value={option.name}
                onSelect={() => {
                  onChange(option.name);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1">{option.name}</span>
                <span className="text-sm text-gray-500">({option.count})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}