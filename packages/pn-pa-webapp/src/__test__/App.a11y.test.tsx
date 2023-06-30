import * as React from 'react';

import App from '../App';
import { render, axe } from './test-utils';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// mocko SessionGuard perché produce problemi nel test
jest.mock('../navigation/SessionGuard', () => () => <div>Session Guard</div>);

describe('App - accessbility tests', () => {
  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<App />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
