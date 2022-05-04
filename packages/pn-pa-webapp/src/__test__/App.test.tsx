import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { render } from './test-utils';

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

expect.extend(toHaveNoViolations);

describe('App', () => {
  it('Piattaforma notifiche', () => {
    render(<Component/>);
    const welcomeElement = screen.getByText(/Piattaforma notifiche/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<Component/>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
