import { getConfiguration } from '../services/configuration.service';

export const HOME = '/';
export const NOT_ACCESSIBLE = '/non-accessibile';

export const SELFCARE_LOGIN_PATH = '/auth/login';
export const SELFCARE_LOGOUT_PATH = '/auth/logout';

const SELFCARE_DASHBOARD = '/dashboard';
export const USERS_SEGMENT = '/users';
export const GROUPS_SEGMENT = '/groups';

/** DASHBOARD navigation link to SelfCare "Area Riservata"
 * @param idOrganization
 * @param lang
 */
export const DASHBOARD = (idOrganization: string, lang: string) =>
  `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_DASHBOARD}/${idOrganization}?lang=${lang}`;

/** USERS navigation link to SelfCare "Utenti" section
 * @param idOrganization
 * @param lang
 */
export const USERS = (idOrganization: string, lang: string) =>
  `${
    getConfiguration().SELFCARE_BASE_URL
  }${SELFCARE_DASHBOARD}/${idOrganization}${USERS_SEGMENT}?lang=${lang}`;

/** GROUPS navigation link to SelfCare "Gruppi" section
 * @param idOrganization
 * @param lang
 */
export const GROUPS = (idOrganization: string, lang: string) =>
  `${
    getConfiguration().SELFCARE_BASE_URL
  }${SELFCARE_DASHBOARD}/${idOrganization}${GROUPS_SEGMENT}?lang=${lang}`;
