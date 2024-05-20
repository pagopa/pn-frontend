import {
  AppCurrentStatus,
  DowntimeLogHistory,
  DowntimeStatus,
  KnownFunctionality,
} from '@pagopa-pn/pn-commons';

export const currentStatusDTO: AppCurrentStatus = {
  appIsFullyOperative: true,
  lastCheckTimestamp: new Date().toISOString(),
};

export const downtimesDTO: DowntimeLogHistory = {
  result: [
    {
      functionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: '2023-06-30T14:22:00Z',
      endDate: '2023-07-27T14:02:00Z',
      legalFactId: 'PN_DOWNTIME_LEGAL_FACTS-9b84a937c5b04ff5804d75535e78aaa3.pdf',
      fileAvailable: true,
    },
    {
      functionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: '2023-06-20T13:18:00Z',
    },
  ],
  nextPage: '1',
};
