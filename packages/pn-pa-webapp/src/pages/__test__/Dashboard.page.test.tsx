import { screen } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../__test__/test-utils';
import Dashboard from '../dashboard.page';

describe('Dashboard Page', () => {
  it('renders dashboard page', () => {
    const spy = jest.spyOn(redux, 'useSelector');
    spy.mockReturnValue({
      notifications: [],
      pagination: {
        nextPagesKey: ['1'],
        size: 0,
        page: 0,
        moreResult: false,
      },
    });
    render(
      <Dashboard />
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
  });
});
