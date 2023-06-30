import { AppCurrentStatus, DowntimeLogPage, DowntimeStatus, KnownFunctionality } from "@pagopa-pn/pn-commons";

export const currentStatusOk: AppCurrentStatus = {
  appIsFullyOperative: true,
  statusByFunctionality: [{
    rawFunctionality: KnownFunctionality.NotificationCreate,
    knownFunctionality: KnownFunctionality.NotificationCreate,
    isOperative: true,
  }],
  lastCheckTimestamp: "2022-10-28T06:07:08Z",
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
    }
  ]
}
