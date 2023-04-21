import { AxiosInstance } from 'axios';
import { AppCurrentStatus, DowntimeLogPageDTOValidator, AppStatusDTOValidator, FunctionalityStatus, GetDowntimeHistoryParams, Downtime, DowntimeLogPage, DowntimeStatus, isKnownFunctionality, KnownFunctionality, LegalFactDocumentDetails, AppStatusDTO, DowntimeLogPageDTO, DowntimeDTO } from '../../models';
import { DOWNTIME_HISTORY, DOWNTIME_LEGAL_FACT_DETAILS, DOWNTIME_STATUS } from './appStatus.routes';

export class BadApiDataException extends Error {
  constructor(message: string, public details: any) {
    super(message);
  }
}


/* ------------------------------------------------------------------------
   the API
   ------------------------------------------------------------------------ */

export function createAppStatusApi(apiClientProvider: () => AxiosInstance) {
  return {
    getCurrentStatus: async (): Promise<AppCurrentStatus> => {
      /* eslint-disable functional/no-let */
      let apiResponse: AppStatusDTO;
  
      const realApiResponse = await apiClientProvider().get<AppStatusDTO>(DOWNTIME_STATUS());
      apiResponse = realApiResponse.data;
  
      // pn-validator validation
      const validationResult = new AppStatusDTOValidator().validate(apiResponse);
      if (validationResult != null) {
        throw new BadApiDataException('Wrong-formed data', validationResult);
      }
  
      // extra validation: open incident with end date
      if (apiResponse.openIncidents.some(downtime => downtime.endDate)) {
        throw new BadApiDataException('Wrong data - a finished downtime is reported as open incident', {});
      }
  
      // finally the response
      return beAppStatusToFeAppStatus(apiResponse);
    },
  
    getDowntimeLogPage: async (params: GetDowntimeHistoryParams): Promise<DowntimeLogPage> => {
      /* eslint-disable functional/no-let */
      let apiResponse: DowntimeLogPageDTO;
  
      const realApiResponse = await apiClientProvider().get<DowntimeLogPageDTO>(DOWNTIME_HISTORY(params));
      apiResponse = realApiResponse.data;
  
      // pn-validator validation
      const validationResult = new DowntimeLogPageDTOValidator().validate(apiResponse);
      if (validationResult != null) {
        throw new BadApiDataException('Wrong-formed data', validationResult);
      }
  
      // extra validation: downtime with fileAvailable but without legalFactId
      if (apiResponse.result.some(downtime => downtime.fileAvailable && !downtime.legalFactId)) {
        throw new BadApiDataException('Wrong data - a downtime marked as fileAvailable must indicate a legalFactId', {});
      }
  
      // finally the response
      return beDowntimeLogPageToFeDowntimeLogPage(apiResponse);
    },
  
    /* eslint-disable-next-line arrow-body-style */
    getLegalFactDetails: async(legalFactId: string): Promise<LegalFactDocumentDetails> => {
      const realApiResponse = await apiClientProvider().get<LegalFactDocumentDetails>(DOWNTIME_LEGAL_FACT_DETAILS(legalFactId));

      // validation: the response must include an actual value for url
      if (!realApiResponse.data.url) {
        throw new BadApiDataException('The response must include a URL', {});
      }

      return realApiResponse.data;
    },
  };
};



/* ------------------------------------------------------------------------
   BE-FE transformations
   ------------------------------------------------------------------------ */

function beDowntimeToFeDowntime(downtime: DowntimeDTO): Downtime {
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

  // The attribute fileAvailable is *not* redundant, though it could seem so because it could be derived from the presence or not of legalFactId.
  // In fact, the value for legalFactId is set *before* the file is actually available,
  // since the BE process regarding the file involves two steps, 
  // - first the storage is requested to AWS, which gives the name in the response
  // - later AWS reports that the file is indeed available through a message to a queue in the BE 
  //   linked to the filename indicated in the previous steps;
  //   when such message is processed, the fileAvailable signal is set to true for the referenced file.
  // -------------
  // Carlos Lombardi, 2022.11.03, after a call with Giuseppe Porro
  // -------------
  result.fileAvailable = !!downtime.fileAvailable;

  return result;
}

function beDowntimeStatusToFunctionalityCurrentStatus(functionality: KnownFunctionality, appStatusDTO: AppStatusDTO): FunctionalityStatus {
  const currentIncident = appStatusDTO.openIncidents.find(downtime => downtime.functionality === functionality);
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

function unknownDowntimeToFunctionalityCurrentStatus(downtime: DowntimeDTO): FunctionalityStatus {
  return {
    rawFunctionality: downtime.functionality,
    isOperative: false,
    currentDowntime: beDowntimeToFeDowntime(downtime),
  };
}

function beAppStatusToFeAppStatus(appStatusDTO: AppStatusDTO): AppCurrentStatus {
  const statusByFunctionality = [
    ...Object.values(KnownFunctionality).map(funct => beDowntimeStatusToFunctionalityCurrentStatus(funct, appStatusDTO)),
    ...appStatusDTO.openIncidents
      .filter(downtime => !isKnownFunctionality(downtime.functionality))
      .map(downtime => unknownDowntimeToFunctionalityCurrentStatus(downtime))
  ];

  return {
    appIsFullyOperative: appStatusDTO.openIncidents.length === 0,
    statusByFunctionality,
    // The timestamp for the last check ("ultimo aggiornamento") is required in the app status page, but is not given by API.
    // I decided to include it in the response given by the API layer of the FE.
    // ----------------------
    // Carlos Lombardi, 2022.11.4
    lastCheckTimestamp: new Date().toISOString(),
  };
}

function beDowntimeLogPageToFeDowntimeLogPage(downtimeLogPageDTO: DowntimeLogPageDTO): DowntimeLogPage {
  /* eslint-disable functional/immutable-data */
  const result: DowntimeLogPage = {
    downtimes: downtimeLogPageDTO.result.map(beDowntimeToFeDowntime),
  };
  if (downtimeLogPageDTO.nextPage) {
    result.nextPage = downtimeLogPageDTO.nextPage;
  }
  return result;
}

