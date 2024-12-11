import MockAdapter from 'axios-mock-adapter';

import {
  createDelegationDuplicatedErrorResponse,
  createDelegationPayload,
  createDelegationSelectedPayload,
} from '../../../__mocks__/CreateDelegation.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { createDelegation, createDelegationMapper, getAllEntities } from '../actions';
import { resetNewDelegation } from '../reducers';

const initialState = {
  created: false,
  error: false,
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

  it('checks the initial state', () => {
    const state = store.getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    mock.onPost('/bff/v1/mandate', createDelegationMapper(createDelegationPayload)).reply(200);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('creates a new delegation with a single organization', async () => {
    mock
      .onPost(/\/bff\/v1\/mandate.*/, createDelegationMapper(createDelegationSelectedPayload))
      .reply(200);
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it("can't create a new delegation", async () => {
    mock
      .onPost(/\/bff\/v1\/mandate.*/, createDelegationMapper(createDelegationPayload))
      .reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(errorMock.data);
  });

  it("can't create a new delegation (duplicated)", async () => {
    mock
      .onPost('/bff/v1/mandate', createDelegationMapper(createDelegationPayload))
      .reply(400, createDelegationDuplicatedErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationDuplicatedErrorResponse);
  });

  it('fecth parties list', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const action = await store.dispatch(getAllEntities(null));
    expect(action.type).toBe('getAllEntities/fulfilled');
    expect(action.payload).toEqual(parties);
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;
    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state.created).toBeFalsy();
    expect(state.error).toBeFalsy();
  });
});
