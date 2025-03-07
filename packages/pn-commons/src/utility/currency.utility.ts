const euro = Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR"
});

export function formatCurrency(currency: number) {
  return euro.format(currency);
}

export function formatEurocentToCurrency(eurocent: number) {
  return formatCurrency(eurocent / 100);
}

export function formatStringToNumberCurrency(currency?: string): number | undefined {

  return currency ? parseFloat(parseFloat(currency).toFixed(2)) : undefined;
}

