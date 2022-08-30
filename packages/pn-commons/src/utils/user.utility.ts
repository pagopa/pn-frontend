import * as yup from 'yup';
import { BasicUser } from '../types/User';
import { dataRegex } from './string.utility';

/**
 * Yup matcher contents (i.e. a suitable parameter for yup.object())
 * for the common traits of users.
 */
export const basicUserDataMatcherContents = {
  family_name: yup.string().matches(dataRegex.name),
  fiscal_number: yup.string().matches(dataRegex.fiscalCode),
  name: yup.string().matches(dataRegex.name),
  uid: yup.string().uuid(),
  sessionToken: yup.string().matches(dataRegex.token),
  email: yup.string().email(),
};

/**
 * Produces the initial user object to set into the Redux store of a PN webapp.
 * If there is a (serialized) valid user object in the session storage, then it returns the corresponding (JSON-deserialized) object.
 * Otherwise, it returns an object which represent "no user logged", and also cleans the session storage.
 *
 * @param yupMatcher the matcher to validate the data in session storage.
 * @param noLoggedUserData the "no user logged" object to return if there is no, or invalid, data in the session storage.
 * @returns the suitable User object to set into the initial Redux store.
 */
export function basicInitialUserData<T extends BasicUser>(
  yupMatcher: yup.ObjectSchema<any>,
  noLoggedUserData: T
): T {
  const rawDataFromStorage = sessionStorage.getItem('user');
  if (rawDataFromStorage) {
    /* eslint-disable functional/no-let */
    let userInfoFromSessionStorage = null;
    try {
      userInfoFromSessionStorage = JSON.parse(rawDataFromStorage);
      yupMatcher.validateSync(userInfoFromSessionStorage);
    } catch (e) {
      // discard the malformed JSON in session storage
      sessionStorage.clear();
      // and clear the eventually parsed JSON since it's not valid
      userInfoFromSessionStorage = null;
    }
    return userInfoFromSessionStorage || noLoggedUserData;
  } else {
    return noLoggedUserData;
  }
}

export function adaptedTokenExchangeError(originalError: any, tokenName: string) {
  return [403, 401].includes(originalError.response?.status)
    ? {
        ...originalError,
        isUnauthorizedUser: true,
        response: {
          ...originalError.response,
          customMessage: {
            title: 'Non sei autorizzato ad accedere',
            message: 'Stai uscendo da Piattaforma Notifiche',
          },
        },
      }
    : originalError.response?.data?.error === 'Token is not valid'
    ? {
        ...originalError,
        isUnauthorizedUser: true,
        response: {
          ...originalError.response,
          customMessage: {
            title: `Non puoi accedere per un problema tecnico - ${tokenName} non valido`,
            message: 'Stai uscendo da Piattaforma Notifiche',
          },
        },
      }
    : originalError;
}
