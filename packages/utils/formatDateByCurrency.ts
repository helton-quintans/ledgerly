import type { Currency } from "@ledgerly/schemas";

export function formatDateByCurrency(date: Date, currency: Currency): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format
  };

  // For USD and EUR, use US format (MM/DD/YYYY, HH:MM:SS)
  // For BRL, use Brazilian format (DD/MM/YYYY, HH:MM:SS)
  const locale = (currency === "USD" || currency === "EUR") ? "en-US" : "pt-BR";
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}