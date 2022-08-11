import { formatFiscalCode } from '../string.utility';

const correctFiscalCode = 'MRTMTT91D08F205J';

describe('Fiscal code utility', () => {
  it('Takes not uppercase fiscal code and returns it in uppercase', () => {
    const unformattedFiscalCode = 'mrtMTT91D08F205J';
    const formattedFiscalCode = formatFiscalCode(unformattedFiscalCode);
    expect(formattedFiscalCode).toBe(correctFiscalCode);
  });

  it('Takes uppercase fiscal code and returns it in uppercase', () => {
    const alreadyFormattedFiscalCode = 'MRTMTT91D08F205J';
    const formattedFiscalCode = formatFiscalCode(alreadyFormattedFiscalCode);
    expect(formattedFiscalCode).toBe(correctFiscalCode);
  });
});
