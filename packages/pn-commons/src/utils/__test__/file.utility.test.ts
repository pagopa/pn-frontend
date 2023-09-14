import { calcBase64String, calcSha256String, calcUnit8Array, parseFileSize } from '../file.utility';

describe('File utility', () => {
  it('Parse file size (0 bytes)', () => {
    const result = parseFileSize(0);
    expect(result).toBe('0 Bytes');
  });

  it('Parse file size (200 bytes)', () => {
    const result = parseFileSize(200);
    expect(result).toBe('200 Bytes');
  });

  it('Parse file size (500 KB)', () => {
    const result = parseFileSize(500 * 1024);
    expect(result).toBe('500 KB');
  });

  it('Parse file size (54 MB)', () => {
    const result = parseFileSize(54 * 1024 ** 2);
    expect(result).toBe('54 MB');
  });

  it('Parse file size (3 GB)', () => {
    const result = parseFileSize(3 * 1024 ** 3);
    expect(result).toBe('3 GB');
  });

  it('Parse file size (10 TB)', () => {
    const result = parseFileSize(10 * 1024 ** 4);
    expect(result).toBe('10 TB');
  });

  it('calcBase64String', async () => {
    const base64String = await calcBase64String('test');
    expect(base64String).toBe('mocked-base64String');
  });

  it('calcUnit8Array', async () => {
    const unit8Array = await calcUnit8Array('test');
    expect(unit8Array).toStrictEqual(new Uint8Array());
  });

  it('calcSha256String', async () => {
    const sha256String = await calcSha256String('test');
    expect(sha256String).toStrictEqual({
      hashHex: 'mocked-hashHex',
      hashBase64: 'mocked-hashBase64',
    });
  });
});
