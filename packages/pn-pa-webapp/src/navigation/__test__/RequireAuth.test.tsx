import * as redux from 'react-redux';

import { UserRole } from "../../models/user";
import { render } from "../../__test__/test-utils";
import RequireAuth from "../RequireAuth";

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>
  }
});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    SessionModal: () => <div>Session Modal</div>
  }
});

describe('RequireAuth Component', () => {

  beforeEach(() =>  {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy
      .mockReturnValue('mocked-token')
      .mockReturnValue(UserRole.REFERENTE_AMMINISTRATIVO);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders RequireAuth (user enabled to access)', () => {
    // render component
    const result = render(<RequireAuth roles={[UserRole.REFERENTE_AMMINISTRATIVO]} />);
    expect(result?.container).toHaveTextContent(/Generic Page/i);
  });

  it('renders RequireAuth (user not enabled to access)', () => {
    // render component
    const result = render(<RequireAuth roles={[UserRole.REFERENTE_OPERATIVO]} />);
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });
});