import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import {
  createMatchMedia,
  fireEvent,
  getById,
  queryById,
  waitFor,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { IDPS_MOCK } from '../../../__mocks__/IDPS.mock';
import { render } from '../../../__test__/test-utils';
import { OneIdentityApi } from '../../../api/OneIdentity/OneIdentity.api';
import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../../navigation/routes.const';
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

vi.mock('../../../api/OneIdentity/OneIdentity.api', () => ({
  OneIdentityApi: {
    getIdps: vi.fn().mockResolvedValue([]),
    authorize: vi.fn(),
  },
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

  describe('authorize', () => {
    beforeEach(() => {
      vi.mocked(OneIdentityApi.authorize).mockResolvedValue({
        location: 'https://idp.example.com/login',
      });
    });

    afterEach(() => {
      // eslint-disable-next-line functional/immutable-data
      delete (globalThis.location as any).href;
    });

    it('redirects to location on successful authorize', async () => {
      const { container } = render(<OneIdentityLogin />);
      fireEvent.click(getById(container, 'cieButton'));
      await waitFor(() =>
        expect(globalThis.location.href).toBe('https://idp.example.com/login')
      );
    });

    it('navigates to error page when authorize fails', async () => {
      vi.mocked(OneIdentityApi.authorize).mockRejectedValue(new Error('Auth failed'));
      const { container, router } = render(<OneIdentityLogin />);
      fireEvent.click(getById(container, 'cieButton'));
      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR)
      );
    });

    it('passes aar to authorize when AAR param is in the URL', async () => {
      const { container } = render(<OneIdentityLogin />, {
        route: `/?${AppRouteParams.AAR}=fake-aar`,
      });
      fireEvent.click(getById(container, 'cieButton'));
      await waitFor(() =>
        expect(OneIdentityApi.authorize).toHaveBeenCalledWith(
          expect.objectContaining({ aar: 'fake-aar', retrievalId: undefined })
        )
      );
    });

    it('passes retrievalId to authorize when RETRIEVAL_ID param is in the URL', async () => {
      const { container } = render(<OneIdentityLogin />, {
        route: `/?${AppRouteParams.RETRIEVAL_ID}=fake-retrieval-id`,
      });
      fireEvent.click(getById(container, 'cieButton'));
      await waitFor(() =>
        expect(OneIdentityApi.authorize).toHaveBeenCalledWith(
          expect.objectContaining({ retrievalId: 'fake-retrieval-id', aar: undefined })
        )
      );
    });

    it('passes no rapidAccess params to authorize when no query param is present', async () => {
      const { container } = render(<OneIdentityLogin />);
      fireEvent.click(getById(container, 'cieButton'));
      await waitFor(() =>
        expect(OneIdentityApi.authorize).toHaveBeenCalledWith(
          expect.objectContaining({ aar: undefined, retrievalId: undefined })
        )
      );
    });
  });

  describe('IDPS fetch', () => {
    beforeEach(() => {
      vi.mocked(OneIdentityApi.getIdps).mockResolvedValue(IDPS_MOCK);
    });

    it('calls getIdps on mount', async () => {
      render(<OneIdentityLogin />);
      await waitFor(() => expect(OneIdentityApi.getIdps).toHaveBeenCalledTimes(1));
    });

    it('shows loading spinner in dialog while IDPS fetch is pending', async () => {
      vi.mocked(OneIdentityApi.getIdps).mockImplementation(() => new Promise(() => {}));
      const { container } = render(<OneIdentityLogin />);
      fireEvent.click(getById(container, 'spidButton'));
      await waitFor(() => expect(queryById(document.body, 'spidSelect')).toBeInTheDocument());
      expect(document.body.querySelector('[data-testid="spid-loader"]')).toBeInTheDocument();
    });

    it('shows IDPs in dialog after successful fetch', async () => {
      const { container } = render(<OneIdentityLogin />);
      await waitFor(() => expect(OneIdentityApi.getIdps).toHaveBeenCalled());
      fireEvent.click(getById(container, 'spidButton'));
      await waitFor(() => expect(queryById(document.body, 'spidSelect')).toBeInTheDocument());
      IDPS_MOCK.forEach((idp) => {
        expect(document.getElementById(`spid-select-${idp.entityID}`)).toBeInTheDocument();
      });
    });

    it('shows no IDPs and no spinner in dialog after failed fetch', async () => {
      vi.mocked(OneIdentityApi.getIdps).mockRejectedValue(new Error('Network error'));
      const { container } = render(<OneIdentityLogin />);
      await waitFor(() => expect(OneIdentityApi.getIdps).toHaveBeenCalled());
      fireEvent.click(getById(container, 'spidButton'));
      await waitFor(() => expect(queryById(document.body, 'spidSelect')).toBeInTheDocument());
      expect(document.body.querySelector('[data-testid="spid-loader"]')).not.toBeInTheDocument();
      IDPS_MOCK.forEach((idp) => {
        expect(document.getElementById(`spid-select-${idp.entityID}`)).not.toBeInTheDocument();
      });
    });
  });
});
