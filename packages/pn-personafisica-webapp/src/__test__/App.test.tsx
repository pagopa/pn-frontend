import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import i18n from '../i18n';
import { store } from '../redux/store';

describe.skip('App', () => {
  beforeEach(async () => {
    i18n.init();
    const mGetRandomValues = jest.fn().mockReturnValueOnce(new Uint32Array(1));
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: mGetRandomValues },
    });
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
});
