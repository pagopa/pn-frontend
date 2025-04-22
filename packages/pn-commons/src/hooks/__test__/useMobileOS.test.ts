import { renderHook } from '@testing-library/react';

import { useMobileOS } from '../useMobileOS';

describe('useMobileOS', () => {
  it('shoud return "Android" when the user agent specifies an Android device', () => {
    // Mock dell'User-Agent per Android
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
      configurable: true,
    });

    const { result } = renderHook(() => useMobileOS());

    expect(result.current).toBe('Android');
  });

  it('shoud return "iOS" when the user agent specifies an iOS device', () => {
    // Mock dell'User-Agent per iOS
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      configurable: true,
    });

    const { result } = renderHook(() => useMobileOS());

    expect(result.current).toBe('iOS');
  });

  it('shoud return "Unknown" when the user agent does not corresponds to any mobile device', () => {
    // Mock dell'User-Agent per un dispositivo non mobile
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      configurable: true,
    });

    const { result } = renderHook(() => useMobileOS());

    expect(result.current).toBe('Unknown');
  });
});
