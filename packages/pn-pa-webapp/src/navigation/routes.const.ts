import {
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE,
} from '@pagopa-pn/pn-commons';
import { SELFCARE_BASE_URL } from '../utils/constants';

export const DASHBOARD = '/dashboard';
const NOTIFICA = '/dettaglio';
export const DETTAGLIO_NOTIFICA = `${DASHBOARD}/:id${NOTIFICA}`;
export const NUOVA_NOTIFICA = `${DASHBOARD}/nuova-notifica`;
export const API_KEYS = '/api-keys';
export const NUOVA_API_KEY = `${API_KEYS}/nuova-api-key`;
export const STATISTICHE = '/statistiche';

export const ROLES_SEGMENT = '/users';
export const ID_PN_SEGMENT = 'prod-pn';
export const GROUPS_SEGMENT = '/groups';
export const APP_STATUS = '/app-status';
export { PRIVACY_POLICY, TERMS_OF_SERVICE };

/** ROLES navigation link to SelfCare "Referenti" section for Piattaforma Notifiche
 * @param idOrganization
 */
export const ROLES = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}${ROLES_SEGMENT}#${ID_PN_SEGMENT}`;

/** GROUPS navigation link to SelfCare "Gruppi" section for Piattaforma Notifiche
 * @param idOrganization
 */
export const GROUPS = (idOrganization: string) =>
  `${SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}${GROUPS_SEGMENT}#${ID_PN_SEGMENT}`;

export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${DASHBOARD}/${id}${NOTIFICA}`;
