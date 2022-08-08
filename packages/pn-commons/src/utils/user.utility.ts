import * as yup from 'yup';
import { BasicUser } from '../types/User';
import { dataRegex } from './string.utility';

export const basicUserDataMatcherContents = {
  family_name: yup.string().matches(dataRegex.name),
  fiscal_number: yup.string().matches(dataRegex.fiscalCode),
  name: yup.string().matches(dataRegex.name),
  uid: yup.string().uuid(),
  sessionToken: yup.string().matches(dataRegex.token),
  email: yup.string().email(),
};

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
