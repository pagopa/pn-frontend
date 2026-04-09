import { isIOSMobile, shuffleList } from '../utils';

const list: Array<any> = [1, 2, 3, 4, 5, 6];

describe('utils test', () => {
  it('shuffle test', () => {
    const shuffledList = shuffleList([...list]);
    expect(list).not.toEqual(shuffledList);
  });

  describe('isIOSMobile test', () => {
    it('should return true for iPhone user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
      });
      expect(isIOSMobile()).toBe(true);
    });

    it('should return true for iPad user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
      });
      expect(isIOSMobile()).toBe(true);
    });

    it('should return false for non-iOS user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        configurable: true,
      });
      expect(isIOSMobile()).toBe(false);
    });

    it('should return false for macOS user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
        configurable: true,
      });
      expect(isIOSMobile()).toBe(false);
    });
  });
});
