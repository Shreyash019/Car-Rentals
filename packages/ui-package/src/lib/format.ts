export type PriceFormatOptions = {
  /** ISO currency code. Default "INR". */
  currency?: string;
  /** Default "en-IN" (₹1,23,456 grouping). */
  locale?: string;
  /** Fixed decimals. Default: 0 for whole numbers, else 2. */
  decimals?: number;
};

export function formatPrice(amount: number, { currency = "INR", locale = "en-IN", decimals }: PriceFormatOptions = {}) {
  const digits = decimals ?? (Number.isInteger(amount) ? 0 : 2);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
