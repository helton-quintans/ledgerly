import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPrompt(): string {
  return `These are existing design system styles and files. Please utilize them alongside base components to build. 

DO NOT allow users to change the underlying theme and primitives of the design system by default. If a user deliberately asks to change the design system, warn the user and only proceed upon acknowledgement.
`;
}

import type { Currency } from "@/lib/schemas/transaction";

export function formatCurrencyFromCents(amount_cents: number, currency: Currency) {
  const value = (amount_cents || 0) / 100;
  const locale = currency === "USD" ? "en-US" : currency === "EUR" ? "de-DE" : "pt-BR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value as number);
}
