const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

// export const URL_FE_LOGIN: string = `${process.env.REACT_APP_URL_FE_LOGIN}?onSuccess=dashboard`;
// export const URL_FE_LOGOUT: string = process.env.REACT_APP_URL_FE_LOGOUT || '';
// // export const URL_FE_ONBOARDING: string = process.env.REACT_APP_URL_FE_ONBOARDING;
// // export const URL_FE_LANDING: string = process.env.REACT_APP_URL_FE_LANDING;

// export const PAGOPA_HELP_EMAIL = process.env.REACT_APP_PAGOPA_HELP_EMAIL;

// export const ENABLE_ASSISTANCE = process.env.REACT_APP_ENABLE_ASSISTANCE === 'true';