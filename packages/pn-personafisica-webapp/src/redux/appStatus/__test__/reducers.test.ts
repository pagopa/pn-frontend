import MockAdapter from 'axios-mock-adapter';

import { DOWNTIME_HISTORY, DOWNTIME_STATUS } from '@pagopa-pn/pn-commons';

import {
  currentStatusDTO,
  currentStatusOk,
  downtimesDTO,
  simpleDowntimeLogPage,
} from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from '../actions';
import { clearPagination, setPagination } from '../reducers';

describe('App Status redux state tests', () => {
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
    const state = store.getState().appStatus;
    expect(state).toEqual({ pagination: { size: 10, page: 0, resultPages: ['0'] } });
  });

  it('Should be able to fetch the current status', async () => {
    mock.onGet(DOWNTIME_STATUS()).reply(200, currentStatusDTO);
    const action = await store.dispatch(getCurrentAppStatus());
    expect(action.type).toBe('getCurrentAppStatus/fulfilled');
    expect(action.payload).toEqual({
      ...currentStatusOk,
      lastCheckTimestamp: new Date().toISOString().slice(0, -5) + 'Z',
    });
  });

  it('Should be able to fetch a downtime page', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock.onGet(DOWNTIME_HISTORY(mockRequest)).reply(200, downtimesDTO);
    const action = await store.dispatch(getDowntimeLogPage(mockRequest));
    expect(action.type).toBe('getDowntimeLogPage/fulfilled');
    expect(action.payload).toEqual(simpleDowntimeLogPage);
  });

  it('Should set the pagination', async () => {
    const paginationData = { page: 5, size: 123 };
    const action = store.dispatch(setPagination(paginationData));
    expect(action.payload).toEqual(paginationData);
    const appState = store.getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ['0'] });
  });

  it('Should reset the pagination', async () => {
    const paginationData = { page: 5, size: 123 };
    store.dispatch(setPagination(paginationData));
    const appState = store.getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ['0'] });
    store.dispatch(clearPagination());
    const clearedAppState = store.getState().appStatus;
    expect(clearedAppState.pagination).toEqual({ size: 10, page: 0, resultPages: ['0'] });
  });
});
