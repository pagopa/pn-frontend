import { SELFCARE_BASE_URL } from '../utils/constants';

export const DASHBOARD = '/dashboard';
const NOTIFICA = '/notifica';
export const DETTAGLIO_NOTIFICA = `${DASHBOARD}/:id${NOTIFICA}`;
export const API_KEYS = '/api-keys';

export const ROLES_SEGMENT = '/users';
export const ID_PN_SEGMENT = 'prod-pn';
export const GROUPS_SEGMENT = '/groups';

/** ROLES navigation link to SelfCare "Referenti" section for Piattaforma Notifiche
 * @param idOrganization
 */
export const ROLES = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}/${ID_PN_SEGMENT}${ROLES_SEGMENT}`;

/** GROUPS navigation link to SelfCare "Groppi" section for Piattaforma Notifiche 
 * @param idOrganization
 */
export const GROUPS = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}${GROUPS_SEGMENT}#${ID_PN_SEGMENT}`;

export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${DASHBOARD}/${id}${NOTIFICA}`;
