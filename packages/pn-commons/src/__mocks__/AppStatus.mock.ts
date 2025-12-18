import {
  AppCurrentStatus,
  DowntimeLogHistory,
  DowntimeStatus,
  GetDowntimeHistoryParams,
  KnownFunctionality,
} from '../models/AppStatus';

export const incidentTimestamps = [
  '2022-10-21T06:07:08Z',
  '2022-10-21T06:07:05Z',
  '2022-10-23T15:50:04Z',
  '2022-10-23T15:51:12Z',
  '2022-10-24T08:15:21Z',
  '2022-10-24T08:15:29Z',
  '2022-10-28T10:11:09Z',
];

/* ------------------------------------------------------------------------
   Mock query params for API calls
   ------------------------------------------------------------------------ */
export const downtimeHistoryEmptyQueryParams: GetDowntimeHistoryParams = {
  startDate: incidentTimestamps[0],
};

/* ------------------------------------------------------------------------
     BE mock responses for tests
     ------------------------------------------------------------------------ */
export const beAppStatusOK: AppCurrentStatus = {
  appIsFullyOperative: true,
  lastCheckTimestamp: new Date().toISOString(),
};

export const beAppStatusKO: AppCurrentStatus = {
  appIsFullyOperative: false,
  lastCheckTimestamp: new Date().toISOString(),
};

export const beDowntimeHistoryNoIncidents: DowntimeLogHistory = {
  result: [],
};

export const beDowntimeHistoryWithIncidents: DowntimeLogHistory = {
  result: [
    {
      functionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
    {
      functionality: 'NEW_FUNCTIONALITY' as KnownFunctionality,
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[4],
      endDate: incidentTimestamps[5],
      fileAvailable: false,
    },
    {
      functionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: incidentTimestamps[6],
    },
  ],
  nextPage: 'some-next-page',
};
