import {
  AppRouteParams,
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE,
} from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

export const NOTIFICHE = '/notifiche';
export const NOTIFICHE_DELEGATO = `${NOTIFICHE}-delegato`;
export const DELEGHE = `/deleghe`;
export const DELEGHEACARICO = `${DELEGHE}/a-carico`;
export const DELEGATI = `${DELEGHE}/delegati`;
export const INTEGRAZIONE_API = '/integrazione-api';
export const REGISTRA_CHIAVE_PUBBLICA = `${INTEGRAZIONE_API}/registra-chiave-pubblica`;

const DETTAGLIO = '/dettaglio';
export const COMUNICAZIONE = '/comunicazione';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_TIMELINE = `${NOTIFICHE}/:id${DETTAGLIO}/timeline`;
export const DETTAGLIO_COMBO = `${COMUNICAZIONE}/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_DELEGATO = `${NOTIFICHE_DELEGATO}/:mandateId/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE = `${NOTIFICHE_DELEGATO}/:mandateId/:id${DETTAGLIO}/timeline`;

export const DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM = AppRouteParams.AAR;
export const NUOVA_DELEGA = `${DELEGATI}/nuova`;
export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${DETTAGLIO}`;
export const GET_DETTAGLIO_COMUNICAZIONE_PATH = (id: string) =>
  `${COMUNICAZIONE}/${id}/${DETTAGLIO}`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH = (id: string, mandateId: string) =>
  `${NOTIFICHE_DELEGATO}/${mandateId}/${id}${DETTAGLIO}`;
export const RECAPITI = '/recapiti';
export const GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH = (id: string) =>
  `${NOTIFICHE}/${id}${DETTAGLIO}/timeline`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH = (id: string, mandateId: string) =>
  `${NOTIFICHE_DELEGATO}/${mandateId}/${id}${DETTAGLIO}/timeline`;
export const APP_STATUS = '/app-status';
export { PRIVACY_POLICY, TERMS_OF_SERVICE };
export const NOT_ACCESSIBLE = '/non-accessibile';
export const TERMS_OF_SERVICE_SERCQ_SEND = '/termini-di-servizio/sercq-send';
export const TERMS_OF_SERVICE_B2B = '/termini-di-servizio/b2b';
export const DIGITAL_DOMICILE = `${RECAPITI}/domicilio-digitale`;
export const DIGITAL_DOMICILE_ACTIVATION = `${DIGITAL_DOMICILE}/attivazione`;
export const DIGITAL_DOMICILE_MANAGEMENT = `${DIGITAL_DOMICILE}/gestione`;
export const SELFCARE_LOGOUT = '/auth/logout';

const DASHBOARD = '/dashboard';
const USERS_SEGMENT = '/users';
const GROUPS_SEGMENT = '/groups';

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

/** PROFILE navigation link to PNPG "Profilo" section for SEND
 * @param idOrganization
 */
export const PROFILE = (idOrganization: string, lang: string) =>
  `${getConfiguration().SELFCARE_BASE_URL}${DASHBOARD}/${idOrganization}?lang=${lang}`;
