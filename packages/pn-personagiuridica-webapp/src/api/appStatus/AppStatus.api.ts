import { AppCurrentStatus, DowntimeLogPage, GetDowntimeHistoryParams, KnownFunctionality, DowntimeStatus, LegalFactDocumentDetails } from "@pagopa-pn/pn-commons";

export const AppStatusApi = {
  getCurrentStatus: async (): Promise<AppCurrentStatus> => Promise.resolve({
    statusByFunctionality: Object.values(KnownFunctionality)
      .map(func => ({
        rawFunctionality: func, 
        knownFunctionality: func,
        isOperative: true,
      })
    ),
    appIsFullyOperative: true,
    lastCheckTimestamp: "2022-12-28T15:43:19.190Z",
  }),

  getDowntimeLogPage: async (params: GetDowntimeHistoryParams): Promise<DowntimeLogPage> => params 
    ? Promise.resolve({
        downtimes: [
          {
            rawFunctionality: KnownFunctionality.NotificationWorkflow,
            knownFunctionality: KnownFunctionality.NotificationWorkflow,
            status: DowntimeStatus.OK,
            startDate: '2022-10-28T10:11:09Z',
            endDate: '2022-10-28T10:18:14Z',
            fileAvailable: false,    
          },
          {
            rawFunctionality: KnownFunctionality.NotificationCreate,
            knownFunctionality: KnownFunctionality.NotificationCreate,
            status: DowntimeStatus.OK,
            startDate: '2022-10-23T15:50:04Z',
            endDate: '2022-10-23T15:51:12Z',
            legalFactId: "some-legal-fact-id",
            fileAvailable: true,    
          },
        ],
      }) 
    : Promise.reject({ response: { status: 500 }}),

  /* eslint-disable-next-line arrow-body-style */
  getLegalFactDetails: async(legalFactId: string): Promise<LegalFactDocumentDetails> => Promise.reject({ response: { status: legalFactId ? 500 : 503 }}),
};
