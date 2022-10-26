import { minutesBeforeNow } from '@pagopa-pn/pn-commons';
import { AppCurrentStatus, BEDowntimeLogPageValidator, BEDowntime, BEStatus, BEStatusValidator, FunctionalityStatus, GetDowntimeHistoryParams, Downtime, DowntimeLogPage, DowntimeStatus, isKnownFunctionality, KnownFunctionality, BEDowntimeLogPage } from '../../models/appStatus';
import { apiClient } from '../axios';
import { DOWNTIME_HISTORY, DOWNTIME_STATUS } from './appStatus.routes';

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
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: minutesBeforeNow(1).toISOString(),
    }
  ],
};
  
const downtimeLogPageResponseExample: BEDowntimeLogPage = {
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

const useMockResponseData = process.env.NODE_ENV === 'development';

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
    if (apiResponse.openIncidents.some(downtime => downtime.status === DowntimeStatus.OK)) {
      throw new BadApiDataException('Wrong data - an open incident cannot have status OK', {});
    }

    // finally the response
    return beDowntimeStatusToFeAppStatus(apiResponse);
  },

  getDowntimeLogPage: async (params: GetDowntimeHistoryParams): Promise<DowntimeLogPage> => {
    /* eslint-disable functional/no-let */
    let apiResponse: BEDowntimeLogPage;

    if (useMockResponseData) {
      apiResponse = downtimeLogPageResponseExample;
    } else {
      const realApiResponse = await apiClient.get<BEDowntimeLogPage>(DOWNTIME_HISTORY(params));
      apiResponse = realApiResponse.data;
    }

    // pn-validator validation
    const validationResult = new BEDowntimeLogPageValidator().validate(apiResponse);
    if (validationResult != null) {
      throw new BadApiDataException('Wrong-formed data', validationResult);
    }

    // finally the response
    return beDowntimeLogPageToFeDowntimeLogPage(apiResponse);
  }
};


/* ------------------------------------------------------------------------
   BE-FE transformations
   ------------------------------------------------------------------------ */

function beDowntimeToFeDowntime(downtime: BEDowntime): Downtime {
  /* eslint-disable functional/immutable-data */
  const result: Downtime = {
    rawFunctionality: downtime.functionality,
    status: downtime.status as DowntimeStatus,
    startDate: downtime.startDate,
  };
     
  if (isKnownFunctionality(downtime.functionality)) {
    // cfr. https://github.com/microsoft/TypeScript/issues/33200#issuecomment-527670779
    result.knownFunctionality = downtime.functionality as KnownFunctionality;
  }
  if (downtime.endDate !== undefined) {
    result.endDate = downtime.endDate;
  }
  if (downtime.legalFactId !== undefined) {
    result.legalFactId = downtime.legalFactId;
  }
  if (downtime.fileAvailable !== undefined) {
    result.fileAvailable = downtime.fileAvailable;
  }

  return result;
}

function beDowntimeStatusToFunctionalityCurrentStatus(functionality: KnownFunctionality, beStatus: BEStatus): FunctionalityStatus {
  const currentIncident = beStatus.openIncidents.find(downtime => downtime.functionality === functionality);
  if (currentIncident) {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: false,
      currentDowntime: beDowntimeToFeDowntime(currentIncident),
    };
  } else {
    return {
      rawFunctionality: functionality as string,
      knownFunctionality: functionality,
      isOperative: true,
    };
  }
}

function unknownDowntimeToFunctionalityCurrentStatus(downtime: BEDowntime): FunctionalityStatus {
  return {
    rawFunctionality: downtime.functionality,
    isOperative: false,
    currentDowntime: beDowntimeToFeDowntime(downtime),
  };
}

function beDowntimeStatusToFeAppStatus(beStatus: BEStatus): AppCurrentStatus {
  const statusByFunctionality = [
    ...Object.values(KnownFunctionality).map(funct => beDowntimeStatusToFunctionalityCurrentStatus(funct, beStatus)),
    ...beStatus.openIncidents
      .filter(downtime => !isKnownFunctionality(downtime.functionality))
      .map(downtime => unknownDowntimeToFunctionalityCurrentStatus(downtime))
  ];

  return {
    appIsFullyOperative: beStatus.openIncidents.length === 0,
    statusByFunctionality
  };
}

function beDowntimeLogPageToFeDowntimeLogPage(beDowntimeLogPage: BEDowntimeLogPage): DowntimeLogPage {
  /* eslint-disable functional/immutable-data */
  const result: DowntimeLogPage = {
    downtimes: beDowntimeLogPage.result.map(beDowntimeToFeDowntime),
  };
  if (beDowntimeLogPage.nextPage) {
    result.nextPage = beDowntimeLogPage.nextPage;
  }
  return result;
}

