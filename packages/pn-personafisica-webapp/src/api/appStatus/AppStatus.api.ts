import { minutesBeforeNow } from '@pagopa-pn/pn-commons';
import { AppCurrentStatus, BEDowntimeLogPageValidator, BEDowntime, BEStatus, BEStatusValidator, FunctionalityStatus, GetDowntimeHistoryParams, Downtime, DowntimeLogPage, DowntimeStatus, isKnownFunctionality, KnownFunctionality, BEDowntimeLogPage, LegalFactDocumentDetails } from '../../models/appStatus';
import { apiClient } from '../axios';
import { DOWNTIME_HISTORY, DOWNTIME_LEGAL_FACT_DETAILS, DOWNTIME_STATUS } from './appStatus.routes';

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
    "NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZATION", "NOTIFICATION_WORKFLOW"
  ],
  openIncidents: [
    // {
    //   functionality: "NOTIFICATION_WORKFLOW",
    //   status: "KO",
    //   startDate: minutesBeforeNow(1).toISOString(),
    // }
  ],
};
  
const downtimeLogPageResponseExample: BEDowntimeLogPage = {
  result: [
    {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: minutesBeforeNow(1).toISOString(),
    },
    {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: minutesBeforeNow(5).toISOString(),
      endDate: minutesBeforeNow(3).toISOString(),
      fileAvailable: false,
    },
    {
      functionality: "DEEP_THINKING",
      status: "OK",
      startDate: minutesBeforeNow(20).toISOString(),
      endDate: minutesBeforeNow(16).toISOString(),
      legalFactId: "some-legal-fact-id-1",
      fileAvailable: true,
    },
    {
      functionality: "NOTIFICATION_VISUALIZATION",
      status: "OK",
      startDate: minutesBeforeNow(120040).toISOString(),
      endDate: minutesBeforeNow(120020).toISOString(),
      legalFactId: "some-legal-fact-id-2",
      fileAvailable: true,
    },
  ],
};

function mockLegalFactDetails(legalFactId: string): LegalFactDocumentDetails {
  return {
    filename: `downtime_${legalFactId}.pdf`,
    contentLength: 3456,
    url: `https://s3.amazon.com/downtime_${legalFactId}.pdf`,
  };
}


/* ------------------------------------------------------------------------
   the API
   ------------------------------------------------------------------------ */

// const useMockResponseData = false;
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

    // extra validation: open incident with end date
    if (apiResponse.openIncidents.some(downtime => downtime.endDate)) {
      throw new BadApiDataException('Wrong data - a finished downtime is reported as open incident', {});
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
  },

  /* eslint-disable-next-line arrow-body-style */
  getLegalFactDetails: async(legalFactId: string): Promise<LegalFactDocumentDetails> => {
    if (useMockResponseData) {
      return mockLegalFactDetails(legalFactId);
    } else {
      const realApiResponse = await apiClient.get<LegalFactDocumentDetails>(DOWNTIME_LEGAL_FACT_DETAILS(legalFactId));

      // validation: the response must include an actual value for url
      if (!realApiResponse.data.url) {
        throw new BadApiDataException('The response must include a URL', {});
      }

      return realApiResponse.data;
    }

    // } else if (legalFactId === "PN_DOWNTIME_LEGAL_FACTS-0004-73Z9-67GF-24F5-D5MO") {
    //   return Promise.reject({ response: { status: 500 } });
  },
};


/* ------------------------------------------------------------------------
   BE-FE transformations
   ------------------------------------------------------------------------ */

function beDowntimeToFeDowntime(downtime: BEDowntime): Downtime {
  /* eslint-disable functional/immutable-data */
  const result: Downtime = {
    rawFunctionality: downtime.functionality,
    startDate: downtime.startDate,

    // existence of endDate is taken as source for status, takes preeminence over the status attribute
    // which is redundant
    // status: downtime.status as DowntimeStatus,
    /* eslint-disable-next-line no-extra-boolean-cast */
    status: !!downtime.endDate ? DowntimeStatus.OK : DowntimeStatus.KO,
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
  // existence of legalFactId is taken as source for fileAvailable, takes preeminence over the fileAvailable attribute
  // which is redundant
  // if (downtime.fileAvailable !== undefined) {
  //   result.fileAvailable = downtime.fileAvailable;
  // }
  result.fileAvailable = !!downtime.legalFactId;

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

