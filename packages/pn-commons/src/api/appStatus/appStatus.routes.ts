import { GetDowntimeHistoryParams } from "../../models";
import { compileRoute } from "../../utils";

const API_DOWNTIME_PREFIX = 'downtime';
const API_VERSION_SEGMENT = 'v1';
const API_DOWNTIME_STATUS = 'status';
const API_DOWNTIME_HISTORY = 'history';
const API_DOWNTIME_LEGAL_FACT_DETAILS = 'legal-facts';
const API_DOWNTIME_LEGAL_FACT_ID_PARAMETER = 'legalFactId';

const API_DOWNTIME_STATUS_PATH = `${API_VERSION_SEGMENT}/${API_DOWNTIME_STATUS}`;
const API_DOWNTIME_HISTORY_PATH = `${API_VERSION_SEGMENT}/${API_DOWNTIME_HISTORY}`;
const API_DOWNTIME_LEGAL_FACT_DETAILS_PATH = `${API_VERSION_SEGMENT}/${API_DOWNTIME_LEGAL_FACT_DETAILS}/:${API_DOWNTIME_LEGAL_FACT_ID_PARAMETER}`;

const API_DOWNTIME_FROM_TIME_PARAMETER = 'fromTime';
const API_DOWNTIME_TO_TIME_PARAMETER = 'toTime';
const API_DOWNTIME_FUNCTIONALITY_PARAMETER = 'functionality';
const API_DOWNTIME_PAGE_PARAMETER = 'page';
const API_DOWNTIME_SIZE_PARAMETER = 'size';

export function DOWNTIME_STATUS() {
  return compileRoute({
    prefix: API_DOWNTIME_PREFIX,
    path: API_DOWNTIME_STATUS_PATH,
  });
}

export function DOWNTIME_HISTORY(params: GetDowntimeHistoryParams) {
  /* eslint-disable functional/immutable-data */
  const queryParams: any = { [API_DOWNTIME_FROM_TIME_PARAMETER]: params.startDate };

  const conditionallyAddParam = (name: string, value: any) => {
    if (value != null) {
      queryParams[name] = value;      
    }
  };

  conditionallyAddParam(API_DOWNTIME_TO_TIME_PARAMETER, params.endDate);
  conditionallyAddParam(API_DOWNTIME_FUNCTIONALITY_PARAMETER, params.functionality);
  conditionallyAddParam(API_DOWNTIME_PAGE_PARAMETER, params.page);
  conditionallyAddParam(API_DOWNTIME_SIZE_PARAMETER, params.size);

  return compileRoute({
    prefix: API_DOWNTIME_PREFIX,
    path: API_DOWNTIME_HISTORY_PATH,
    query: queryParams,
  });
}

export function DOWNTIME_LEGAL_FACT_DETAILS(legalFactId: string) {
  return compileRoute({
    prefix: API_DOWNTIME_PREFIX,
    path: API_DOWNTIME_LEGAL_FACT_DETAILS_PATH,
    params: {
      [API_DOWNTIME_LEGAL_FACT_ID_PARAMETER]: legalFactId,
    }
  });
}
