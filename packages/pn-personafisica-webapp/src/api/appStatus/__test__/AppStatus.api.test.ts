import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { DOWNTIME_STATUS } from '../appStatus.routes';
import { beAppStatusNoIncidents, beAppStatusOneIncident, beAppStatusTwoIncidentsNormalCase, beAppStatusTwoIncidentsOneUnknownFunctionality, downStatusOnKnownFunctionality, downStatusOnUnknownFunctionality, incidentTimestamps, statusByFunctionalityOk } from './test-utils';
import { AppStatusApi } from '../AppStatus.api';
import { KnownFunctionality } from '../../../models/appStatus';


/* ------------------------------------------------------------------------
   The actual test suite
   ------------------------------------------------------------------------ */
describe("AppStatus api tests", () => {
	mockAuthentication();

	/* eslint-disable-next-line functional/no-let */
	let mock: MockAdapter;

	beforeEach(() => {
		mock = new MockAdapter(apiClient);
	});

	afterEach(() => {
    mock.reset();
    mock.restore();
	}); 

	it('get status - no incidents', async () => {
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusNoIncidents);
    const res = await AppStatusApi.getCurrentStatus();
    expect(res.appIsFullyOperative).toEqual(true);
		expect(new Set(res.statusByFunctionality)).toEqual(new Set(statusByFunctionalityOk()));
	});

	it('get status - one incident', async () => {
		const expectedStatusByFunctionality = [
			...statusByFunctionalityOk(KnownFunctionality.NotificationWorkflow),
			downStatusOnKnownFunctionality(KnownFunctionality.NotificationWorkflow, incidentTimestamps[0])
		];
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusOneIncident);
    const res = await AppStatusApi.getCurrentStatus();
    expect(res.appIsFullyOperative).toEqual(false);
		expect(new Set(res.statusByFunctionality)).toEqual(new Set(expectedStatusByFunctionality));
	});

	it('get status - two incidents on known functionalities', async () => {
		const expectedStatusByFunctionality = [
			{
				rawFunctionality: KnownFunctionality.NotificationVisualization, 
				knownFunctionality: KnownFunctionality.NotificationVisualization,
				isOperative: true,
			},
			downStatusOnKnownFunctionality(KnownFunctionality.NotificationWorkflow, incidentTimestamps[1]),
			downStatusOnKnownFunctionality(KnownFunctionality.NotificationCreate, incidentTimestamps[0])
		];
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusTwoIncidentsNormalCase);
    const res = await AppStatusApi.getCurrentStatus();
    expect(res.appIsFullyOperative).toEqual(false);
		expect(new Set(res.statusByFunctionality)).toEqual(new Set(expectedStatusByFunctionality));
	});

	it('get status - one incident on known functionality, one unknown functionality', async () => {
		const expectedStatusByFunctionality = [
			...statusByFunctionalityOk(KnownFunctionality.NotificationVisualization),
			downStatusOnKnownFunctionality(KnownFunctionality.NotificationVisualization, incidentTimestamps[1]),
			downStatusOnUnknownFunctionality("NOTIFICATION_OTHER", incidentTimestamps[0])
		];
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusTwoIncidentsOneUnknownFunctionality);
    const res = await AppStatusApi.getCurrentStatus();
    expect(res.appIsFullyOperative).toEqual(false);
		expect(new Set(res.statusByFunctionality)).toEqual(new Set(expectedStatusByFunctionality));
	});
});
