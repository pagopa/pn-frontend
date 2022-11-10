import { render, screen, fireEvent } from '@testing-library/react';
import { IDPS } from '../../../utils/IDPS';
import SpidSelect from '../SpidSelect';
import { ENV } from '../../../utils/env';

const oldWindowLocation = global.window.location;
const idps = IDPS.identityProviders;

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({ t: (str: string) => str }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

beforeAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
});
afterAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

test('go to the spid url', () => {
  render(<SpidSelect onBack={() => {}} />);

  idps.forEach((element) => {
    const spidImg = screen.getByAltText(element.name);
    const spidSpan = spidImg.parentNode;
    const spidButton = spidSpan!.parentNode;
    fireEvent.click(spidButton!);
    const id = element.entityId;
    expect(global.window.location.assign).toBeCalledWith(
      ENV.URL_API.LOGIN + '/login?entityID=' + id + '&authLevel=SpidL2'
    );
  });
});
