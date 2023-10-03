// momentarily commented for pn-5157
// import { AppRouteType } from '@pagopa-pn/pn-commons';
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
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PF);
    goToLoginPortal();
    expect(replaceFn).toBeCalledTimes(1);
    // momentarily commented for pn-5157
    // expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PF`);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}`);
  });

  it('goToLoginPortal - aar', () => {
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PF, 'fake-aar-token');
    goToLoginPortal('fake-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    // momentarily commented for pn-5157
    // expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PF&aar=fake-aar-token`);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=fake-aar-token`);
  });

  it('goToLoginPortal - aar with malicious code', () => {
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PF, '<script>malicious code</script>malicious-aar-token');
    goToLoginPortal('<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    // momentarily commented for pn-5157
    // expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PF&aar=malicious-aar-token`);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=malicious-aar-token`);
  });
});
