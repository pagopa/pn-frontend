import { AppCurrentStatus, DowntimeLogPage,  } from "@pagopa-pn/pn-commons";
import { AppStatusApi } from "../../../api/appStatus/AppStatus.api";
import { mockAuthentication } from "../../auth/__test__/test-utils";
import { store } from '../../store';
import { getCurrentAppStatus, getDowntimeLogPage } from "../actions";
import { currentStatusOk, simpleDowntimeLogPage } from "./test-utils";


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

});