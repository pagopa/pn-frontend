import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import { store } from '../redux/store';
import { BrowserRouter } from 'react-router-dom';

test('renders welcome greetings', () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
  const welcomeElement = screen.getByText(/Piattaforma notifiche/i);
  expect(welcomeElement).toBeInTheDocument();
});
