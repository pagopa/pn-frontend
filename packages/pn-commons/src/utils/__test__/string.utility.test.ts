import { formatFiscalCode, sanitizeString } from '../string.utility';

describe('String utility', () => {
  it('formatFiscalCode', () => {
    const fiscalCode = 'abc';
    const result = formatFiscalCode(fiscalCode);
    expect(result).toStrictEqual('ABC');
  });

  it('unescape - no char to sanitize', () => {
    const str = 'abc';
    const result = sanitizeString(str);
    expect(result).toStrictEqual(str);
  });

  it('unescape - char to sanitize', () => {
    // Malicious third-party code
    const thirdPartyString = `<img src=x onerror="alert('XSS Attack')">`;
    const thirdPartyURL = `javascript:alert('Another XSS Attack')`;
    const htmlStr = `<p>${thirdPartyString}</p><p><a href="${thirdPartyURL}">View My Profile</a></p>`;
    const result = sanitizeString(htmlStr);
    expect(result).toStrictEqual('<p><img src="x"></p><p><a>View My Profile</a></p>');
  });
});
