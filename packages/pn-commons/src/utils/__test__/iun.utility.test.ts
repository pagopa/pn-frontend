import { formatIun } from '../iun.utility';

describe('Iun utility', () => {
  
  it('Return iun with uppercase letters', () => {
    const unformattedIun = 'mrtw';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('MRTW');
  });

  it('Return iun with dash and uppercase letters (input not uppercase)', () => {
    const unformattedIun = 'mrtwa';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('MRTW-A');
  });

  it('Return iun with dash and uppercase letters (input uppercase with dash)', () => {
    const unformattedIun = 'MRTW-A';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('MRTW-A');
  });

  it('Return iun with dash and uppercase letters (input uppercase - letters and numbers)', () => {
    const unformattedIun = 'DDDDDDDDDDDDDDD11111';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-DDD111-1-1');
  });

  it('Return iun with dash and uppercase letters (input uppercase - special chars)', () => {
    const unformattedIun = 'DDDDDDDDDDDD$$$11111';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-11111');
  });

  it('Return iun with dash and uppercase letters (input uppercase - special chars at the end)', () => {
    const unformattedIun = 'DDDDDDDDDDDDDDD11111££$%&$%';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-DDD111-1-1');
  });

  it('Return iun with dash and uppercase letters (input uppercase - only letters)', () => {
    const unformattedIun = 'DDDDDDDDDDDDDDDDDDDD';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-DDDDDD-D-D');
  });

  it('Return iun with dash and uppercase letters (input uppercase - only letters and dash)', () => {
    const unformattedIun = 'DDDD-DDDD-DDDD-DDDDDD-D-D';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-DDDDDD-D-D');
  });

  it('Return iun with dash and uppercase letters (input uppercase - only letters and extra dash)', () => {
    const unformattedIun = 'DDDD-DDDD-DDDD-DDDDDD----';
    const formattedIun = formatIun(unformattedIun);
    expect(formattedIun).toBe('DDDD-DDDD-DDDD-DDDDDD');
  });
});
