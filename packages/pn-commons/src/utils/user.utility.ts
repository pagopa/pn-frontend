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
export function basicInitialUserData<T extends BasicUser>(yupMatcher: yup.ObjectSchema<any>, noLoggedUserData: T): T {
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

type ExchangeTokenApi<T extends BasicUser> = { exchangeToken: (token: string) => Promise<T> };

export async function doExchangeToken<T extends BasicUser>(token: string, tokenName: string, api: ExchangeTokenApi<T>, rejectWithValue: any) {
  if (token && token !== '') {
    try {
      const user = await api.exchangeToken(token);
      sessionStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (e: any) {
      console.log('error in doExchangeToken');
      console.log(e.error);
      console.log(e.response);
      const rejectParameter = (e.response?.status === 403) ? {
        ...e,
        isUnauthorizedUser: true,
        response: {
          ...e.response, customMessage: {
            title: "Non sei autorizzato ad accedere",
            message: "Stai uscendo da Piattaforma Notifiche",
          }
        }
      } 
      : e.response?.data?.error === "Token is not valid" ? {
        ...e,
        isUnauthorizedUser: true,
        response: {
          ...e.response, status: 403, customMessage: {
            title: `Non puoi accedere per un problema tecnico - ${tokenName} non valido`,
            message: "Stai uscendo da Piattaforma Notifiche",
          }
        }
      }
      : e;
      return rejectWithValue(rejectParameter);
    }
  } else {
    // I prefer to launch an error than return rejectWithValue, since in this way 
    // the navigation proceeds immediately to the login page.
    // --------------
    // Carlos Lombardi, 2022.08.05
    throw new Error(`${tokenName} must be provided to exchangeToken action`);
  }
}

