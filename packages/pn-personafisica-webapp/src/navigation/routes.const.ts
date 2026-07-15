import {
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE,
} from '@pagopa-pn/pn-commons';

export const NOTIFICHE = '/notifiche';
export const NOTIFICHE_DELEGATO = `${NOTIFICHE}/:mandateId`;
export const DELEGHE = '/deleghe';
export const PROFILO = '/profilo';
const DETTAGLIO = '/dettaglio';
const COMUNICAZIONE = '/comunicazione';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_TIMELINE = `${NOTIFICHE}/:id${DETTAGLIO}/timeline`;

export const DETTAGLIO_COMBO = `${COMUNICAZIONE}/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_DELEGATO = `${NOTIFICHE_DELEGATO}/:id${DETTAGLIO}`;
export const DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE = `${NOTIFICHE_DELEGATO}/:id${DETTAGLIO}/timeline`;
export const NUOVA_DELEGA = `${DELEGHE}/nuova`;
export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${DETTAGLIO}`;
export const GET_DETTAGLIO_COMUNICAZIONE_PATH = (id: string) =>
  `${COMUNICAZIONE}/${id}/${DETTAGLIO}`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH = (id: string, mandateId: string) =>
  `${NOTIFICHE}/${mandateId}/${id}${DETTAGLIO}`;
export const RECAPITI = '/recapiti';
export const GET_NOTIFICHE_DELEGATO_PATH = (mandateId: string) => `${NOTIFICHE}/${mandateId}`;
export const GET_DETTAGLIO_NOTIFICA_TIMELINE_PATH = (id: string) =>
  `${NOTIFICHE}/${id}${DETTAGLIO}/timeline`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_TIMELINE_PATH = (id: string, mandateId: string) =>
  `${NOTIFICHE}/${mandateId}/${id}${DETTAGLIO}/timeline`;
export const APP_STATUS = '/app-status';
export { PRIVACY_POLICY, TERMS_OF_SERVICE };
export const PARTICIPATING_ENTITIES = '/informativa-aderenti';
export const NOT_ACCESSIBLE = '/non-accessibile';
export const SUPPORT = '/assistenza';
export const TERMS_OF_SERVICE_SERCQ_SEND = '/termini-di-servizio/sercq-send';
export const DIGITAL_DOMICILE = `${RECAPITI}/domicilio-digitale`;
export const DIGITAL_DOMICILE_ACTIVATION = `${DIGITAL_DOMICILE}/attivazione`;
export const DIGITAL_DOMICILE_MANAGEMENT = `${DIGITAL_DOMICILE}/gestione`;
export const LOGOUT = '/auth/logout';
export const LOGOUT_OI = '/auth/logout-oi';
export const TPP_LANDING = '/nuova-notifica-send';
export const ONBOARDING = '/onboarding';
export const ONBOARDING_DIGITAL_DOMICILE = 'domicilio-digitale';
export const ONBOARDING_COURTESY = 'avvisi';
export const ONBOARDING_IO = 'io';
