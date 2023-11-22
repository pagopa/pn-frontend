import { vi } from 'vitest';
import { renderHook } from '../../test-utils';
import { mixpanelInit } from '../../utility/mixpanel.utility';
import { useTracking } from '../useTracking';

global.OneTrust = {
  OnConsentChanged: vi.fn(),
};

// Mock the mixpanelInit function
vi.mock('../../utility/mixpanel.utility', () => ({
  mixpanelInit: vi.fn(),
}));

describe('useTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Mixpanel when OneTrust consent is given', () => {
    const mixpanelToken = 'your-mixpanel-token';
    const nodeEnv = 'test';

    // Mock OneTrust
    const originalOnConsentChanged = global.OneTrust.OnConsentChanged;
    global.OneTrust.OnConsentChanged = vi.fn((callback) => {
      callback();
    });

    // Mock document.cookie
    const originalDocumentCookie = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'cookie'
    )?.get;
    Object.defineProperty(Document.prototype, 'cookie', {
      get: () => 'OptanonConsent=C0002%3A1; otherCookie=example',
    });

    // Render the hook
    renderHook(() => useTracking(mixpanelToken, nodeEnv));

    // Assert that mixpanelInit was called
    expect(mixpanelInit).toHaveBeenCalledWith(mixpanelToken, nodeEnv);

    // Restore original values
    global.OneTrust.OnConsentChanged = originalOnConsentChanged;
    Object.defineProperty(Document.prototype, 'cookie', {
      get: originalDocumentCookie,
    });
  });

  it('should not initialize Mixpanel when OneTrust consent is not given', () => {
    const mixpanelToken = 'your-mixpanel-token';
    const nodeEnv = 'test';

    // Mock OneTrust
    const originalOnConsentChanged = global.OneTrust.OnConsentChanged;
    global.OneTrust.OnConsentChanged = vi.fn((callback) => {
      // Simulate no consent
    });

    // Mock document.cookie
    const originalDocumentCookie = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'cookie'
    )?.get;
    Object.defineProperty(Document.prototype, 'cookie', {
      get: () => 'otherCookie=example',
    });

    // Render the hook
    renderHook(() => useTracking(mixpanelToken, nodeEnv));

    // Assert that mixpanelInit was not called
    expect(mixpanelInit).not.toHaveBeenCalled();

    // Restore original values
    global.OneTrust.OnConsentChanged = originalOnConsentChanged;
    Object.defineProperty(Document.prototype, 'cookie', {
      get: originalDocumentCookie,
    });
  });
});
