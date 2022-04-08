
export const DASHBOARD = '/dashboard';
const NOTIFICA = '/notifica';
export const DETTAGLIO_NOTIFICA = `${DASHBOARD}/:id${NOTIFICA}`;
export const API_KEYS = '/api-keys';


export const ROLES = '/roles';
export const GROUPS = '/groups';

export const GET_DETTAGLIO_NOTIFICA_PATH = (id: string) => `${DASHBOARD}/${id}${NOTIFICA}`;