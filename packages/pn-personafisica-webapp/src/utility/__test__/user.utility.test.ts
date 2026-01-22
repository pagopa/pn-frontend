import {
  userResponseWithRetrievalId as baseValidUser,
  userResponse,
  userResponseWithRetrievalId,
} from '../../__mocks__/Auth.mock';
import { SourceChannel } from '../../models/User';
import { parseTokenExchangeResponse, userDataMatcher } from '../user.utility';

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

  describe('parseTokenExchangeResponse', () => {
    it('should parse response with all required fields', () => {
      const result = parseTokenExchangeResponse(userResponse);

      expect(result).toEqual(userResponse);
      expect(result.sessionToken).toBe('mocked-session-token');
      expect(result.email).toBe('info@agid.gov.it');
      expect(result.name).toBe('Mario');
      expect(result.family_name).toBe('Rossi');
      expect(result.uid).toBe('a6c1350d-1d69-4209-8bf8-31de58c79d6f');
      expect(result.fiscal_number).toBe('RSSMRA80A01H501U');
      expect(result.from_aa).toBe(false);
      expect(result.aud).toBe('portale.dev.pn.pagopa.it');
      expect(result.level).toBe('L2');
      expect(result.iat).toBe(1646394256);
      expect(result.exp).toBe(4850004251);
      expect(result.iss).toBe('https://spid-hub-test.dev.pn.pagopa.it');
      expect(result.jti).toBe('mockedJTI004');
      expect(result.source).toBeUndefined();
    });

    it('should include source field when present in response', () => {
      const result = parseTokenExchangeResponse(userResponseWithRetrievalId);

      expect(result.source).toEqual({
        channel: SourceChannel.TPP,
        details: 'mock-tpp-id',
        retrievalId: 'mock-retrieval-id',
      });
    });
  });
});
