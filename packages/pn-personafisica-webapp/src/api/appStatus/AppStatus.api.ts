import { createAppStatusApi } from '@pagopa-pn/pn-commons';
import { apiClient } from '../axios';

/* ------------------------------------------------------------------------
   the API
   ------------------------------------------------------------------------ */

export const AppStatusApi = createAppStatusApi(apiClient);
