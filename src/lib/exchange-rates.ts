import type { Currency } from "./schemas/transaction";

// Cache for exchange rates (valid for 1 hour)
let cachedRates: Record<Currency, number> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour 

/**
 * Fetches current exchange rates from a free API
 * Using exchangerate-api.com free tier (1500 requests/month)
 * Alternative: frankfurter.app (no API key needed, EU-based)
 */
export async function fetchExchangeRates(): Promise<Record<Currency, number>> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Using frankfurter.app (free, no API key, maintained by ECB)
    // Base currency is EUR by default
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=EUR,BRL",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
      },
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert to rates relative to USD
    const rates: Record<Currency, number> = {
      USD: 1,
      EUR: data.rates.EUR ?? 0.92, // fallback to approximate rate
      BRL: data.rates.BRL ?? 5.0,  // fallback to approximate rate
    };

    cachedRates = rates;
    cacheTimestamp = now;
    
    return rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    
    // Return fallback rates if API fails
    const fallbackRates: Record<Currency, number> = {
      USD: 1,
      EUR: 0.92,
      BRL: 5.0,
    };
    
    // Cache fallback for shorter duration (5 min)
    if (!cachedRates) {
      cachedRates = fallbackRates;
      cacheTimestamp = now - CACHE_DURATION + 5 * 60 * 1000; // 5min
    }
    
    return cachedRates || fallbackRates;
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amountCents: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): Promise<{ convertedAmountCents: number; exchangeRate: number }> {
  if (fromCurrency === toCurrency) {
    return { convertedAmountCents: amountCents, exchangeRate: 1 };
  }

  const rates = await fetchExchangeRates();
  
  // Convert: from -> USD -> to
  const amountInUSD = amountCents / rates[fromCurrency];
  const convertedAmountCents = Math.round(amountInUSD * rates[toCurrency]);
  const exchangeRate = rates[toCurrency] / rates[fromCurrency];

  return { convertedAmountCents, exchangeRate };
}

/**
 * Get current rate for display purposes
 */
export async function getExchangeRate(
  fromCurrency: Currency,
  toCurrency: Currency,
): Promise<number> {
  if (fromCurrency === toCurrency) return 1;
  
  const rates = await fetchExchangeRates();
  return rates[toCurrency] / rates[fromCurrency];
}
