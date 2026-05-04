import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import {
  createMatchMedia,
  fireEvent,
  getById,
  queryById,
  waitFor,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import { storageRapidAccessOps } from '../../../utility/storage';
import OneIdentityLogin from '../OneIdentityLogin';

const mockAssign = vi.fn();
let isSmartAppBannerEnabled = true;

// mock imports
vi.mock('../../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../../services/configuration.service')),
    getConfiguration: () => ({
      IS_SMART_APP_BANNER_ENABLED: isSmartAppBannerEnabled,
    }),
  };
});

vi.mock('../../../utility/utils', async () => ({
  ...(await vi.importActual<any>('../../../utility/utils')),
  isIOSMobile: vi.fn().mockReturnValue(false),
}));

describe('test login page', () => {
  const original = globalThis.location;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'location', { value: { assign: mockAssign } });
  });

  afterEach(() => {
    storageRapidAccessOps.delete();
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'location', { value: original });
  });

  it('renders page', () => {
    const { container } = render(<OneIdentityLogin />, {
      route: `/?${AppRouteParams.AAR}=fake-aar-token`,
    });
    expect(container).toHaveTextContent(/loginPage.title/i);
    expect(container).toHaveTextContent(/loginPage.description/i);
    const spidButton = getById(container, 'spidButton');
    expect(spidButton).toBeInTheDocument();
    const cieButton = getById(container, 'cieButton');
    expect(cieButton).toBeInTheDocument();
    const spidSelect = queryById(container, 'spidSelect');
    expect(spidSelect).not.toBeInTheDocument();
  });

  it('renders page - with smart banner enabled', () => {
    // enable mobile view
    globalThis.matchMedia = createMatchMedia(800);
    const { container } = render(<OneIdentityLogin />);
    const ioSmartAppBanner = getById(container, 'ioSmartAppBanner');
    expect(ioSmartAppBanner).toBeInTheDocument();
  });

  it('renders page - whitout smart banner enabled', () => {
    isSmartAppBannerEnabled = false;
    const { container } = render(<OneIdentityLogin />);
    const ioSmartAppBanner = queryById(container, 'ioSmartAppBanner');
    expect(ioSmartAppBanner).not.toBeInTheDocument();
    // disable mobile view
    globalThis.matchMedia = createMatchMedia(1202);
  });

  it('select spid login', async () => {
    const { container } = render(<OneIdentityLogin />);
    const spidButton = getById(container, 'spidButton');
    fireEvent.click(spidButton);
    const spidSelect = await waitFor(() => document.querySelector('#spidSelect'));
    expect(spidSelect).toBeInTheDocument();
  });
});
