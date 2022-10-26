import { AppCurrentStatus, IncidentsPage, IncidentStatus, KnownFunctionality } from "../../../models/appStatus";

export const currentStatusOk: AppCurrentStatus = {
  appIsFullyOperative: true,
  statusByFunctionality: [{
    rawFunctionality: KnownFunctionality.NotificationCreate,
    knownFunctionality: KnownFunctionality.NotificationCreate,
    isOperative: true,
  }]
};

export const simpleDowntimePage: IncidentsPage = {
  incidents: [
    {
      rawFunctionality: KnownFunctionality.NotificationCreate,
      knownFunctionality: KnownFunctionality.NotificationCreate,
      status: IncidentStatus.OK,
      startDate: '2022-10-23T15:50:04Z',
      endDate: '2022-10-23T15:51:12Z',
      legalFactId: 'some-legal-fact-id',
      fileAvailable: true,
    },
    {
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      status: IncidentStatus.KO,
      startDate: '2022-10-28T19:24:08Z',
    }
  ]
}
