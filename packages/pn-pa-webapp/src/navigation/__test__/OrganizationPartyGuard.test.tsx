import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import { AUTH_ACTIONS } from '../../redux/auth/actions';
import OrganizationPartyGuard from '../OrganizationPartyGuard';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockReduxState = {
  userState: {
    user: userResponse,
  },
};

const Guard = () => (
  <Routes>
    <Route path="/" element={<OrganizationPartyGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('OrganizationPartyGuard component', () => {
  it('no API error in call for organization party data - shows the content', async () => {
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const contentsComponent = screen.queryByText('Generic Page');
    const apiErrorComponent = screen.queryByTestId(
      `api-error-${AUTH_ACTIONS.GET_ORGANIZATION_PARTY}`
    );
    expect(contentsComponent).toBeInTheDocument();
    expect(apiErrorComponent).not.toBeInTheDocument();
  });

  it('API error in call for organization party data - shows ApiError component', async () => {
    await act(async () => {
      render(<Guard />, {
        preloadedState: {
          ...mockReduxState,
          appState: {
            loading: { result: false, tasks: {} },
            messages: {
              errors: [
                {
                  id: 'error',
                  blocking: false,
                  message: 'Errore',
                  title: 'Errore',
                  toNotify: true,
                  action: AUTH_ACTIONS.GET_ORGANIZATION_PARTY,
                  alreadyShown: true,
                },
              ],
              success: [],
            },
          },
        },
      });
    });
    const contentsComponent = screen.queryByText('Generic Page');
    const apiErrorComponent = screen.queryByTestId(
      `api-error-${AUTH_ACTIONS.GET_ORGANIZATION_PARTY}`
    );
    expect(contentsComponent).not.toBeInTheDocument();
    expect(apiErrorComponent).toBeInTheDocument();
  });
});
