"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const options = [
  { value: "USD", label: "USD", flag: "🇺🇸" },
  { value: "EUR", label: "EUR", flag: "🇪🇺" },
  { value: "BRL", label: "BRL", flag: "🇧🇷" },
];

export default function CurrencySelector({ value, onChange }: Props) {
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="mr-2 text-lg leading-none">{current.flag}</span>
          {current.label}
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
