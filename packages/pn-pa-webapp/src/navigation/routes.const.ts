import {
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE,
} from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

export const DASHBOARD = '/dashboard';
const NOTIFICA = '/dettaglio';
export const DETTAGLIO_NOTIFICA = `${DASHBOARD}/:id${NOTIFICA}`;
export const NUOVA_NOTIFICA = `${DASHBOARD}/nuova-notifica`;
export const API_KEYS = '/api-keys';
export const NUOVA_API_KEY = `${API_KEYS}/nuova-api-key`;
export const STATISTICHE = '/statistiche';

export const USERS_SEGMENT = '/users';
export const GROUPS_SEGMENT = '/groups';
export const APP_STATUS = '/app-status';
export { PRIVACY_POLICY, TERMS_OF_SERVICE };

/** USERS navigation link to SelfCare "Referenti" section for SEND
 * @param idOrganization
 */
export const USERS = (idOrganization: string, lang: string) =>
  `${
    getConfiguration().SELFCARE_BASE_URL
  }${DASHBOARD}/${idOrganization}${USERS_SEGMENT}?lang=${lang}`;

/** GROUPS navigation link to SelfCare "Gruppi" section for SEND
 * @param idOrganization
 */
export const GROUPS = (idOrganization: string, lang: string) =>
  `${
    getConfiguration().SELFCARE_BASE_URL
  }${DASHBOARD}/${idOrganization}${GROUPS_SEGMENT}?lang=${lang}`;

export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${DASHBOARD}/${id}${NOTIFICA}`;
export const NOT_ACCESSIBLE = '/non-accessibile';

export const SELFCARE_LOGIN_PATH = '/auth/login';
export const SELFCARE_LOGOUT_PATH = '/auth/logout';