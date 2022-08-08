import { formatIun } from '../iun.utility';

describe('Iun utility', () => {
  
  it('Return iun with uppercase letters', () => {
    const unformattedIun = 'mrtw';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('MRTW');
  });

  it('Return iun with dash and uppercase letters', () => {
    const unformattedIun = 'mrtwa';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('MRTW-A');
  });
});
