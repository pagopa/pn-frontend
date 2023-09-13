import AppErrorFactory from '../AppErrorFactory';
import GenericAppErrorFactory from '../GenericAppError/GenericAppErrorFactory';
import UnknownAppError from '../UnknownAppError';

describe('AppErrorFactory', () => {
  const appErrorFactory = new AppErrorFactory();

  it('test return instance of GenericAppErrorFactory', () => {
    const currentClass = appErrorFactory.create('mock-code');
    expect(currentClass instanceof GenericAppErrorFactory);
  });

  it('test return instance of UnknownAppError', () => {
    const currentClass = appErrorFactory.create({ code: 'mock-code' });
    expect(currentClass instanceof UnknownAppError);
  });
});
