import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { createMockedStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { BffCheckTPPResponse } from '../../../generated-client/notifications';
import { acceptMandate, rejectMandate } from '../../delegation/actions';
import { store } from '../../store';
import { exchangeNotificationRetrievalId, getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';

const initialState = {
  pendingDelegators: 0,
  delegators: [],
  domicileBannerOpened: true,
  paymentTpp: {},
};

const pendingDelegators = mandatesByDelegate.filter((d) => d.status === 'pending');
const activeDelegators = mandatesByDelegate.filter((d) => d.status === 'active');

describe('Sidemenu redux state tests', () => {
  let mock: MockAdapter;
  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().generalInfoState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to close domicile banner', () => {
    const action = store.dispatch(closeDomicileBanner());
    expect(action.type).toBe('generalInfoSlice/closeDomicileBanner');
    const state = store.getState().generalInfoState;
    expect(state).toEqual({ ...initialState, domicileBannerOpened: false });
  });

  it('Should load state properly', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    const action = await store.dispatch(getSidemenuInformation());
    expect(action.type).toBe('getSidemenuInformation/fulfilled');
    expect(action.payload).toEqual(mandatesByDelegate);
    const state = store.getState().generalInfoState;
    expect(state.delegators).toHaveLength(activeDelegators.length);
    expect(state.pendingDelegators).toBe(pendingDelegators.length);
  });

  it('Should update state after accepting a delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegators[0].mandateId}/accept`).reply(204);
    const action = await testStore.dispatch(
      acceptMandate({ id: pendingDelegators[0].mandateId, code: '12345' })
    );
    expect(action.type).toBe('acceptMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().generalInfoState;
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegators[0].mandateId}/reject`).reply(204);
    const action = await testStore.dispatch(rejectMandate(pendingDelegators[0].mandateId));
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().generalInfoState;
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(state.delegators.length).toBe(activeDelegators.length);
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting an active delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock.onPatch(`/bff/v1/mandate/${activeDelegators[0].mandateId}/reject`).reply(204);
    const action = await testStore.dispatch(rejectMandate(activeDelegators[0].mandateId));
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().generalInfoState;
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(state.delegators.length).toBe(activeDelegators.length - 1);
    expect(state.pendingDelegators).toBe(pendingDelegators.length);
  });

  it('Should be able to set tpp info from retrievalId', async () => {
    const mockRetrievalId = 'mocked-retrieval-id';
    const mockResponse: BffCheckTPPResponse = {
      pspDenomination: 'Hype',
      retrievalId: mockRetrievalId,
      originId: 'mocked-iun',
      isPaymentEnabled: true,
    };
    mock
      .onGet(`/bff/v1/notifications/received/check-tpp?retrievalId=${mockRetrievalId}`)
      .reply(200, mockResponse);
    const action = await store.dispatch(exchangeNotificationRetrievalId(mockRetrievalId));
    expect(action.type).toBe('exchangeNotificationRetrievalId/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });
});
