import { SELFCARE_BASE_URL } from "../utils/constants";

export const NOTIFICHE = '/notifiche';
export const DELEGHE = '/deleghe';
export const APP_STATUS = '/app-status';
export const USERS_SEGMENT = '/users';
export const GROUPS_SEGMENT = '/groups';
export const ID_PN_SEGMENT = 'prod-pn';

/** ROLES navigation link to SelfCare "Referenti" section for Piattaforma Notifiche
 * @param idOrganization
 */
export const USERS = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${NOTIFICHE}/${idOrganization}${USERS_SEGMENT}#${ID_PN_SEGMENT}`;

/** GROUPS navigation link to SelfCare "Gruppi" section for Piattaforma Notifiche
 * @param idOrganization
 */
export const GROUPS = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${NOTIFICHE}/${idOrganization}${GROUPS_SEGMENT}#${ID_PN_SEGMENT}`;
