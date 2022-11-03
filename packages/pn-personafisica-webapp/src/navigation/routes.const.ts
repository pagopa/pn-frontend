import { PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY, TOS_LINK_RELATIVE_PATH as TERMS_OF_SERVICE } from "@pagopa-pn/pn-commons";

export const NOTIFICHE = '/notifiche';
export const NOTIFICHE_DELEGATO = `${NOTIFICHE}/:mandateId`;
export const DELEGHE = '/deleghe';
export const PROFILO = '/profilo';
const NOTIFICA = '/dettaglio';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${NOTIFICA}`;
export const DETTAGLIO_NOTIFICA_DELEGATO = `${NOTIFICHE_DELEGATO}/:id${NOTIFICA}`;
export const NUOVA_DELEGA = `${DELEGHE}/nuova`;
export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${NOTIFICA}`;
export const GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH = (id: string, mandateId: string) => `${NOTIFICHE}/${mandateId}/${id}${NOTIFICA}`;
export const RECAPITI = '/recapiti';
export const GET_NOTIFICHE_DELEGATO_PATH = (mandateId: string) => `${NOTIFICHE}/${mandateId}`;
export const TOS = `/tos`;
export { PRIVACY_POLICY, TERMS_OF_SERVICE };

