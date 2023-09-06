import {
  AppCurrentStatus,
  AppStatusDTO,
  DowntimeLogPage,
  DowntimeStatus,
  KnownFunctionality,
} from '@pagopa-pn/pn-commons';

export const currentStatusDTO: AppStatusDTO = {
  functionalities: ['NOTIFICATION_CREATE', 'NOTIFICATION_VISUALIZATION', 'NOTIFICATION_WORKFLOW'],
  openIncidents: [],
};

export const currentStatusOk: AppCurrentStatus = {
  appIsFullyOperative: true,
  statusByFunctionality: [
    {
      rawFunctionality: KnownFunctionality.NotificationCreate,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      isOperative: true,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationVisualization,
      knownFunctionality: KnownFunctionality.NotificationVisualization,
      isOperative: true,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      isOperative: true,
    },
  ],
  lastCheckTimestamp: new Date().toISOString().slice(0, -5) + 'Z',
};

export const downtimesDTO = {
  result: [
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'OK',
      startDate: '2022-10-23T15:50:04Z',
      endDate: '2022-10-23T15:51:12Z',
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
    {
      functionality: 'NOTIFICATION_WORKFLOW',
      status: 'KO',
      startDate: '2022-10-28T19:24:08Z',
    },
  ],
  nextPage: '1',
};

export const simpleDowntimeLogPage: DowntimeLogPage = {
  downtimes: [
    {
      rawFunctionality: KnownFunctionality.NotificationCreate,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: '2022-10-23T15:50:04Z',
      endDate: '2022-10-23T15:51:12Z',
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: '2022-10-28T19:24:08Z',
      fileAvailable: false,
    },
  ],
  nextPage: '1',
};
