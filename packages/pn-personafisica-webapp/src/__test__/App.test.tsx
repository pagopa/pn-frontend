import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';
import i18n from '../i18n';
import { store } from '../redux/store';

expect.extend(toHaveNoViolations);

describe('App', () => {
  beforeEach(async () => {
    i18n.init();
  });

  it('Renderd Piattaforma notifiche', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback="loading...">
            <App />
          </Suspense>
        </Provider>
      </BrowserRouter>
    );
    const loading = screen.getByText(/loading.../i);
    expect(loading).toBeInTheDocument();
  });

  it.skip('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<App />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
