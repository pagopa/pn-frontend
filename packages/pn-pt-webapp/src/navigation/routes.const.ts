import { getConfiguration } from '../services/configuration.service';

export const HOME = '/';

const SELFCARE_DASHBOARD = '/dashboard';
export const USERS_SEGMENT = '/users';
export const GROUPS_SEGMENT = '/groups';

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
