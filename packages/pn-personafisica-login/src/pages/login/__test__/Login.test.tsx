import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import {
  createMatchMedia,
  getById,
  queryById,
  waitFor,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageRapidAccessOps } from '../../../utility/storage';
import Login from '../Login';

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
    const { container } = render(<Login />, { route: `/?${AppRouteParams.AAR}=fake-aar-token` });
    expect(container).toHaveTextContent(/loginPage.title/i);
    expect(container).toHaveTextContent(/loginPage.description/i);
    const spidButton = getById(container, 'spidButton');
    expect(spidButton).toBeInTheDocument();
    const cieButton = getById(container, 'cieButton');
    expect(cieButton).toBeInTheDocument();
    const spidSelect = queryById(container, 'spidSelect');
    expect(spidSelect).not.toBeInTheDocument();
    expect(storageRapidAccessOps.read()).toEqual([AppRouteParams.AAR, 'fake-aar-token']);
  });

  it('renders page - with smart banner enabled', () => {
    // enable mobile view
    globalThis.matchMedia = createMatchMedia(800);
    const { container } = render(<Login />);
    const ioSmartAppBanner = getById(container, 'ioSmartAppBanner');
    expect(ioSmartAppBanner).toBeInTheDocument();
  });

  it('renders page - whitout smart banner enabled', () => {
    isSmartAppBannerEnabled = false;
    const { container } = render(<Login />);
    const ioSmartAppBanner = queryById(container, 'ioSmartAppBanner');
    expect(ioSmartAppBanner).not.toBeInTheDocument();
    // disable mobile view
    globalThis.matchMedia = createMatchMedia(1202);
  });

  it('select spid login', async () => {
    const { container } = render(<Login />);
    const spidButton = getById(container, 'spidButton');
    fireEvent.click(spidButton);
    const spidSelect = await waitFor(() => document.querySelector('#spidSelect'));
    expect(spidSelect).toBeInTheDocument();
  });

  it('select CIE login', () => {
    const { URL_API_LOGIN, SPID_CIE_ENTITY_ID } = getConfiguration();
    const { container } = render(<Login />);
    const cieButton = getById(container, 'cieButton');
    fireEvent.click(cieButton);
    expect(mockAssign).toHaveBeenCalledTimes(1);
    expect(mockAssign).toHaveBeenCalledWith(
      `${URL_API_LOGIN}/login?entityID=${SPID_CIE_ENTITY_ID}&authLevel=SpidL2&RelayState=send`
    );
  });

  it('not store data in session storage', () => {
    render(<Login />);
    expect(storageRapidAccessOps.read()).toBeUndefined();
  });

  it('store retrievalId in session storage', () => {
    render(<Login />, { route: `/?${AppRouteParams.RETRIEVAL_ID}=fake-retrieval_id` });
    expect(storageRapidAccessOps.read()).toEqual([
      AppRouteParams.RETRIEVAL_ID,
      'fake-retrieval_id',
    ]);
  });
});
