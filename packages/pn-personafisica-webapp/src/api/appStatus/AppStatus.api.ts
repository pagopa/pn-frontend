import * as yup from 'yup';
import { dataRegex } from '@pagopa-pn/pn-commons';
import { IncidentStatus, isKnownFunctionality, KnownFunctionality } from './appStatus.api.types';
import { apiClient } from '../axios';
import { DOWNTIME_STATUS } from './appStatus.routes';

function minutesBeforeNow(n: number): string {
  const dateObject = new Date();
  dateObject.setTime(dateObject.getTime() - (60000 * n));
  return dateObject.toISOString();
}

/** 
 * Possible errors
 * - functionality not in the expected set 
 *   (if possible, taken from the response from /downtime/v1/status)
 *   but in order to verify it, I should be able to access the Redux store
 *   (to avoid re-fetching the set of functionalities each time incidents are retrieved).
 *   Hence I won't validate, and rather indicate "unknown functionality" in the FE.
 * - status not in the IncidentStatus set
 * - startDate not a valid date
 * - endDate, if present, not a valid date
 */
interface BEIncident {
  functionality: string;
  status: string;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

/**
 * Possible errors: just those of incidents
 */
interface BEStatus {
  functionalities: string[];
  openIncidents: BEIncident[];
}

interface BEDowntimePage {
  result: BEIncident[];
  nextPage?: string;
}

const beIncidentMatcher = yup.object({
  functionality: yup.string().required(),
  status: yup.string().oneOf(Object.values(IncidentStatus) as string[]).required(),
  startDate: yup.string().matches(dataRegex.isoDate).test(
    'is-real-date',
    "is not a real date",
    (value) => !value || !Number.isNaN(Date.parse(value))
  ).required(),
  endDate: yup.string().matches(dataRegex.isoDate).test(
    'is-real-date',
    "is not a real date",
    (value) => !value || !Number.isNaN(Date.parse(value))
  ).notRequired(),
  legalFactId: yup.string().notRequired(),
  fileAvailable: yup.boolean().notRequired(),
});

const beStatusMatcher = yup.object({
  functionalities: yup.array().of(yup.string()).required(),
  openIncidents: yup.array().of(beIncidentMatcher).required(),
});

const beDowntimePageMatcher = yup.object({
  result: yup.array().of(beIncidentMatcher).required(),
  nextPage: yup.string().notRequired(),
});

const statusResponseExample: BEStatus = {
  functionalities: [
    "NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZZATION", "NOTIFICATION_WORKFLOW"
  ],
  openIncidents: [{
    functionality: "NOTIFICATION_WORKFLOW",
    status: "KO",
    startDate: minutesBeforeNow(1),
  }],
};


export interface Incident {
  rawFuncionality: string;
  knownFunctionality?: KnownFunctionality;
  status: IncidentStatus;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

export interface FunctionalityStatus {
  rawFunctionality: string;
  knownFunctionality?: KnownFunctionality;
  isOperative: boolean;
  currentIncident?: Incident;
}

export interface AppCurrentStatus {
  appIsFullyOperative: boolean;
  statusByFunctionality: FunctionalityStatus[];
}


function beIncidentToFeIncident(incident: BEIncident): Incident {
  return {
    rawFuncionality: incident.functionality,
     // cfr. https://github.com/microsoft/TypeScript/issues/33200#issuecomment-527670779
    knownFunctionality: isKnownFunctionality(incident.functionality) ? incident.functionality as KnownFunctionality : undefined,
    status: incident.status as IncidentStatus,
    startDate: incident.startDate,
    endDate: incident.endDate,
    legalFactId: incident.legalFactId,
    fileAvailable: incident.fileAvailable,
  }
}
function beDowntimeStatusToFunctionalityCurrentStatus(functionality: KnownFunctionality, beStatus: BEStatus): FunctionalityStatus {
  const currentIncident = beStatus.openIncidents.find(incident => incident.functionality === functionality);
  if (currentIncident) {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: false,
      currentIncident: beIncidentToFeIncident(currentIncident),
    }
  } else {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: true,
    }
  }
}

function unknownIncidentToFunctionalityCurrentStatus(incident: BEIncident): FunctionalityStatus {
  return {
    rawFunctionality: incident.functionality,
    isOperative: false,
    currentIncident: beIncidentToFeIncident(incident),
  }
}

function beDowntimeStatusToFeAppStatus(beStatus: BEStatus): AppCurrentStatus {
  const statusByFunctionality = {
    ...Object.values(KnownFunctionality).map(funct => beDowntimeStatusToFunctionalityCurrentStatus(funct, beStatus)),
    ...beStatus.openIncidents
      .filter(incident => !isKnownFunctionality(incident.functionality))
      .map(incident => unknownIncidentToFunctionalityCurrentStatus(incident))
  };

  return {
    appIsFullyOperative: beStatus.openIncidents.length === 0,
    statusByFunctionality
  }
}



const useMockResponseData = false;

export const AppStatusApi = {
  /**
   * Specific possible error: obtaining an open incident with status "OK"
   */
  getCurrentStatus: async (): Promise<AppCurrentStatus> => {
    /* eslint-disable functional/no-let */
    let apiResponse: BEStatus;

    if (useMockResponseData) {
      apiResponse = statusResponseExample;
    } else {
      const realApiResponse = await apiClient.get<BEStatus>(DOWNTIME_STATUS());
      apiResponse = realApiResponse.data;
    }

    // yup validation
    try {
      beStatusMatcher.validateSync(apiResponse);
    } catch (err) {
      return Promise.reject({ response: { status: 500 } });
    }

    // extra validation: open incident with status "OK"
    if (apiResponse.openIncidents.some(incident => incident.status === IncidentStatus.OK)) {
      return Promise.reject({ response: { status: 500 } });
    }

    // finally the response
    return beDowntimeStatusToFeAppStatus(apiResponse);
  },
}

