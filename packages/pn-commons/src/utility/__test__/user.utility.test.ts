import * as yup from 'yup';

import { noUserLoggedData, userLoggedData } from '../../__mocks__/User.mock';
import { basicInitialUserData, basicUserDataMatcherContents } from '../user.utility';

const userDataMatcher = yup.object(basicUserDataMatcherContents).noUnknown(true);

describe('user utility', () => {
  it('basicInitialUserData - no user logged', () => {
    const result = basicInitialUserData(userDataMatcher, noUserLoggedData);
    expect(result).toStrictEqual(noUserLoggedData);
  });

  it('basicInitialUserData - valid user logged', () => {
    sessionStorage.setItem('user', JSON.stringify(userLoggedData));
    const result = basicInitialUserData(userDataMatcher, noUserLoggedData);
    expect(result).toStrictEqual(userLoggedData);
  });

  it('basicInitialUserData - no valid user logged', () => {
    sessionStorage.setItem('user', JSON.stringify('not-a-valid-json'));
    const result = basicInitialUserData(userDataMatcher, noUserLoggedData);
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(result).toStrictEqual(noUserLoggedData);
  });

  it('basicInitialUserData - user with extra keys logged', () => {
    sessionStorage.setItem(
      'user',
      JSON.stringify({ ...userLoggedData, extraKey: 'key-that-must-not-exist' })
    );
    const result = basicInitialUserData(userDataMatcher, noUserLoggedData);
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(result).toStrictEqual(noUserLoggedData);
  });
});
