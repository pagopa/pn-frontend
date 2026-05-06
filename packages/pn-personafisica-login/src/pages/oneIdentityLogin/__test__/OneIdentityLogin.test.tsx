import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../../utility/storage';
import * as utils from '../../../utility/utils';
import OneIdentityLogin from '../OneIdentityLogin';

const mockAssign = vi.fn();

const mockState = 'mock-state-12345';
const mockNonce = 'mock-nonce-67890';

vi.mock('../../../utility/utils', async () => ({
  ...(await vi.importActual<any>('../../../utility/utils')),
  generateRandomUniqueString: vi.fn(),
}));

describe('OneIdentityLogin component', () => {
  const original = globalThis.location;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'location', { value: { assign: mockAssign } });
  });

  beforeEach(() => {
    let callCount = 0;
    vi.mocked(utils.generateRandomUniqueString).mockImplementation(() => {
      callCount++;
      return callCount === 1 ? mockState : mockNonce;
    });
  });

  afterEach(() => {
    storageRapidAccessOps.delete();
    storageOneIdentityState.delete();
    storageOneIdentityNonce.delete();
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'location', { value: original });
  });

  it('redirects to OneIdentity login with correct parameters', () => {
    render(<OneIdentityLogin />);

    const expectedUrl =
      'https://uat.oneid.pagopa.it/login?response_type=CODE&scope=openid&client_id=DFCUf4W3KHfKUl4USEVYrMgpMxvyKICHM_ZPiZ3ftm0&state=mock-state-12345&nonce=mock-nonce-67890&redirect_uri=https%3A%2F%2Fcittadini.dev.notifichedigitali.it%2Fauth%2Fcallback';

    expect(storageOneIdentityState.read()).toBe(mockState);
    expect(storageOneIdentityNonce.read()).toBe(mockNonce);

    expect(storageRapidAccessOps.read()).toBeUndefined();

    expect(mockAssign).toHaveBeenCalledTimes(1);
    expect(mockAssign).toHaveBeenCalledWith(expectedUrl);
  });

  it('stores AAR rapid access parameter in session storage', () => {
    render(<OneIdentityLogin />, { route: `/?${AppRouteParams.AAR}=mock-aar-token` });

    expect(storageRapidAccessOps.read()).toEqual([AppRouteParams.AAR, 'mock-aar-token']);
  });

  it('stores retrievalId rapid access parameter in session storage', () => {
    render(<OneIdentityLogin />, { route: `/?${AppRouteParams.RETRIEVAL_ID}=mock-retrieval-id` });

    expect(storageRapidAccessOps.read()).toEqual([
      AppRouteParams.RETRIEVAL_ID,
      'mock-retrieval-id',
    ]);
  });
});
