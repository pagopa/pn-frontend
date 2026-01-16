import { userResponse as baseValidUser } from '../../__mocks__/Auth.mock';
import { userDataMatcher } from '../user.utility';

describe('User utility test', () => {
  describe('userDataMatcher', () => {
    it('validates a correct user object without throwing', () => {
      expect(() =>
        userDataMatcher.validateSync(baseValidUser, { stripUnknown: false })
      ).not.toThrow();
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

    it('rejects invalid "organization.fiscal_code"', () => {
      const invalidUser = {
        ...baseValidUser,
        organization: {
          ...baseValidUser.organization,
          fiscal_code: 'INVALID_CF',
        },
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects missing required organization name', () => {
      const invalidUser = {
        ...baseValidUser,
        organization: {
          ...baseValidUser.organization,
          name: undefined,
        },
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects missing required organization roles', () => {
      const invalidUser = {
        ...baseValidUser,
        organization: {
          ...baseValidUser.organization,
          roles: undefined,
        },
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects role without required "role" field', () => {
      const invalidUser = {
        ...baseValidUser,
        organization: {
          ...baseValidUser.organization,
          roles: [
            {
              ...baseValidUser.organization.roles[0],
              role: undefined,
            },
          ],
        },
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });

    it('rejects non-numeric desired_exp', () => {
      const invalidUser = {
        ...baseValidUser,
        desired_exp: 'not-a-number',
      };

      expect(() => userDataMatcher.validateSync(invalidUser, { stripUnknown: false })).toThrow();
    });
  });
});
