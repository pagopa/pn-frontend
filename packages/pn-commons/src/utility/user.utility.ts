import * as yup from 'yup';

import { BasicUser } from '../models/User';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
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
  /* *Note*:
   * For the user email that arrives to PN from other apps, we use the more liberal
   * validation provided by yup.
   * This is different than what we do for the emails that are managed inside PN,
   * e.g. for the emails in the Contacts page for persona fisica, and the email
   * which can be indicated in the manual notification creation in pa-webapp.
   * For these emails instead we use a more strict validation, equal to that
   * performed by the BE.
   * --------------------------------------
   * Carlos Lombardi, 2023.01.24
   */
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
      yupMatcher.validateSync(userInfoFromSessionStorage, { stripUnknown: false });
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

export function adaptedTokenExchangeError(originalError: any) {
  // validazione `user` TokenExchangeRequest fallisce
  // ---------------------------------------------------
  // Il thunk usa rejectWithValue({ code: 'USER_VALIDATION_FAILED' })
  // Usiamo uno status "custom" 499 per mantenere lo stesso shape degli altri rami.
  if (originalError?.code === 'USER_VALIDATION_FAILED' || originalError?.response?.status === 499) {
    return {
      ...originalError,
      isUnauthorizedUser: true,
      response: {
        ...originalError.response,
        status: 499,
      },
    };
  }
  // status 403 - l'utente non ha i grants che servono per entrare nell'app
  // ------------------------
  else if (originalError.response?.status === 403) {
    return {
      ...originalError,
      isUnauthorizedUser: true,
      response: {
        ...originalError.response,
        customMessage: {
          title: getLocalizedOrDefaultLabel(
            'common',
            `messages.lacking-grants-for-app-title`,
            'Non sei autorizzato ad accedere ...'
          ),
          message: getLocalizedOrDefaultLabel(
            'common',
            `leaving-app.title`,
            'Stai uscendo da SEND ...'
          ),
        },
      },
    };
    // status 451 - access forbidden for legal reasons
    // ---------------------------------------------
    // Andrea Cimini, 2023.02.21
    // ------------------------
  } else if (originalError.response?.status === 451) {
    return {
      ...originalError,
      isUnauthorizedUser: true,
      response: {
        ...originalError.response,
        customMessage: {
          title: getLocalizedOrDefaultLabel(
            'common',
            `messages.451-title`,
            'Piattaforma non accessibile'
          ),
          message: getLocalizedOrDefaultLabel(
            'common',
            `messages.451-message`,
            'Non è possibile accedere alla piattaforma'
          ),
        },
      },
    };
  }
  // se il token non è valido, sia pa che pf forniscono una response
  // con status 400 e data.error 'Token is not valid'
  // ho pensato ad approfittarne per rendere un messaggio specifico
  // ma nella review è stato chiesto di gestire in modo particolare
  // solo lo status 403.
  // ---------------------------------------------
  // Carlos Lombardi, 2022.08.31
  // ------------------------
  return {
    ...originalError,
    isUnauthorizedUser: true,
    response: {
      ...originalError.response,
      customMessage: {
        title: getLocalizedOrDefaultLabel(
          'common',
          `messages.generic-token-exchange-problem`,
          "Non è stato possibile completare l'accesso ..."
        ),
        message: getLocalizedOrDefaultLabel(
          'common',
          `leaving-app.title`,
          'Stai uscendo da SEND ...'
        ),
      },
    },
  };
}

export function removeNullProperties<T extends BasicUser>(obj: T): T {
  const newObj = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // eslint-disable-next-line functional/immutable-data
        newObj[key as keyof T] = removeNullProperties(value);
      } else if (Array.isArray(value)) {
        // eslint-disable-next-line functional/immutable-data
        newObj[key as keyof T] = value.map((item) =>
          typeof item === 'object' ? removeNullProperties(item) : item
        ) as T[keyof T]; // add type assertion here
      } else {
        // eslint-disable-next-line functional/immutable-data
        newObj[key as keyof T] = value;
      }
    }
  }
  return newObj;
}
