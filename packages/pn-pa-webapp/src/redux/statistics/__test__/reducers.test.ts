import MockAdapter from 'axios-mock-adapter';

import { oneMonthAgo, today, twelveMonthsAgo } from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { filters, parsedResponseMock, rawResponseMock } from '../../../__mocks__/Statistics.mock';
import { apiClient } from '../../../api/apiClients';
import {
  CxType,
  SelectedStatisticsFilter,
  StatisticsParams,
  StatisticsParsedResponse,
} from '../../../models/Statistics';
import { store } from '../../store';
import { getStatistics } from '../actions';
import { resetState, setStatisticsFilter } from '../reducers';

const initialState = {
  loading: false,
  statistics: null,
  filter: {
    startDate: twelveMonthsAgo,
    endDate: today,
    selected: SelectedStatisticsFilter.last12Months,
  },
};

const requestParams: StatisticsParams<Date> = {
  cxType: CxType.PA,
  cxId: 'cx-id',
  startDate: oneMonthAgo,
  endDate: today,
};

describe('Statistics redux state tests', () => {
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

  it('should set initial state', () => {
    const state = store.getState().statisticsState;
    expect(state).toEqual(initialState);
  });

  it('should fetch statistics data on success', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(200, rawResponseMock);
    const action = await store.dispatch(getStatistics(requestParams));
    const payload = action.payload as StatisticsParsedResponse;

    expect(action.type).toBe('getStatistics/fulfilled');
    expect(payload).toEqual(parsedResponseMock);
  });

  it('should handle empty response', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(204, null);
    const action = await store.dispatch(getStatistics(requestParams));
    const payload = action.payload;
    expect(action.type).toBe('getStatistics/fulfilled');
    expect(payload).toBeNull();

    const state = store.getState().statisticsState.statistics;

    expect(state).toBeNull();
  });

  it('should handle error response', async () => {
    mock
      .onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/)
      .reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(getStatistics(requestParams));
    const payload = action.payload;
    expect(action.type).toBe('getStatistics/rejected');
    expect(payload).toEqual({ response: errorMock });
  });

  it('should reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('statisticsSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().statisticsState;
    expect(state).toEqual(initialState);
  });

  it('should set filter value', () => {
    const action = store.dispatch(setStatisticsFilter(filters[0]));
    let payload = action.payload;
    expect(action.type).toBe('statisticsSlice/setStatisticsFilter');
    expect(payload).toEqual(filters[0]);
    let filter = store.getState().statisticsState.filter;
    expect(filter).toEqual(filters[0]);

    store.dispatch(setStatisticsFilter(filters[1]));
    filter = store.getState().statisticsState.filter;
    expect(filter).toEqual(filters[1]);

    store.dispatch(setStatisticsFilter(filters[2]));
    filter = store.getState().statisticsState.filter;
    expect(filter).toEqual(filters[2]);
  });
});
