import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
} from '../../../__mocks__/CreateDelegation.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { apiClient } from '../../../api/apiClients';
import { CREATE_DELEGATION } from '../../../api/delegations/delegations.routes';
import { GET_ALL_ACTIVATED_PARTIES } from '../../../api/external-registries/external-registries-routes';
import { store } from '../../store';
import { createDelegation, createDelegationMapper, getAllEntities } from '../actions';
import { resetNewDelegation } from '../reducers';

export const initialState = {
  created: false,
  entities: [],
};

describe('delegation redux state tests', () => {
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

  it('checks the initial state', () => {
    const state = store.getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(200, createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it('creates a new delegation with a single organization', async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationSelectedPayload))
      .reply(200, createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it("can't create a new delegation", async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(401, createDelegationGenericErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationGenericErrorResponse);
  });

  it("can't create a new delegation (duplicated)", async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(400, createDelegationDuplicatedErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationDuplicatedErrorResponse);
  });

  it('fecth parties list', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    const action = await store.dispatch(getAllEntities(null));
    expect(action.type).toBe('getAllEntities/fulfilled');
    expect(action.payload).toEqual(parties);
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;
    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state.created).toBeFalsy();
  });
});
