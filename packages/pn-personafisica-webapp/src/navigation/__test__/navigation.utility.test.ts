// momentarily commented for pn-5157
// import { AppRouteType } from '@pagopa-pn/pn-commons';
import { goToLoginPortal } from '../navigation.utility';
import { getConfiguration } from "../../services/configuration.service";

const replaceFn = jest.fn();

describe('Tests navigation utility methods', () => {
  const { location } = window;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.location = {
      href: '',
      replace: replaceFn,
    };
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll((): void => {
    window.location = location;
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

  it('goToLoginPortal - aar', () => {
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PF, '<script>malicious code</script>malicious-aar-token');
    goToLoginPortal('<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    // momentarily commented for pn-5157
    // expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PF&aar=malicious-aar-token`);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=malicious-aar-token`);
  });
});
