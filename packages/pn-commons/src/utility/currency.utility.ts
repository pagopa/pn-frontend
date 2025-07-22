const euro = Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

export function formatCurrency(currency: number) {
  return euro.format(currency);
}

export function formatEurocentToCurrency(eurocent: number) {
  return formatCurrency(eurocent / 100);
}

export function formatEurocentToCurrencyText(eurocent: number) {
  const htmlValue = formatEurocentToCurrency(eurocent);
  return htmlValue.replace(/\u00A0/g, ' ');
}
