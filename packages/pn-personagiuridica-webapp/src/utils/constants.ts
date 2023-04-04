
export const API_BASE_URL = process.env.REACT_APP_URL_API;
export const SELFCARE_BASE_URL = process.env.REACT_APP_URL_SELFCARE_BASE;

// PN-2029
// export const PAYMENT_DISCLAIMER_URL = process.env.REACT_APP_PAYMENT_DISCLAIMER_URL;

export const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'DUMMY';

export const OT_DOMAIN_ID = process.env.REACT_APP_ONETRUST_DOMAIN_ID || '';

export const ONE_TRUST_DRAFT_MODE = process.env.REACT_APP_ONE_TRUST_DRAFT_MODE === 'true';
export const ONE_TRUST_PP = process.env.REACT_APP_ONE_TRUST_PP || '';
export const ONE_TRUST_TOS = process.env.REACT_APP_ONE_TRUST_TOS || '';

export const VERSION = process.env.REACT_APP_VERSION ?? '';
