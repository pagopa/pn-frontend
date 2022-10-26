import { AppStatusApi } from "../../../api/appStatus/AppStatus.api";
import { AppCurrentStatus, IncidentsPage } from "../../../models/appStatus";
import { mockAuthentication } from "../../auth/__test__/test-utils";
import { store } from '../../store';
import { getCurrentStatus, getIncidentsPage } from "../actions";
import { currentStatusOk, simpleDowntimePage } from "./test-utils";


describe('App Status redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().appStatus;
    expect(state).toEqual({});
  });

  it('Should be able to fetch the current status', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getCurrentStatus');
    apiSpy.mockResolvedValue(currentStatusOk);
    const action = await store.dispatch(
      getCurrentStatus()
    );
    const payload = action.payload as AppCurrentStatus;
    expect(action.type).toBe('getCurrentStatus/fulfilled');
    expect(payload).toEqual(currentStatusOk);
  });

  it('Should be able to fetch a downtime page', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getDowntimePage');
    apiSpy.mockResolvedValue(simpleDowntimePage);
    const action = await store.dispatch(
      getIncidentsPage({ startDate: '2012-11-01T00:00:00Z' })
    );
    const payload = action.payload as IncidentsPage;
    expect(action.type).toBe('getIncidentsPage/fulfilled');
    expect(payload).toEqual(simpleDowntimePage);
  });

});