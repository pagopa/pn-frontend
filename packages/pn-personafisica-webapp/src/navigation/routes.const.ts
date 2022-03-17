export const NOTIFICHE = '/notifiche';
export const DELEGHE = '/deleghe';
export const PROFILO = '/profilo';
const NOTIFICA = '/notifica';
export const DETTAGLIO_NOTIFICA = `${NOTIFICHE}/:id${NOTIFICA}`;

export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${NOTIFICHE}/${id}${NOTIFICA}`;