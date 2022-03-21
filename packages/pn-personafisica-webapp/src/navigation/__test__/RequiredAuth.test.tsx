import { render } from '../../__test__/test-utils';
import * as redux from '../../redux/hooks';
import RequireAuth from '../RequiredAuth';

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
    AccessDenied: () => <div>Access Denied Page</div>,
  };
});

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
    expect(result?.container).toHaveTextContent(/Access Denied Page/i);
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReset();
  });
});
