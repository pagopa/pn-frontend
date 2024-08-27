import { formatFiscalCode, fromStringToBase64, sanitizeString } from '../string.utility';

describe('String utility', () => {
  it('formatFiscalCode', () => {
    const fiscalCode = 'mrtMTT91D08F205J';
    const result = formatFiscalCode(fiscalCode);
    expect(result).toStrictEqual('MRTMTT91D08F205J');
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
    const htmlStr = `<script>alert("I'm a malicious code")</script><p>Hey! ${thirdPartyString}</p><p><a href="${thirdPartyURL}">View My Profile</a></p>`;
    const result = sanitizeString(htmlStr);
    expect(result).toStrictEqual('Hey! View My Profile');
  });

  it('unescape - special chars', () => {
    const srt = "Giovanna D'Arco & C.O.";
    const result = sanitizeString(srt);
    expect(result).toStrictEqual("Giovanna D'Arco & C.O.");
  });

  it('convert string into base64 - empty string', () => {
    const srt = '';
    const result = fromStringToBase64(srt);
    expect(result).toStrictEqual('');
  });

  it('convert string into base64', () => {
    const srt = 'Hello';
    const result = fromStringToBase64(srt);
    expect(result).toStrictEqual('SGVsbG8=');
  });
});
