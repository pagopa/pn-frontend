import { minutesBeforeNow } from '@pagopa-pn/pn-commons';
import { AppCurrentStatus, BEDowntimePageValidator, BEIncident, BEStatus, BEStatusValidator, FunctionalityStatus, GetDowntimeHistoryParams, Incident, IncidentsPage, IncidentStatus, isKnownFunctionality, KnownFunctionality } from '../../models/appStatus';
import { apiClient } from '../axios';
import { DOWNTIME_HISTORY, DOWNTIME_STATUS } from './appStatus.routes';

interface BEDowntimePage {
  result: Array<BEIncident>;
  nextPage?: string;
}

export class BadApiDataException extends Error {
  constructor(message: string, public details: any) {
    super(message);
  }
}


/* ------------------------------------------------------------------------
   Provisional BE response mocks until we have an operative API to work with
   ------------------------------------------------------------------------ */

const statusResponseExample: BEStatus = {
  functionalities: [
    "NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZZATION", "NOTIFICATION_WORKFLOW"
  ],
  openIncidents: [
    // {
    //   functionality: "NOTIFICATION_WORKFLOW",
    //   status: "KO",
    //   startDate: minutesBeforeNow(1).toISOString(),
    // }
  ],
};
  
const downtimePageResponseExample: BEDowntimePage = {
  result: [
    {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: minutesBeforeNow(20).toISOString(),
      endDate: minutesBeforeNow(16).toISOString(),
      legalFactId: "some-legal-fact-id",
      fileAvailable: true,
    },
    {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: minutesBeforeNow(5).toISOString(),
      endDate: minutesBeforeNow(3).toISOString(),
      fileAvailable: false,
    },
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: minutesBeforeNow(1).toISOString(),
    }
  ],
};


/* ------------------------------------------------------------------------
   the API
   ------------------------------------------------------------------------ */

const useMockResponseData = true;

export const AppStatusApi = {
  getCurrentStatus: async (): Promise<AppCurrentStatus> => {
    /* eslint-disable functional/no-let */
    let apiResponse: BEStatus;

    if (useMockResponseData) {
      apiResponse = statusResponseExample;
    } else {
      const realApiResponse = await apiClient.get<BEStatus>(DOWNTIME_STATUS());
      apiResponse = realApiResponse.data;
    }

    // pn-validator validation
    const validationResult = new BEStatusValidator().validate(apiResponse);
    if (validationResult != null) {
      throw new BadApiDataException('Wrong-formed data', validationResult);
    }

    // extra validation: open incident with status "OK"
    if (apiResponse.openIncidents.some(incident => incident.status === IncidentStatus.OK)) {
      throw new BadApiDataException('Wrong data - an open incident cannot have status OK', {});
    }

    // finally the response
    return beDowntimeStatusToFeAppStatus(apiResponse);
  },

  getDowntimePage: async (params: GetDowntimeHistoryParams): Promise<IncidentsPage> => {
    /* eslint-disable functional/no-let */
    let apiResponse: BEDowntimePage;

    if (useMockResponseData) {
      apiResponse = downtimePageResponseExample;
    } else {
      const realApiResponse = await apiClient.get<BEDowntimePage>(DOWNTIME_HISTORY(params));
      apiResponse = realApiResponse.data;
    }

    // pn-validator validation
    const validationResult = new BEDowntimePageValidator().validate(apiResponse);
    if (validationResult != null) {
      throw new BadApiDataException('Wrong-formed data', validationResult);
    }

    // finally the response
    return beDowntimePageToFeIncidentPage(apiResponse);
  }
};


/* ------------------------------------------------------------------------
   BE-FE transformations
   ------------------------------------------------------------------------ */

function beIncidentToFeIncident(incident: BEIncident): Incident {
  /* eslint-disable functional/immutable-data */
  const result: Incident = {
    rawFunctionality: incident.functionality,
    status: incident.status as IncidentStatus,
    startDate: incident.startDate,
  };
     
  if (isKnownFunctionality(incident.functionality)) {
    // cfr. https://github.com/microsoft/TypeScript/issues/33200#issuecomment-527670779
    result.knownFunctionality = incident.functionality as KnownFunctionality;
  }
  if (incident.endDate !== undefined) {
    result.endDate = incident.endDate;
  }
  if (incident.legalFactId !== undefined) {
    result.legalFactId = incident.legalFactId;
  }
  if (incident.fileAvailable !== undefined) {
    result.fileAvailable = incident.fileAvailable;
  }

  return result;
}

function beDowntimeStatusToFunctionalityCurrentStatus(functionality: KnownFunctionality, beStatus: BEStatus): FunctionalityStatus {
  const currentIncident = beStatus.openIncidents.find(incident => incident.functionality === functionality);
  if (currentIncident) {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: false,
      currentIncident: beIncidentToFeIncident(currentIncident),
    };
  } else {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: true,
    };
  }
}

function unknownIncidentToFunctionalityCurrentStatus(incident: BEIncident): FunctionalityStatus {
  return {
    rawFunctionality: incident.functionality,
    isOperative: false,
    currentIncident: beIncidentToFeIncident(incident),
  };
}

function beDowntimeStatusToFeAppStatus(beStatus: BEStatus): AppCurrentStatus {
  const statusByFunctionality = [
    ...Object.values(KnownFunctionality).map(funct => beDowntimeStatusToFunctionalityCurrentStatus(funct, beStatus)),
    ...beStatus.openIncidents
      .filter(incident => !isKnownFunctionality(incident.functionality))
      .map(incident => unknownIncidentToFunctionalityCurrentStatus(incident))
  ];

  return {
    appIsFullyOperative: beStatus.openIncidents.length === 0,
    statusByFunctionality
  };
}

function beDowntimePageToFeIncidentPage(beDowntimePage: BEDowntimePage): IncidentsPage {
  /* eslint-disable functional/immutable-data */
  const result: IncidentsPage = {
    incidents: beDowntimePage.result.map(beIncidentToFeIncident),
  };
  if (beDowntimePage.nextPage) {
    result.nextPage = beDowntimePage.nextPage;
  }
  return result;
}

