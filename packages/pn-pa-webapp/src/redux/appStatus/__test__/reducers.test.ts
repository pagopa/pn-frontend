import MockAdapter from 'axios-mock-adapter';
import { AppCurrentStatus, DowntimeLogPage } from '@pagopa-pn/pn-commons';
import {
  DOWNTIME_HISTORY,
  DOWNTIME_STATUS,
} from '@pagopa-pn/pn-commons/src/api/appStatus/appStatus.routes';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  currentStatusDTO,
  currentStatusOk,
  downtimesDTO,
  simpleDowntimeLogPage,
} from '../../../__mocks__/AppStatus.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from '../actions';

describe('App Status redux state tests', () => {
  // eslint-disable-next-line functional/no-let
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
    mock.onGet(DOWNTIME_HISTORY(mockRequest)).reply(200, downtimesDTO);
    const action = await store.dispatch(getDowntimeLogPage(mockRequest));
    const payload = action.payload as DowntimeLogPage;
    expect(action.type).toBe('getDowntimeLogPage/fulfilled');
    expect(payload).toEqual(simpleDowntimeLogPage);
  });
});
