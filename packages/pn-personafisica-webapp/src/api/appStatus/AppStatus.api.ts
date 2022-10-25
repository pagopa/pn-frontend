import * as yup from 'yup';
import { dataRegex, minutesBeforeNow } from '@pagopa-pn/pn-commons';
import { AppCurrentStatus, BEIncident, BEStatus, BEStatusValidator, FunctionalityStatus, Incident, IncidentStatus, isKnownFunctionality, KnownFunctionality } from '../../models/appStatus';
import { apiClient } from '../axios';
import { DOWNTIME_STATUS } from './appStatus.routes';
import { Validator } from '@pagopa-pn/pn-validator';

interface BEDowntimePage {
  result: BEIncident[];
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
  openIncidents: [{
    functionality: "NOTIFICATION_WORKFLOW",
    status: "KO",
    startDate: minutesBeforeNow(1).toISOString(),
  }],
};
  
  
  // const beIncidentMatcher = yup.object({
//   functionality: yup.string().required(),
//   status: yup.string().oneOf(Object.values(IncidentStatus) as string[]).required(),
//   startDate: yup.string().matches(dataRegex.isoDate).test(
//     'is-real-date',
//     "is not a real date",
//     (value) => !value || !Number.isNaN(Date.parse(value))
//   ).required(),
//   endDate: yup.string().matches(dataRegex.isoDate).test(
//     'is-real-date',
//     "is not a real date",
//     (value) => !value || !Number.isNaN(Date.parse(value))
//   ).notRequired(),
//   legalFactId: yup.string().notRequired(),
//   fileAvailable: yup.boolean().notRequired(),
// });

// const beStatusMatcher = yup.object({
//   functionalities: yup.array().of(yup.string()).required(),
//   openIncidents: yup.array().of(beIncidentMatcher).required(),
// });

// const beDowntimePageMatcher = yup.object({
//   result: yup.array().of(beIncidentMatcher).required(),
//   nextPage: yup.string().notRequired(),
// });



/* ------------------------------------------------------------------------
   BE-FE transformations
   ------------------------------------------------------------------------ */

function beIncidentToFeIncident(incident: BEIncident): Incident {
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
  }
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
  }
}



/* ------------------------------------------------------------------------
   ... and finally the API ...
   ------------------------------------------------------------------------ */

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
}

