import { render } from '../../../__test__/test-utils';
import DelegatesByCompany from '../DelegatesByCompany';
import React from 'react';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component - assuming delegates API works properly', () => {
  it('renders the empty state', () => {
    const result = render(<DelegatesByCompany />);
    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addButton = result.getByTestId('addDeleghe');
    expect(addButton).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
  });
});
