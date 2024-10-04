import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { fireEvent, render } from '../../__test__/test-utils';
import { RECAPITI } from '../../navigation/routes.const';
import Profile from '../Profile.page';

const mockNavigateFn = vi.fn();
// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('testing profile page', () => {
  it('profile page renders properly', () => {
    const { getByRole, getByTestId, getByText } = render(<Profile />, {
      preloadedState: { userState: { user: userResponse } },
    });
    const title = getByRole('heading', { name: 'title' });
    expect(title).toBeInTheDocument();
    const subtitle = getByText('subtitle');
    expect(subtitle).toBeInTheDocument();
    const nameLabel = getByText('profile.name');
    expect(nameLabel).toBeInTheDocument();
    const familyNameLabel = getByText('profile.family_name');
    expect(familyNameLabel).toBeInTheDocument();
    const fiscalNumberLabel = getByText('profile.fiscal_number');
    expect(fiscalNumberLabel).toBeInTheDocument();
    const firstName = getByText(userResponse.name);
    expect(firstName).toBeInTheDocument();
    const familyName = getByText(userResponse.family_name);
    expect(familyName).toBeInTheDocument();
    const fiscalNumber = getByText(userResponse.fiscal_number);
    expect(fiscalNumber).toBeInTheDocument();
    const alert = getByTestId('contacts-redirect');
    expect(alert).toBeInTheDocument();
    const alertTitle = getByText('alert-redirect-to-contacts.title');
    expect(alertTitle).toBeInTheDocument();
    const alertMessage = getByText('alert-redirect-to-contacts.message');
    expect(alertMessage).toBeInTheDocument();
  });
});
