import { userResponseWithRetrievalId as baseValidUser } from '../../__mocks__/Auth.mock';
import { userDataMatcher } from '../user.utility';

describe('User utility test', () => {
  describe('userDataMatcher', () => {
    it('validates a correct user object without throwing', () => {
      expect(() =>
        userDataMatcher.validateSync(baseValidUser, { stripUnknown: false })
      ).not.toThrow();
    });

    it('allows omitting the optional "source" field', () => {
      const user = {
        ...baseValidUser,
        source: undefined,
      };

      expect(() => userDataMatcher.validateSync(user, { stripUnknown: false })).not.toThrow();
    });

    it('rejects unknown properties', () => {
      const userWithUnknownField = {
        ...baseValidUser,
        unknownField: 'unknown field',
      };

      expect(() =>
        userDataMatcher.validateSync(userWithUnknownField, { stripUnknown: false })
      ).toThrow();
    });

    it('rejects invalid "level"', () => {
      const invalidUser = {
        ...baseValidUser,
        level: '@L2',
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects non-numeric "iat" and "exp"', () => {
      const invalidUserIat = {
        ...baseValidUser,
        iat: 'not-a-number',
      };

      const invalidUserExp = {
        ...baseValidUser,
        exp: 'not-a-number',
      };

      expect(() => userDataMatcher.validateSync(invalidUserIat, { stripUnknown: false })).toThrow();
      expect(() => userDataMatcher.validateSync(invalidUserExp, { stripUnknown: false })).toThrow();
    });

    it('rejects invalid "aud" field', () => {
      const invalidUser = {
        ...baseValidUser,
        aud: 'this field cannot have spaces',
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects invalid "iss" field', () => {
      const invalidUser = {
        ...baseValidUser,
        iss: 'invalid-url',
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects invalid "jti" field', () => {
      const invalidUser = {
        ...baseValidUser,
        jti: '***@@@',
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects invalid "source.channel"', () => {
      const invalidUser = {
        ...baseValidUser,
        source: {
          ...baseValidUser.source,
          channel: 'INVALID_CHANNEL',
        },
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects "source.retrievalId" with invalid characters or length', () => {
      const userWithInvalidCharInRetrievalId = {
        ...baseValidUser,
        source: {
          ...baseValidUser.source,
          retrievalId: 'invalid\nid',
        },
      };

      const userRetrievalIdTooLong = {
        ...baseValidUser,
        source: {
          ...baseValidUser.source,
          retrievalId: 'this field cannot be longer than 50 characters, but it is.',
        },
      };

      expect(() =>
        userDataMatcher.validateSync(userWithInvalidCharInRetrievalId, { stripUnknown: false })
      ).toThrow();
      expect(() =>
        userDataMatcher.validateSync(userRetrievalIdTooLong, { stripUnknown: false })
      ).toThrow();
    });
  });
});
