import { screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { axe, render } from './test-utils';

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

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
