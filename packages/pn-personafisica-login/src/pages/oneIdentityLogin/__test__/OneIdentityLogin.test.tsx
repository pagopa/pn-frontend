import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../../utility/storage';
import * as utils from '../../../utility/utils';
import OneIdentityLogin from '../OneIdentityLogin';

const mockAssign = vi.fn();
const mockUseSearchParams = vi.fn();

const mockState = 'mock-state-12345';
const mockNonce = 'mock-nonce-67890';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock('../../../utility/utils', async () => ({
  ...(await vi.importActual<any>('../../../utility/utils')),
  generateRandomUniqueString: vi.fn(),
}));

vi.mock('../../../services/configuration.service');

describe('OneIdentityLogin component', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { assign: mockAssign } });
  });

  beforeEach(() => {
    vi.mocked(getConfiguration).mockReturnValue({
      ONE_IDENTITY_CLIENT_ID: 'DFCUf4W3KHfKUl4USEVYrMgpMxvyKICHM_ZPiZ3ftm0',
      ONE_IDENTITY_BASE_URL: 'https://uat.oneid.pagopa.it',
      PF_URL: 'https://cittadini.dev.notifichedigitali.it',
    } as any);

    let callCount = 0;
    vi.mocked(utils.generateRandomUniqueString).mockImplementation(() => {
      callCount++;
      return callCount === 1 ? mockState : mockNonce;
    });

    const emptySearchParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue([emptySearchParams, null]);
  });

  afterEach(() => {
    storageRapidAccessOps.delete();
    storageOneIdentityState.delete();
    storageOneIdentityNonce.delete();
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { value: original });
  });

  it('redirects to OneIdentity login with correct parameters', () => {
    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    const expectedUrl =
      'https://uat.oneid.pagopa.it/login?response_type=CODE&scope=openid&client_id=DFCUf4W3KHfKUl4USEVYrMgpMxvyKICHM_ZPiZ3ftm0&state=mock-state-12345&nonce=mock-nonce-67890&redirect_uri=https%3A%2F%2Fcittadini.dev.notifichedigitali.it%2Fauth%2Fcallback';

    expect(storageOneIdentityState.read()).toBe(mockState);
    expect(storageOneIdentityNonce.read()).toBe(mockNonce);

    expect(storageRapidAccessOps.read()).toBeUndefined();

    expect(mockAssign).toHaveBeenCalledTimes(1);
    expect(mockAssign).toHaveBeenCalledWith(expectedUrl);
  });

  it('stores AAR rapid access parameter in session storage', () => {
    const searchParams = new URLSearchParams();
    searchParams.set(AppRouteParams.AAR, 'mock-aar-token');
    mockUseSearchParams.mockReturnValue([searchParams, null]);

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(storageRapidAccessOps.read()).toEqual([AppRouteParams.AAR, 'mock-aar-token']);
  });

  it('stores retrievalId rapid access parameter in session storage', () => {
    const searchParams = new URLSearchParams();
    searchParams.set(AppRouteParams.RETRIEVAL_ID, 'mock-retrieval-id');
    mockUseSearchParams.mockReturnValue([searchParams, null]);

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(storageRapidAccessOps.read()).toEqual([
      AppRouteParams.RETRIEVAL_ID,
      'mock-retrieval-id',
    ]);
  });

  it('renders LoginError when clientId is missing', async () => {
    vi.mocked(getConfiguration).mockReturnValue({
      ONE_IDENTITY_CLIENT_ID: '',
      ONE_IDENTITY_BASE_URL: 'https://uat.oneid.pagopa.it',
      PF_URL: 'https://cittadini.dev.notifichedigitali.it',
    } as any);

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(mockAssign).not.toHaveBeenCalled();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });

  it('renders LoginError when ONE_IDENTITY_BASE_URL is missing', () => {
    vi.mocked(getConfiguration).mockReturnValue({
      ONE_IDENTITY_CLIENT_ID: 'DFCUf4W3KHfKUl4USEVYrMgpMxvyKICHM_ZPiZ3ftm0',
      ONE_IDENTITY_BASE_URL: '',
      PF_URL: 'https://cittadini.dev.notifichedigitali.it',
    } as any);

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(mockAssign).not.toHaveBeenCalled();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });

  it('renders LoginError when state generation fails', () => {
    vi.mocked(utils.generateRandomUniqueString).mockReturnValueOnce('');

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(mockAssign).not.toHaveBeenCalled();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });

  it('renders LoginError when nonce generation fails', () => {
    let callCount = 0;
    vi.mocked(utils.generateRandomUniqueString).mockImplementation(() => {
      callCount++;
      return callCount === 1 ? mockState : '';
    });

    render(
      <BrowserRouter>
        <OneIdentityLogin />
      </BrowserRouter>
    );

    expect(mockAssign).not.toHaveBeenCalled();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });
});
