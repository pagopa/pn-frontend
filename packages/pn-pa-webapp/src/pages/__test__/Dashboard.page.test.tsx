import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Dashboard from '../dashboard.page';
import * as redux from 'react-redux';

describe('Dashboard Page', () => {
  // TODO fix this test: something in pagination mock is wrong
  test.skip('renders dashboard page', () => {
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
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
  });
});
