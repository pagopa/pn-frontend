const euro = Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

const euroRounded = Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(currency: number) {
  return euro.format(currency);
}

export function formatEurocentToCurrency(eurocent: number, round = false) {
  const value = eurocent / 100;
  const hasDecimals = eurocent % 100 !== 0;

  if (round && !hasDecimals) {
    return euroRounded.format(value);
  }

  return euro.format(value);
}
