import { formatCurrency, formatEurocentToCurrency } from '../currency.utility';

describe('test currency formatting', () => {
  it('test formatCurrency', () => {
    const formattedValue = formatCurrency(12).toString();
    expect(formattedValue).toStrictEqual('12,00 €');
  });

  it('test formatEurocentToCurrency', () => {
    const formattedValue = formatEurocentToCurrency(1200);
    expect(formattedValue).toStrictEqual('12,00 €');
  });
});
