import { AppCurrentStatus, DowntimeLogPage, KnownFunctionality } from '@pagopa-pn/pn-commons';
import { AppStatusApi } from '../../../api/appStatus/AppStatus.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from '../actions';
import {
  currentStatusFromBE,
  currentStatusOk,
  downtimesFromBe,
  simpleDowntimeLogPage,
} from './test-utils';
import MockAdapter from 'axios-mock-adapter';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  DOWNTIME_HISTORY,
  DOWNTIME_STATUS,
} from '@pagopa-pn/pn-commons/src/api/appStatus/appStatus.routes';

describe('App Status redux state tests', () => {
  mockAuthentication();
  let mock: MockAdapter;

  afterEach(() => {
    if (mock) {
      mock.reset();
      mock.restore();
    }
  });

  it('Initial state', () => {
    const state = store.getState().appStatus;
    expect(state).toEqual({ pagination: { size: 10, page: 0, resultPages: ['0'] } });
  });

  it('Should be able to fetch the current status', async () => {
    mock = mockApi(apiClient, 'GET', DOWNTIME_STATUS(), 200, undefined, currentStatusFromBE);
    const action = await store.dispatch(getCurrentAppStatus());
    const payload = action.payload as AppCurrentStatus;
    expect(action.type).toBe('getCurrentAppStatus/fulfilled');
    expect(payload).toEqual({
      ...currentStatusOk,
      lastCheckTimestamp: new Date().toISOString().slice(0, -5) + 'Z',
    });
  });

  it('Should be able to fetch a downtime page', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock = mockApi(
      apiClient,
      'GET',
      DOWNTIME_HISTORY(mockRequest),
      200,
      undefined,
      downtimesFromBe
    );
    const action = await store.dispatch(getDowntimeLogPage(mockRequest));
    const payload = action.payload as DowntimeLogPage;
    expect(action.type).toBe('getDowntimeLogPage/fulfilled');
    expect(payload).toEqual(simpleDowntimeLogPage);
  });
});
