import { formatIun } from '../iun.utility';

describe('Iun utility', () => {
  it('Returns null iun', () => {
    const unformattedIun = 'MR';
    const formattedIun = formatIun(unformattedIun, 'T');
    expect(formattedIun).toBe(null);
  });

  it('Return iun with dash', () => {
    const unformattedIun = 'MRT';
    const formattedIun = formatIun(unformattedIun, 'W');
    expect(formattedIun).toBe('MRTW-');
  });
});
