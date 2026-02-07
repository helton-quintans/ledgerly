"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import type { Currency } from "@ledgerly/schemas";

type Props = {
  value: Currency;
  onChange: (v: Currency) => void;
  className?: string;
};

const options: { value: Currency; label: string; flag: string }[] = [
  { value: "USD", label: "USD", flag: "🇺🇸" },
  { value: "EUR", label: "EUR", flag: "🇪🇺" },
  { value: "BRL", label: "BRL", flag: "🇧🇷" },
];

export default function CurrencySelector({ value, onChange, className }: Props) {
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          <span className="text-lg leading-none">{current.flag}</span>
          {current.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)}>
            <span className="mr-2 text-lg leading-none">{o.flag}</span>
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
