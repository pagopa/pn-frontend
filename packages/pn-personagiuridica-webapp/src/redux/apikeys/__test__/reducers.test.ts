import MockAdapter from 'axios-mock-adapter';

import { checkIssuerPublicKey, publicKeys, virtualKeys } from '../../../__mocks__/ApiKeys.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import { PublicKeysIssuerResponseIssuerStatusEnum } from '../../../generated-client/pg-apikeys';
import { store } from '../../store';
import { checkPublicKeyIssuer, getPublicKeys, getVirtualApiKeys } from '../actions';

const initialState = {
  loading: false,
  publicKeys: {
    items: [],
    total: 0,
  },
  virtualKeys: {
    items: [],
    total: 0,
  },
  issuerState: {
    tosAccepted: false,
    issuer: {
      isPresent: false,
      issuerStatus: PublicKeysIssuerResponseIssuerStatusEnum.Inactive,
    },
  },
};

describe('api keys redux state test', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  mockAuthentication();

  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the public api keys list', async () => {
    mock.onGet('/bff/v1/pg/public-keys').reply(200, publicKeys);
    const action = await store.dispatch(getPublicKeys());
    const payload = action.payload;
    expect(action.type).toBe('getPublicApiKeys/fulfilled');
    expect(payload).toEqual(publicKeys);
    expect(store.getState().apiKeysState.publicKeys).toEqual(publicKeys);
  });

  it('should be able to fetch virtual api keys list', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys').reply(200, virtualKeys);
    const action = await store.dispatch(getVirtualApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getVirtualApiKeys/fulfilled');
    expect(payload).toEqual(virtualKeys);
    expect(store.getState().apiKeysState.virtualKeys).toEqual(virtualKeys);
  });

  it('should be able to fetch check public key issuer', async () => {
    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, checkIssuerPublicKey);
    const action = await store.dispatch(checkPublicKeyIssuer());
    const payload = action.payload;
    expect(action.type).toBe('checkPublicApiKeyIssuer/fulfilled');
    expect(payload).toEqual(checkIssuerPublicKey);
    expect(store.getState().apiKeysState.issuerState).toEqual(checkIssuerPublicKey);
  });
});
