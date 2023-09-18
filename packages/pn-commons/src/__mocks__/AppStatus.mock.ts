import {
  AppStatusDTO,
  DowntimeLogPage,
  DowntimeLogPageDTO,
  DowntimeStatus,
  GetDowntimeHistoryParams,
  KnownFunctionality,
} from '../models';

/* ------------------------------------------------------------------------
   auxiliary functions and constants
   ------------------------------------------------------------------------ */
export const knownFunctionalities = [
  'NOTIFICATION_CREATE',
  'NOTIFICATION_VISUALIZATION',
  'NOTIFICATION_WORKFLOW',
];

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
export const beAppStatusNoIncidents: AppStatusDTO = {
  functionalities: knownFunctionalities,
  openIncidents: [],
};

export const beAppStatusOneIncident: AppStatusDTO = {
  ...beAppStatusNoIncidents,
  openIncidents: [
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: incidentTimestamps[0],
    },
  ],
};

export const beAppStatusTwoIncidentsNormalCase: AppStatusDTO = {
  ...beAppStatusNoIncidents,
  openIncidents: [
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: incidentTimestamps[1],
    },
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'KO',
      startDate: incidentTimestamps[0],
    },
  ],
};

export const beAppStatusTwoIncidentsOneUnknownFunctionality: AppStatusDTO = {
  ...beAppStatusNoIncidents,
  openIncidents: [
    {
      functionality: 'NOTIFICATION_VISUALIZATION',
      status: 'KO',
      startDate: incidentTimestamps[1],
    },
    {
      functionality: 'NOTIFICATION_OTHER',
      status: 'KO',
      startDate: incidentTimestamps[0],
    },
  ],
};

export const beAppStatusOneFinishedDowntimeAsOpenIncident: AppStatusDTO = {
  ...beAppStatusNoIncidents,
  openIncidents: [
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
    },
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'KO',
      startDate: incidentTimestamps[0],
    },
  ],
};

export const beAppStatusOneIncidentWithError: AppStatusDTO = {
  ...beAppStatusNoIncidents,
  openIncidents: [
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: incidentTimestamps[1],
    },
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'KO',
      startDate: 'bad-date',
    },
  ],
};

export const beDowntimeHistoryNoIncidents: DowntimeLogPageDTO = {
  result: [],
};

export const beDowntimeHistoryThreeIncidents: DowntimeLogPageDTO = {
  result: [
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'OK',
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
    {
      functionality: 'NEW_FUNCTIONALITY',
      status: 'OK',
      startDate: incidentTimestamps[4],
      endDate: incidentTimestamps[5],
      fileAvailable: false,
    },
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: incidentTimestamps[6],
    },
  ],
  nextPage: 'some-next-page',
};

export const exampleDowntimeLogPage: DowntimeLogPage = {
  downtimes: [
    {
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: incidentTimestamps[4],
      fileAvailable: false,
    },
    {
      rawFunctionality: 'NEW_FUNCTIONALITY',
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
      fileAvailable: false,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationCreate,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: incidentTimestamps[0],
      endDate: incidentTimestamps[1],
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
  ],
};
