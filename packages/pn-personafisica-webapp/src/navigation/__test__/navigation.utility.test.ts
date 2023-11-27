import { getConfiguration } from '../../services/configuration.service';
import { goToLoginPortal } from '../navigation.utility';

const replaceFn = jest.fn();

describe('Tests navigation utility methods', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '', replace: replaceFn },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  it('goToLoginPortal', () => {
    goToLoginPortal();
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}`);
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal('fake-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=fake-aar-token`);
  });

  it('goToLoginPortal - aar with malicious code', () => {
    goToLoginPortal('<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=malicious-aar-token`);
  });
});
