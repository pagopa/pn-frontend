import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { publicKeys, virtualKeys } from '../../__mocks__/ApiKeys.mock';
import { userResponse } from '../../__mocks__/Auth.mock';
import { render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { PublicKeysIssuerResponseIssuerStatusEnum } from '../../generated-client/pg-apikeys';
import { ConsentType } from '../../generated-client/tos-privacy';
import { PNRole, PartyRole } from '../../models/User';
import ApiIntegration from '../ApiIntegration.page';

describe('ApiIntegration page', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  // user with admin role can view the public key section and the virtual key section
  // the virtual key section is shown if there is an active public key or if there are virtual keys
  it('render component when user is admin - no public key', async () => {
    mock.onGet('/bff/v1/pg/public-keys?showPublicKey=true').reply(200, {
      total: 0,
      items: [],
    });

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: 0,
      items: [],
    });

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [
      {
        recipientId: userResponse.uid,
        consentType: ConsentType.TosDestB2B,
        accepted: true,
        consentVersion: '2',
        isFirstAccept: false,
      },
    ]);

    const { container, getByTestId, queryByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys?showPublicKey=true');
      expect(mock.history.get[1].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
      expect(mock.history.get[2].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeysSection = getByTestId('publicKeys');
    expect(publicKeysSection).toBeInTheDocument();
    const virtualKeysSection = queryByTestId('virtualKeys');
    expect(virtualKeysSection).not.toBeInTheDocument();
  });

  it('render component when user is admin - public key active', async () => {
    mock.onGet('/bff/v1/pg/public-keys?showPublicKey=true').reply(200, publicKeys);

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, {
      total: 0,
      items: [],
    });

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [
      {
        recipientId: userResponse.uid,
        consentType: ConsentType.TosDestB2B,
        accepted: true,
        consentVersion: '2',
        isFirstAccept: false,
      },
    ]);

    const { container, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys?showPublicKey=true');
      expect(mock.history.get[1].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
      expect(mock.history.get[2].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeysSection = getByTestId('publicKeys');
    expect(publicKeysSection).toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
  });

  it('render component when user is admin - no public key but with virtual keys', async () => {
    mock.onGet('/bff/v1/pg/public-keys?showPublicKey=true').reply(200, {
      total: 0,
      items: [],
    });

    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`).reply(200, [
      {
        recipientId: userResponse.uid,
        consentType: ConsentType.TosDestB2B,
        accepted: true,
        consentVersion: '2',
        isFirstAccept: false,
      },
    ]);

    const { container, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys?showPublicKey=true');
      expect(mock.history.get[1].url).toBe(`/bff/v1/pg/tos-privacy?type=${ConsentType.TosDestB2B}`);
      expect(mock.history.get[2].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeysSection = getByTestId('publicKeys');
    expect(publicKeysSection).toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
    const banner = getByTestId('integrationApiBanner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('banner.description-admin');
  });

  // user with admin role and groups cannot view the public key section but can view the virtual key section
  it('render component when user is admin with groups', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, {
      tosAccepted: true,
      issuer: {
        isPresent: true,
        issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
      },
    });

    const { container, queryByTestId, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            hasGroup: true,
          },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys/check-issuer');
      expect(mock.history.get[1].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
  });

  // user with operator role cannot view the public key section but can view the virtual key section
  it('render component when user is an operator', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, {
      tosAccepted: true,
      issuer: {
        isPresent: true,
        issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
      },
    });

    const { container, queryByTestId, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            organization: {
              ...userResponse.organization,
              roles: [
                {
                  partyRole: PartyRole.OPERATOR,
                  role: PNRole.OPERATOR,
                },
              ],
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys/check-issuer');
      expect(mock.history.get[1].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
  });

  it('render component when user is an operator and issuer is not active', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, {
      tosAccepted: true,
      issuer: {
        isPresent: true,
        issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
      },
    });

    const { container, queryByTestId, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            organization: {
              ...userResponse.organization,
              roles: [
                {
                  partyRole: PartyRole.OPERATOR,
                  role: PNRole.OPERATOR,
                },
              ],
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys/check-issuer');
      expect(mock.history.get[1].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
    const banner = getByTestId('integrationApiBanner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('banner.description-operator');
  });

  it('render component when user is an operator and issuer is not present', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, {
      tosAccepted: true,
      issuer: {
        isPresent: false,
      },
    });

    const { container, queryByTestId, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            organization: {
              ...userResponse.organization,
              roles: [
                {
                  partyRole: PartyRole.OPERATOR,
                  role: PNRole.OPERATOR,
                },
              ],
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys/check-issuer');
      expect(mock.history.get[1].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
  });

  it('render component when user is an operator and tos not accepted', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys?showVirtualKey=true').reply(200, virtualKeys);

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, {
      tosAccepted: true,
      issuer: {
        isPresent: true,
        issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Active,
      },
    });

    const { container, queryByTestId, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            organization: {
              ...userResponse.organization,
              roles: [
                {
                  partyRole: PartyRole.OPERATOR,
                  role: PNRole.OPERATOR,
                },
              ],
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[0].url).toBe('/bff/v1/pg/public-keys/check-issuer');
      expect(mock.history.get[1].url).toBe('/bff/v1/pg/virtual-keys?showVirtualKey=true');
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
    const virtualKeysSection = getByTestId('virtualKeys');
    expect(virtualKeysSection).toBeInTheDocument();
  });
});
