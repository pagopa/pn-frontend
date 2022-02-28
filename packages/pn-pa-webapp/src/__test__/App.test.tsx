import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import App from '../App';
import { render } from './test-utils';

expect.extend(toHaveNoViolations);
describe('App', () => {
  it('Piattaforma notifiche', () => {
    render(
      <App />
    );
    const welcomeElement = screen.getByText(/Piattaforma notifiche/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it.skip('Test if automatic accessibility tests passes', async () => {
    const { container } = render(
      <App />
    );
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
