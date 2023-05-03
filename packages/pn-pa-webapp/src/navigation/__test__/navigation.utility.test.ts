import { getConfiguration } from '../../services/configuration.service';
import { goToSelfcareLogin } from '../navigation.utility';

const exitFn = jest.fn();

describe('Tests notification.utility', () => {
  const { location } = window;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.location = {
      href: '',
      assign: exitFn,
    };
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll((): void => {
    window.location = location;
  });

  it('goToSelfcareLogin', () => {
    goToSelfcareLogin();
    expect(window.location.href).toBe(getConfiguration().SELFCARE_URL_FE_LOGIN);
  });
});
