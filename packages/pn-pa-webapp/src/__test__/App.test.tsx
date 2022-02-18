import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';
import { store } from '../redux/store';
import { BrowserRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);
it('Piattaforma notifiche', () => {
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

it('Test if automatic accessibility tests passes', async () => {
  const { container } = render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
  const result = await axe(container);
  expect(result).toHaveNoViolations();
});
