import { AppCurrentStatus, DowntimeLogPage,  } from "@pagopa-pn/pn-commons";
import { AppStatusApi } from "../../../api/appStatus/AppStatus.api";
import { mockAuthentication } from "../../auth/__test__/test-utils";
import { store } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from "../actions";
import { currentStatusOk, simpleDowntimeLogPage } from "./test-utils";
import {clearPagination, setPagination} from "../reducers";


describe('App Status redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().appStatus;
    expect(state).toEqual({pagination: { size: 10, page: 0, resultPages: ["0"] }});
  });

  it('Should be able to fetch the current status', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getCurrentStatus');
    apiSpy.mockResolvedValue(currentStatusOk);
    const action = await store.dispatch(
      getCurrentAppStatus()
    );
    const payload = action.payload as AppCurrentStatus;
    expect(action.type).toBe('getCurrentAppStatus/fulfilled');
    expect(payload).toEqual(currentStatusOk);
  });

  it('Should be able to fetch a downtime page', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getDowntimeLogPage');
    apiSpy.mockResolvedValue(simpleDowntimeLogPage);
    const action = await store.dispatch(
      getDowntimeLogPage({ startDate: '2012-11-01T00:00:00Z' })
    );
    const payload = action.payload as DowntimeLogPage;
    expect(action.type).toBe('getDowntimeLogPage/fulfilled');
    expect(payload).toEqual(simpleDowntimeLogPage);
  });

  it('Should set the pagination', async () => {
    const paginationData = { page: 5, size: 123 }
    const action = store.dispatch(
      setPagination(paginationData)
    );
    const payload = action.payload;
    expect(payload).toEqual(paginationData);
    const appState = store.getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ["0"]});
  });

  it('Should reset the pagination', async () => {
    const paginationData = { page: 5, size: 123 }
    store.dispatch(setPagination(paginationData));
    const appState = store.getState().appStatus;
    expect(appState.pagination).toEqual({ ...paginationData, resultPages: ["0"]});

    store.dispatch(clearPagination());
    const clearedAppState = store.getState().appStatus;

    expect(clearedAppState.pagination).toEqual({ size: 10, page: 0, resultPages: ["0"] });
  });
});