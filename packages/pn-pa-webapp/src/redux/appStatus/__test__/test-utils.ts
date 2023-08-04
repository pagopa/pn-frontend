import {
  AppCurrentStatus,
  AppStatusDTO,
  DowntimeLogPage,
  DowntimeStatus,
  KnownFunctionality,
} from '@pagopa-pn/pn-commons';

export const currentStatusFromBE: AppStatusDTO = {
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

export const downtimesFromBe = {
  result: [
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'KO',
      startDate: '2023-06-30T14:22:00Z',
      endDate: '2023-07-27T14:02:00Z',
      legalFactId: 'PN_DOWNTIME_LEGAL_FACTS-9b84a937c5b04ff5804d75535e78aaa3.pdf',
      fileAvailable: true,
    },
    {
      functionality: 'NOTIFICATION_CREATE',
      status: 'KO',
      startDate: '2023-06-20T13:18:00Z',
      endDate: '2023-06-20T13:20:00Z',
      legalFactId: 'PN_DOWNTIME_LEGAL_FACTS-c0c94158a3504d53942af13660c70d20.pdf',
      fileAvailable: false,
    },
  ],
  nextPage: '1',
};
export const simpleDowntimeLogPage: DowntimeLogPage = {
  downtimes: [
    {
      rawFunctionality: 'NOTIFICATION_CREATE',
      startDate: '2023-06-30T14:22:00Z',
      status: DowntimeStatus.OK,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      endDate: '2023-07-27T14:02:00Z',
      legalFactId: 'PN_DOWNTIME_LEGAL_FACTS-9b84a937c5b04ff5804d75535e78aaa3.pdf',
      fileAvailable: true,
    },
    {
      rawFunctionality: 'NOTIFICATION_CREATE',
      startDate: '2023-06-20T13:18:00Z',
      status: DowntimeStatus.OK,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      endDate: '2023-06-20T13:20:00Z',
      legalFactId: 'PN_DOWNTIME_LEGAL_FACTS-c0c94158a3504d53942af13660c70d20.pdf',
      fileAvailable: false,
    },
  ],
  nextPage: '1',
};
