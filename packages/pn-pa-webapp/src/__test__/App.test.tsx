import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { screen } from '@testing-library/react';

/* eslint-disable import/order */
import { render, axe } from './test-utils';
import App from '../App';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

describe('App', () => {
  it('Piattaforma notifiche', () => {
    render(<Component/>);
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
