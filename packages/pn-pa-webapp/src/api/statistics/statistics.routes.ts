import { compileRoute } from '@pagopa-pn/pn-commons';

import { StatisticsParams } from '../../redux/statistics/types';

// Prefixes
const API_SENDER_DASHBOARD_PREFIX = 'sender-dashboard';

// Segments
const API_SENDER_DASHBOARD_DATA_REQUEST = 'dashboard-data-request';

// Parameters
const API_STATISTICS_START_DATE_PARAMETER = 'startDate';
const API_STATISTICS_END_DATE_PARAMETER = 'endDate';
const API_STATISTICS_CXID_PARAMETER = 'cxId';

// Paths
const API_STATISTICS_PATH = `${API_SENDER_DASHBOARD_DATA_REQUEST}/:${API_STATISTICS_CXID_PARAMETER}`;

export function STATISTICS(params: StatisticsParams<string>) {
  return compileRoute({
    prefix: API_SENDER_DASHBOARD_PREFIX,
    path: API_STATISTICS_PATH,
    query: {
      [API_STATISTICS_START_DATE_PARAMETER]: params.startDate,
      [API_STATISTICS_END_DATE_PARAMETER]: params.endDate,
    },
    params: {
      [API_STATISTICS_CXID_PARAMETER]: params.cxId,
    },
  });
}
