import { isMobileDevice } from '../device.utility';

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
const MAC_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
const WINDOWS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

const mockDevice = (userAgent: string, maxTouchPoints: number) => {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true });
  Object.defineProperty(window.navigator, 'maxTouchPoints', {
    value: maxTouchPoints,
    configurable: true,
  });
};

describe('isMobileDevice', () => {
  it('returns true on Android', () => {
    mockDevice(ANDROID_UA, 5);
    expect(isMobileDevice()).toBe(true);
  });

  it('returns true on iPhone', () => {
    mockDevice(IPHONE_UA, 5);
    expect(isMobileDevice()).toBe(true);
  });

  // iPadOS Safari reports a Macintosh user agent, touch points tell it apart from a desktop Mac
  it('returns true on iPadOS, which reports a Macintosh user agent', () => {
    mockDevice(MAC_UA, 5);
    expect(isMobileDevice()).toBe(true);
  });

  it('returns false on a desktop Mac', () => {
    mockDevice(MAC_UA, 0);
    expect(isMobileDevice()).toBe(false);
  });

  it('returns false on a desktop non-Apple device', () => {
    mockDevice(WINDOWS_UA, 0);
    expect(isMobileDevice()).toBe(false);
  });
});
