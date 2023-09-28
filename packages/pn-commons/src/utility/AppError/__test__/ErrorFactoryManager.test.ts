import AppErrorFactory from '../AppErrorFactory';
import errorFactoryManager from '../ErrorFactoryManager';

describe('errorFactoryManager', () => {
  it('set and get factory', () => {
    const factory = new AppErrorFactory();
    errorFactoryManager.factory = factory;
    expect(errorFactoryManager.factory).toStrictEqual(factory);
  });
});
