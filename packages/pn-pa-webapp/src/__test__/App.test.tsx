import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { screen } from '@testing-library/react';

/* eslint-disable import/order */
import { render, axe } from './test-utils';
import App from '../App';
import { Party } from '../models/party';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// mocko SessionGuard perché produce problemi nel test
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
  userState: {
    user: {
      fiscal_number: 'mocked-fiscal-number',
      name: 'mocked-name',
      family_name: 'mocked-family-name',
      email: 'mocked-user@mocked-domain.com',
      sessionToken: 'mocked-token',
    },
    organizationParty: {
      id: '',
      name: '',
    } as Party,
  },
};

describe('App', () => {
  it('Piattaforma notifiche', () => {
    render(<Component/>, { preloadedState: reduxInitialState });
    const welcomeElement = screen.getByText(/header.notification-platform/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<Component/>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});

export {};
