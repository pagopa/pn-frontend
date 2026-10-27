import { getConfiguration } from '../services/configuration.service';

export const HOME = '/';

const SELFCARE_DASHBOARD = '/dashboard';
export const SELFCARE_LOGOUT_PATH = '/auth/logout';
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
