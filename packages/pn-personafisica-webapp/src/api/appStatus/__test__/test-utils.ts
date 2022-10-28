import { BEDowntimeLogPage, BEStatus, FunctionalityStatus, GetDowntimeHistoryParams, DowntimeStatus, KnownFunctionality } from "../../../models/appStatus";

/* ------------------------------------------------------------------------
   auxiliary functions and constants
   ------------------------------------------------------------------------ */
export const knownFunctionalities = [
  "NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZATION", "NOTIFICATION_WORKFLOW"
];

export const incidentTimestamps = [
  '2022-10-21T06:07:08Z',
  '2022-10-21T06:07:05Z',
  '2022-10-23T15:50:04Z',
  '2022-10-23T15:51:12Z',
  '2022-10-24T08:15:21Z',
  '2022-10-24T08:15:29Z',
  '2022-10-28T10:11:09Z',
]

export function statusByFunctionalityOk(...excludingFuncs: KnownFunctionality[]): FunctionalityStatus[] {
	return Object.values(KnownFunctionality)
		.filter(func => !excludingFuncs.includes(func))
		.map(func => ({
			rawFunctionality: func, 
			knownFunctionality: func,
			isOperative: true,
		})
	);
};

export function downStatusOnKnownFunctionality(func: KnownFunctionality, incidentTimestamp: string): FunctionalityStatus {
	return 				{
		rawFunctionality: func,
		knownFunctionality: func,
		isOperative: false,
		currentDowntime: {
			rawFunctionality: func,
			knownFunctionality: func,
			status: DowntimeStatus.KO,
			startDate: incidentTimestamp,
		}
	};
}

export function downStatusOnUnknownFunctionality(func: string, incidentTimestamp: string): FunctionalityStatus {
	return 				{
		rawFunctionality: func,
		isOperative: false,
		currentDowntime: {
			rawFunctionality: func,
			status: DowntimeStatus.KO,
			startDate: incidentTimestamp,
		}
	};
}

/* ------------------------------------------------------------------------
   Mock query params for API calls
   ------------------------------------------------------------------------ */
export const downtimeHistoryEmptyQueryParams: GetDowntimeHistoryParams = {
  startDate: incidentTimestamps[0],
}

/* ------------------------------------------------------------------------
   BE mock responses for tests
   ------------------------------------------------------------------------ */
export const beAppStatusNoIncidents: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [],
};

export const beAppStatusOneIncident: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [{
    functionality: "NOTIFICATION_WORKFLOW",
    status: "KO",
    startDate: incidentTimestamps[0],
  }],
};

export const beAppStatusTwoIncidentsNormalCase: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: incidentTimestamps[1],
    },
    {
      functionality: "NOTIFICATION_CREATE",
      status: "KO",
      startDate: incidentTimestamps[0],
    }
  ],
};

export const beAppStatusTwoIncidentsOneUnknownFunctionality: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [
    {
      functionality: "NOTIFICATION_VISUALIZATION",
      status: "KO",
      startDate: incidentTimestamps[1],
    },
    {
      functionality: "NOTIFICATION_OTHER",
      status: "KO",
      startDate: incidentTimestamps[0],
    }
  ],
};

export const beAppStatusOneFinishedDowntimeAsOpenIncident: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
    },
    {
      functionality: "NOTIFICATION_CREATE",
      status: "KO",
      startDate: incidentTimestamps[0],
    }
  ],
};

export const beAppStatusOneIncidentWithError: BEStatus = {
  functionalities: knownFunctionalities,
  openIncidents: [
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: incidentTimestamps[1],
    },
    {
      functionality: "NOTIFICATION_CREATE",
      status: "KO",
      startDate: "bad-date",
    }
  ],
};

export const beDowntimeHistoryNoIncidents: BEDowntimeLogPage = {
  result: []
};

export const beDowntimeHistoryThreeIncidents: BEDowntimeLogPage = {
  result: [
    {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: incidentTimestamps[2],
      endDate: incidentTimestamps[3],
      legalFactId: "some-legal-fact-id",
      fileAvailable: true,
    },
    {
      functionality: "NEW_FUNCTIONALITY",
      status: "OK",
      startDate: incidentTimestamps[4],
      endDate: incidentTimestamps[5],
      fileAvailable: false,
    },
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: incidentTimestamps[6],
    }
  ],
  nextPage: "some-next-page",
};

