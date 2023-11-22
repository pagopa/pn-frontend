import MockAdapter from 'axios-mock-adapter';

import { DOWNTIME_HISTORY, DOWNTIME_STATUS } from '@pagopa-pn/pn-commons';
import {
  clearPagination,
  setPagination,
} from '@pagopa-pn/pn-personafisica-webapp/src/redux/appStatus/reducers';

import {
  currentStatusDTO,
  currentStatusOk,
  downtimesDTO,
  simpleDowntimeLogPage,
} from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { getApiClient } from '../../../api/apiClients';
import { getStore } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from '../actions';

describe('App Status redux state tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = getStore().getState().appStatus;
    expect(state).toEqual({ pagination: { size: 10, page: 0, resultPages: ['0'] } });
  });

  it('Should be able to fetch the current status', async () => {
    mock.onGet(DOWNTIME_STATUS()).reply(200, currentStatusDTO);
    const action = await getStore().dispatch(getCurrentAppStatus());
    expect(action.type).toBe('getCurrentAppStatus/fulfilled');
    expect(action.payload).toEqual({
      ...currentStatusOk,
      lastCheckTimestamp: new Date().toISOString().slice(0, -5) + 'Z',
    });
  });

  it('Should be able to fetch a downtime page', async () => {
    const mockRequest = { startDate: '2012-11-01T00:00:00Z' };
    mock.onGet(DOWNTIME_HISTORY(mockRequest)).reply(200, downtimesDTO);
    const action = await getStore().dispatch(getDowntimeLogPage(mockRequest));
    expect(action.type).toBe('getDowntimeLogPage/fulfilled');
    expect(action.payload).toEqual(simpleDowntimeLogPage);
  });

  it('Should set the pagination', async () => {
    const paginationData = { page: 5, size: 123 };
    const action = getStore().dispatch(setPagination(paginationData));
    expect(action.payload).toEqual(paginationData);
    const appState = getStore().getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ['0'] });
  });

  it('Should reset the pagination', async () => {
    const paginationData = { page: 5, size: 123 };
    getStore().dispatch(setPagination(paginationData));
    const appState = getStore().getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ['0'] });

    getStore().dispatch(clearPagination());
    const clearedAppState = getStore().getState().appStatus;

    expect(clearedAppState.pagination).toEqual({ size: 10, page: 0, resultPages: ['0'] });
  });
});
