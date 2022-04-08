import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import i18n from '../i18n';
import { store } from '../redux/store';

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
});
