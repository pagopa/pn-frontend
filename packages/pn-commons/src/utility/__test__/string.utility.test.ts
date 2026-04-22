import { dataRegex, formatFiscalCode, fromStringToBase64, sanitizeString } from '../string.utility';

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

  describe('dataRegex.email', () => {
    it('accepts valid email addresses', () => {
      const validAddresses = [
        'first.last@mail.com',
        'first+last@mail.co.uk',
        'first{last}@mail.it',
        'first|last@mail.it',
        'first.last@06.it', // numeric domain label
        'first@xn--mller-kva.de', // punycode domain label (IDN)
        'first@russian.xn--p1ai', // punycode TLD (IDN)
      ];

      for (const valid of validAddresses) {
        expect(valid).toMatch(dataRegex.email);
      }
    });

    it('rejects emails with numeric TLD', () => {
      const invalidAddresses = ['first.last@06.50', 'firstlast@mail.123'];

      for (const invalid of invalidAddresses) {
        expect(invalid).not.toMatch(dataRegex.email);
      }
    });
  });
});

describe('dataRegex.name', () => {
  const valid = [
    'Mario Rossi',
    "Giovanni D'Angelo",
    'Müller',         // tedesco: umlaut
    'François',       // francese: cedilla
    'Škoda',          // ceco: háček
    'Maša',           // rumeno/slavo: Š
    'José',           // spagnolo: accento acuto
    'O\'Brien',       // irlandese: apostrofo
    'Smith-Jones',    // trattino
    'Name123',        // cifre
    'St. John',       // punto
    'Łukasz',         // polacco: Ł
    'Ångström',       // svedese: Å
    'Ñoño',           // spagnolo: tilde
    'Žan',            // sloveno: Ž
    'Αλέξης',         // greco
    'Иван',           // cirillico
  ];

  const invalid = [
    'Mario@Rossi',    // @
    'Name<script>',   // <
    'Test/Name',      // /
    'Hello\\World',   // \
    'Name=Value',     // =
    'Name!',          // !
    'Name?',          // ?
    'Name#tag',       // #
    'Name$',          // $
    'Name%20',        // %
    '(Mario)',        // parentesi
    '[test]',         // parentesi quadre
    '{name}',         // parentesi graffe
    'name_test',      // underscore
    'name,cognome',   // virgola
    'name;cognome',   // punto e virgola
    'name:cognome',   // due punti
    'name|cognome',   // pipe
    'name~cognome',   // tilde
    'name`cognome',   // backtick
  ];

  it.each(valid)('accetta "%s"', (name) => {
    expect(dataRegex.name.test(name)).toBe(true);
  });

  it.each(invalid)('rifiuta "%s"', (name) => {
    expect(dataRegex.name.test(name)).toBe(false);
  });
});
