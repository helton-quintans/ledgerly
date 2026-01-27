import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import type { Currency } from "@ledgerly/schemas";

export function formatCurrencyFromCents(
  amount_cents: number,
  currency: Currency,
) {
  const value = (amount_cents || 0) / 100;
  const locale =
    currency === "USD" ? "en-US" : currency === "EUR" ? "de-DE" : "pt-BR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value as number);
}
