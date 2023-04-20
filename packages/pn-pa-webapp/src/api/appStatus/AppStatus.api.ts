import { createAppStatusApi } from '@pagopa-pn/pn-commons';
import { apiClient } from '../apiClients';

/* ------------------------------------------------------------------------
   the API
   ------------------------------------------------------------------------ */

export const AppStatusApi = createAppStatusApi(() => apiClient);
