import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { DOWNTIME_HISTORY, DOWNTIME_STATUS } from '../appStatus.routes';
import { beAppStatusNoIncidents, beAppStatusOneIncident, beAppStatusOneFinishedDowntimeAsOpenIncident, beAppStatusOneIncidentWithError, beAppStatusTwoIncidentsNormalCase, beAppStatusTwoIncidentsOneUnknownFunctionality, beDowntimeHistoryNoIncidents, beDowntimeHistoryThreeIncidents, downStatusOnKnownFunctionality, downStatusOnUnknownFunctionality, downtimeHistoryEmptyQueryParams, incidentTimestamps, statusByFunctionalityOk } from './test-utils';
import { AppStatusApi, BadApiDataException } from '../AppStatus.api';
import { BEDowntimeLogPage, DowntimeLogPage, DowntimeStatus, KnownFunctionality } from '../../../models/appStatus';


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

  it('get status - no open incidents', async () => {
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusNoIncidents);
    const res = await AppStatusApi.getCurrentStatus();
    expect(res.appIsFullyOperative).toEqual(true);
    expect(new Set(res.statusByFunctionality)).toEqual(new Set(statusByFunctionalityOk()));
  });

  it('get status - one open incident', async () => {
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

  it('get status - one open incident on known functionality, one unknown functionality', async () => {
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

  it('get status - one open incident with end date set - API call fails', async () => {
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusOneFinishedDowntimeAsOpenIncident);
    ;
    await expect(AppStatusApi.getCurrentStatus()).rejects.toThrow(BadApiDataException);
  });

  it('get status - one ill-formed open incident - API call fails', async () => {
    mock
      .onGet(DOWNTIME_STATUS())
      .reply(200, beAppStatusOneIncidentWithError);
    ;
    await expect(AppStatusApi.getCurrentStatus()).rejects.toThrow(BadApiDataException);
  });

  it('get downtime history - no downtimes', async () => {
    mock
      .onGet(DOWNTIME_HISTORY(downtimeHistoryEmptyQueryParams))
      .reply(200, beDowntimeHistoryNoIncidents);
    const res = await AppStatusApi.getDowntimeLogPage(downtimeHistoryEmptyQueryParams);
    expect(res).toEqual({ downtimes: [] });
  });

  it('get downtime history - three downtimes', async () => {
    const expectedOutput: DowntimeLogPage = {
      downtimes: [
        {
          rawFunctionality: KnownFunctionality.NotificationCreate,
          knownFunctionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.OK,
          startDate: incidentTimestamps[2],
          endDate: incidentTimestamps[3],
          legalFactId: "some-legal-fact-id",
          fileAvailable: true,    
        },
        {
          rawFunctionality: "NEW_FUNCTIONALITY",
          status: DowntimeStatus.OK,
          startDate: incidentTimestamps[4],
          endDate: incidentTimestamps[5],
          fileAvailable: false,    
        },
        {
          rawFunctionality: KnownFunctionality.NotificationWorkflow,
          knownFunctionality: KnownFunctionality.NotificationWorkflow,
          status: DowntimeStatus.KO,
          startDate: incidentTimestamps[6],
        },
      ],
      nextPage: "some-next-page",
    }
    mock
      .onGet(DOWNTIME_HISTORY(downtimeHistoryEmptyQueryParams))
      .reply(200, beDowntimeHistoryThreeIncidents);
    const res = await AppStatusApi.getDowntimeLogPage(downtimeHistoryEmptyQueryParams);
    expect(res).toEqual(expectedOutput);
  });

  it('get downtime history - downtime with date in bad format - API call fails', async () => {
    const beDowntimeHistoryWithDateFormatError: BEDowntimeLogPage = {
      result: [ 
        beDowntimeHistoryThreeIncidents.result[0], 
        {...beDowntimeHistoryThreeIncidents.result[1], startDate: '2022-84-24T08:15:21Z'},
        beDowntimeHistoryThreeIncidents.result[2], 
      ],
      nextPage: "some-next-page",
    }
    mock
      .onGet(DOWNTIME_HISTORY(downtimeHistoryEmptyQueryParams))
      .reply(200, beDowntimeHistoryWithDateFormatError);
    await expect(AppStatusApi.getDowntimeLogPage(downtimeHistoryEmptyQueryParams)).rejects.toThrow(BadApiDataException);
  });

  it('get downtime history - downtime with functionality missing', async () => {
    const rottenIncidentRecord: any = {...beDowntimeHistoryThreeIncidents.result[1]};
    delete rottenIncidentRecord.functionality;

    const beDowntimeHistoryWithDateFormatError: any = {
      result: [ 
        beDowntimeHistoryThreeIncidents.result[0], 
        rottenIncidentRecord,
        beDowntimeHistoryThreeIncidents.result[2], 
      ],
      nextPage: "some-next-page",
    }
    mock
      .onGet(DOWNTIME_HISTORY(downtimeHistoryEmptyQueryParams))
      .reply(200, beDowntimeHistoryWithDateFormatError);
    await expect(AppStatusApi.getDowntimeLogPage(downtimeHistoryEmptyQueryParams)).rejects.toThrow(BadApiDataException);
  });
});
