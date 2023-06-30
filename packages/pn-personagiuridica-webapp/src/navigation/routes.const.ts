import {
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE,
  AppRouteParams,
} from '@pagopa-pn/pn-commons';
import { getConfiguration } from "../services/configuration.service";

export const NOTIFICHE = '/notifiche';
export const NOTIFICHE_DELEGATO = `${NOTIFICHE}-delegato`;
export const DELEGHE = '/deleghe';
const NOTIFICA = '/dettaglio';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${NOTIFICA}`;
export const DETTAGLIO_NOTIFICA_DELEGATO = `${NOTIFICHE_DELEGATO}/:mandateId/:id${NOTIFICA}`;
export const DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM = AppRouteParams.AAR;
export const NUOVA_DELEGA = `${DELEGHE}/nuova`;
export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${NOTIFICA}`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH = (id: string, mandateId: string) =>
  `${NOTIFICHE_DELEGATO}/${mandateId}/${id}${NOTIFICA}`;
export const RECAPITI = '/recapiti';
export const GET_NOTIFICHE_DELEGATO_PATH = (mandateId: string) => `${NOTIFICHE}/${mandateId}`;
export const APP_STATUS = '/app-status';
export { PRIVACY_POLICY, TERMS_OF_SERVICE };
export const NOT_ACCESSIBLE = '/non-accessibile';

const DASHBOARD = '/dashboard';
const USERS_SEGMENT = '/users';
const GROUPS_SEGMENT = '/groups';

/** USERS navigation link to SelfCare "Referenti" section for SEND
 * @param idOrganization
 */
export const USERS = (idOrganization: string) =>
  `${getConfiguration().SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}${USERS_SEGMENT}`;

/** GROUPS navigation link to SelfCare "Gruppi" section for SEND
 * @param idOrganization
 */
export const GROUPS = (idOrganization: string) =>
  `${getConfiguration().SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}${GROUPS_SEGMENT}`;

/** PROFILE navigation link to PNPG "Profilo" section for SEND
 * @param idOrganization
 */
export const PROFILE = (idOrganization: string) =>
  `${getConfiguration().SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}`;
