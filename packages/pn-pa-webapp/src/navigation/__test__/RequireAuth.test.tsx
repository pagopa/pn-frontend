import * as redux from 'react-redux';

import { PartyRole } from '../../models/user';
import { render, axe } from '../../__test__/test-utils';
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

describe('RequireAuth Component', () => {
  beforeEach(() => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy.mockReturnValue('mocked-token').mockReturnValue(PartyRole.MANAGER);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders RequireAuth (user enabled to access)', () => {
    // render component
    const result = render(<RequireAuth roles={[PartyRole.MANAGER]} />);
    expect(result?.container).toHaveTextContent(/Generic Page/i);
  });

  it('renders RequireAuth (user not enabled to access)', () => {
    // render component
    const result = render(<RequireAuth roles={[PartyRole.OPERATOR]} />);
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });

  it('does not have basic accessibility issues rendering RequireAuth (user enabled to access)', async () => {
    const { container } = render(<RequireAuth roles={[PartyRole.MANAGER]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('does not have basic accessibility issues rendering RequireAuth (user not enabled to access)', async () => {
    const { container } = render(<RequireAuth roles={[PartyRole.OPERATOR]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
