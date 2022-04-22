export const NOTIFICHE = '/notifiche';
export const NOTIFICHE_DELEGATO = `${NOTIFICHE}/:id`;
export const DELEGHE = '/deleghe';
export const PROFILO = '/profilo';
const NOTIFICA = '/notifica';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${NOTIFICA}`;
export const NUOVA_DELEGA = `${DELEGHE}/nuova`;
export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${NOTIFICA}`;
export const RECAPITI = '/recapiti';
