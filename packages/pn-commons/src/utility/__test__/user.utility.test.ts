import * as yup from 'yup';

import { noUserLoggedData, userLoggedData } from '../../__mocks__/User.mock';
import { initLocalizationForTest } from '../../test-utils';
import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
  removeNullProperties,
} from '../user.utility';

const userDataMatcher = yup.object(basicUserDataMatcherContents).noUnknown(true);

describe('user utility', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

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

  it('adaptedTokenExchangeError - 403', () => {
    const error = { message: 'This is a test error', response: { status: 403, data: 'Some data' } };
    const result = adaptedTokenExchangeError(error);
    expect(result).toStrictEqual({
      ...error,
      isUnauthorizedUser: true,
      response: {
        ...error.response,
        customMessage: {
          title: 'common - messages.lacking-grants-for-app-title',
          message: 'common - leaving-app.title',
        },
      },
    });
  });

  it('adaptedTokenExchangeError - 451', () => {
    const error = { message: 'This is a test error', response: { status: 451, data: 'Some data' } };
    const result = adaptedTokenExchangeError(error);
    expect(result).toStrictEqual({
      ...error,
      isUnauthorizedUser: true,
      response: {
        ...error.response,
        customMessage: {
          title: 'common - messages.451-title',
          message: 'common - messages.451-message',
        },
      },
    });
  });

  it('adaptedTokenExchangeError - generic', () => {
    const error = { message: 'This is a test error', response: { status: 500, data: 'Some data' } };
    const result = adaptedTokenExchangeError(error);
    expect(result).toStrictEqual({
      ...error,
      isUnauthorizedUser: true,
      response: {
        ...error.response,
        customMessage: {
          title: 'common - messages.generic-token-exchange-problem',
          message: 'common - leaving-app.title',
        },
      },
    });
  });

  it('removeNullProperties - remove null properties', () => {
    const objectWithNull = {
      sessionToken: 'token',
      name: 'name',
      family_name: 'familyName',
      fiscal_number: '123',
      email: 'email@email',
      uid: '12345',
      telephone: null,
      organization: {
        id: '1',
        description: null,
      },
      roles: [
        {
          role: 'admin',
          displayRole: null,
        },
      ],
    };

    const objectWithoutNull = {
      sessionToken: 'token',
      name: 'name',
      family_name: 'familyName',
      fiscal_number: '123',
      email: 'email@email',
      uid: '12345',
      organization: { id: '1' },
      roles: [{ role: 'admin' }],
    };

    const result = removeNullProperties(objectWithNull);

    expect(result).toStrictEqual(objectWithoutNull);
  });
});
