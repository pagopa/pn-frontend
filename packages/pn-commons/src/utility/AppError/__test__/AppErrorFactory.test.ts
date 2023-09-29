import AppErrorFactory from '../AppErrorFactory';
import { InternalServerAppError } from '../GenericAppError/InternalServerAppError';
import UnknownAppError from '../UnknownAppError';

describe('AppErrorFactory', () => {
  const appErrorFactory = new AppErrorFactory();

  it('test return instance of InternalServerAppError', () => {
    const currentClass = appErrorFactory.create(500);
    expect(currentClass).toBeInstanceOf(InternalServerAppError);
  });

  it('test return instance of UnknownAppError', () => {
    const currentClass = appErrorFactory.create({ code: 'mock-code' });
    expect(currentClass).toBeInstanceOf(UnknownAppError);
  });
});
