import React from 'react';
import { PartyRole } from '../../models/user';
import { render, axe } from '../../__test__/test-utils';
import RequireAuth from '../RequireAuth';

const managerRole = { role: PartyRole.MANAGER, partyRole: PartyRole.MANAGER };

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
  const initialState = (token: string) => (
    {
      preloadedState: {
        userState: {
          user: {
            sessionToken: token,
            organization: {
              roles: [managerRole]
            }
          }
        }
      }
    }
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders RequireAuth (user enabled to access)', () => {
    // render component
    const result = render(<RequireAuth roles={[PartyRole.MANAGER]}/>, initialState('mocked-token'));
    expect(result?.container).toHaveTextContent(/Generic Page/i);
  });

  it('renders RequireAuth (user not enabled to access - wrong role)', () => {
    // render component
    const result = render(<RequireAuth roles={[PartyRole.OPERATOR]} />, initialState('mocked-token'));
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });

  it('does not have basic accessibility issues rendering RequireAuth (user enabled to access)', async () => {
    const { container } = render(<RequireAuth roles={[PartyRole.MANAGER]} />, initialState('mocked-token'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('does not have basic accessibility issues rendering RequireAuth (user not enabled to access - wrong role)', async () => {
    const { container } = render(<RequireAuth roles={[PartyRole.OPERATOR]} />, initialState('mocked-token'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders RequireAuth (user not enabled to access - no token)', () => {
    // useState mock
    const setState = jest.fn();
    const setStateFn: any = (init: any) => [init, setState];
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(setStateFn);

    // render component
    const result = render(<RequireAuth roles={[PartyRole.MANAGER]}/>, initialState(''));
    expect(setState).toBeCalledTimes(1);
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });
});
