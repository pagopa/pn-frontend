import { BadRequestAppError } from '../BadRequestError';
import { ForbiddenAppError } from '../ForbiddenAppError';
import GenericAppErrorFactory from '../GenericAppErrorFactory';
import { InternalServerAppError } from '../InternalServerAppError';
import { NotFoundAppError } from '../NotFoundAppError';
import { UnauthorizedAppError } from '../UnauthorizedAppError';
import { UnavailableForLegalReasonsError } from '../UnavailableForLegalReasonsError';

describe('GenericAppErrorFactory', () => {
  const arrayCodes = [400, 401, 403, 451, 404, 500];

  const arrayClasses = [
    BadRequestAppError,
    UnauthorizedAppError,
    ForbiddenAppError,
    UnavailableForLegalReasonsError,
    NotFoundAppError,
    InternalServerAppError,
  ];

  arrayCodes.forEach((code, index) => {
    const currentClass = GenericAppErrorFactory.create(code);
    it(`test return instance of ${currentClass.constructor.name} with code ${code}`, () => {
      expect(currentClass instanceof arrayClasses[index]);
    });
  });
});
