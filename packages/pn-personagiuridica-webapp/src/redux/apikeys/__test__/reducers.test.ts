import MockAdapter from 'axios-mock-adapter';

import { publicKeys, virtualKeys } from '../../../__mocks__/ApiKeys.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import { ApiKeyAlgorithm, IssuerStatus } from '../../../models/ApiKeys';
import { store } from '../../store';
import {
  checkPublicKeyIssuer,
  createPublicKey,
  createVirtualApiKey,
  getPublicKeys,
  getVirtualApiKeys,
} from '../actions';

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
  publicKey: null,
  virtualKey: null,
  issuerStatus: null,
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

  it('should be able to create a new public key', async () => {
    const newPublicKeyBody = {
      name: '123',
      publicKey: 'test',
      exponent: 'AQAB',
      algorithm: ApiKeyAlgorithm.RS256,
    };

    const newPublicKey = {
      kid: 'kid-test',
      issuer: 'issuer-test',
    };

    mock.onPost('/bff/v1/pg/public-keys').reply(200, newPublicKey);
    const action = await store.dispatch(createPublicKey(newPublicKeyBody));
    const payload = action.payload;
    expect(action.type).toBe('createPublicApiKey/fulfilled');
    expect(payload).toEqual(newPublicKey);
    expect(store.getState().apiKeysState.publicKey).toEqual(newPublicKey);
  });

  it('should be able to fetch issuer status', async () => {
    const issuerStatus = {
      issuer: {
        isPresent: true,
        issuerStatus: IssuerStatus.ACTIVE,
      },
      tosAccepted: true,
    };

    mock.onGet('/bff/v1/pg/public-keys/check-issuer').reply(200, issuerStatus);
    const action = await store.dispatch(checkPublicKeyIssuer());
    const payload = action.payload;
    expect(action.type).toBe('checkPublicApiKeyIssuer/fulfilled');
    expect(payload).toEqual(issuerStatus);
    expect(store.getState().apiKeysState.issuerStatus).toEqual(issuerStatus);
  });

  it('should be able to fetch virtual api keys list', async () => {
    mock.onGet('/bff/v1/pg/virtual-keys').reply(200, virtualKeys);
    const action = await store.dispatch(getVirtualApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getVirtualApiKeys/fulfilled');
    expect(payload).toEqual(virtualKeys);
    expect(store.getState().apiKeysState.virtualKeys).toEqual(virtualKeys);
  });

  it('should be able to create a new virtual key', async () => {
    const newVirtualKey = {
      id: 'virtual-key-id',
      virtualKey: 'virtual-key-test',
    };

    mock.onPost('/bff/v1/pg/virtual-keys').reply(200, newVirtualKey);
    const action = await store.dispatch(createVirtualApiKey({ name: 'test' }));
    const payload = action.payload;
    expect(action.type).toBe('createVirtualApiKey/fulfilled');
    expect(payload).toEqual(newVirtualKey);
    expect(store.getState().apiKeysState.virtualKey).toEqual(newVirtualKey);
  });
});
