import { BadRequestAppError } from '../BadRequestError';
import { ForbiddenAppError } from '../ForbiddenAppError';
import GenericAppErrorFactory from '../GenericAppErrorFactory';
import { InternalServerAppError } from '../InternalServerAppError';
import { NotFoundAppError } from '../NotFoundAppError';
import { UnauthorizedAppError } from '../UnauthorizedAppError';
import { UnavailableForLegalReasonsError } from '../UnavailableForLegalReasonsError';

describe('GenericAppErrorFactory', () => {
  const arrayCodes = [
    { code: 400, class: BadRequestAppError },
    { code: 401, class: UnauthorizedAppError },
    { code: 403, class: ForbiddenAppError },
    { code: 451, class: UnavailableForLegalReasonsError },
    { code: 404, class: NotFoundAppError },
    { code: 500, class: InternalServerAppError },
  ];

  it.each(arrayCodes)(`test return instance of $class.name with code $code`, (code) => {
    const currentClass = GenericAppErrorFactory.create(code.code);
    expect(currentClass instanceof code.class);
  });
});
