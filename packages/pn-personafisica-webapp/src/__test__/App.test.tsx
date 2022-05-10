import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import i18n from '../i18n';
import { store } from '../redux/store';
import { axe } from './test-utils';

const Component = () => (
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback="loading...">
        <App />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

describe('App', () => {
  beforeEach(async () => {
    i18n.init();
  });

  it('Renderd Piattaforma notifiche', () => {
    render(<Component />);
    const loading = screen.getByText(/loading.../i);
    expect(loading).toBeInTheDocument();
  });

  it('Test if automatic accessibility tests passes', async () => {
    const { container } = render(<Component />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
