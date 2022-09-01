import React from 'react';
import { act } from '@testing-library/react';
import { PartyRole, PNRole } from '../../models/user';
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

// Unfortunately a mock on SessionModal won't work since it is invoked from HandleAuth, which also lies in pn-commons.
// We mock the Dialog which is used inside SessionModal instead.
// --------------------
// Carlos Lombardi, 2022.08.18
jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    Dialog: () => <div>Session Modal</div>,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({ t: (str: string) => str })
}));

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
    jest.restoreAllMocks();
  });

  it('renders RequireAuth (user enabled to access)', async () => {
    // render component
    const result = render(<RequireAuth roles={[PNRole.ADMIN]}/>, initialState('mocked-token'));
    expect(result?.container).toHaveTextContent(/Generic Page/i);
  });

  it('renders RequireAuth (user not enabled to access - wrong role)', async () => {
    // render component
    const result = render(<RequireAuth roles={[PNRole.ADMIN]} />, initialState('mocked-token'));
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });

  it('does not have basic accessibility issues rendering RequireAuth (user enabled to access)', async () => {
    const { container } = render(<RequireAuth roles={[PNRole.ADMIN]} />, initialState('mocked-token'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /*
   * For the no token case, I had to split the verification in two separate test.
   * Why: because in order to make the session modal to appear, RequireAuth must change the value of a state.
   * Hence, if we mock the useState hook, thus preventing the value change to happen, we won't obtain the expected result.
   * 
   * Consequently, now there are two separated tests, one to verify that the setter is actually called, and other 
   * to verify the output of the component.
   * 
   * Carlos Lombardi, 2022.08.18
   */
  it('renders RequireAuth (user not enabled to access - no token) - internal behavior', async () => {
    // useState mock
    const setState = jest.fn();
    const setStateFn: any = (init: any) => [init, setState];
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(setStateFn);

    // render component
    await act(async () => {await render(<RequireAuth roles={[PNRole.ADMIN]}/>, initialState(''))});
    expect(setState).toBeCalledTimes(1);
  });

  it('renders RequireAuth (user not enabled to access - no token) - what is rendered', async () => {
    // render component
    // eslint-disable-next-line functional/no-let
    let result: any = null;
    await act(async () => {result = await render(<RequireAuth roles={[PNRole.ADMIN]}/>, initialState(''))});
    expect(result?.container).toHaveTextContent(/Session Modal/i);
  });
});
