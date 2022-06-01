import { render } from '../../__test__/test-utils';
import * as redux from '../../redux/hooks';
import RequireAuth from '../RequireAuth';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
  };
});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    SessionModal: () => <div>Session Modal</div>,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({ t: (str: string) => str }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('RequireAuth Component', () => {

  it('renders RequireAuth (user enabled to access)', () => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useAppSelector');
    useSelectorSpy.mockReturnValue('mocked-token');
    // render component
    const result = render(<RequireAuth />);
    expect(result?.container).toHaveTextContent(/Generic Page/i);
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReset();
  });

  it('renders RequireAuth (user not enabled to access)', () => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useAppSelector');
    useSelectorSpy.mockReturnValue(undefined);
    // render component
    const result = render(<RequireAuth />);
    expect(result?.container).toHaveTextContent(/Session Modal/i);
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReset();
  });
});
