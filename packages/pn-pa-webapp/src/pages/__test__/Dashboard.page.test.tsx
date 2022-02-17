import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from '../../redux/store';
import Dashboard from '../dashboard.page';

test('renders dashbaord page', () => {
  render(
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
  expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
});