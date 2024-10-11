import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { render } from '../../__test__/test-utils';
import { PNRole, PartyRole } from '../../redux/auth/types';
import ApiIntegration from '../ApiIntegration.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ApiIntegration page', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the ApiIntegration page with PublicKeys section if user is admin', async () => {
    const { container, getByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = getByTestId('publicKeys');
    expect(publicKeys).toBeInTheDocument();
  });

  it('should render the ApiIntegration page without PublicKeys section if user is admin with groups', async () => {
    const { container, queryByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            hasGroup: true,
          },
        },
      },
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
  });

  it('should render the ApiIntegration page without PublicKeys section if user is operator', async () => {
    const { container, queryByTestId } = render(<ApiIntegration />, {
      preloadedState: {
        userState: {
          user: {
            ...userResponse,
            organization: {
              ...userResponse.organization,
              roles: [
                {
                  partyRole: PartyRole.OPERATOR,
                  role: PNRole.OPERATOR,
                },
              ],
            },
          },
        },
      },
    });

    expect(container).toHaveTextContent(/title/i);
    expect(container).toHaveTextContent(/subtitle/i);
    const publicKeys = queryByTestId('publicKeys');
    expect(publicKeys).not.toBeInTheDocument();
  });
});
