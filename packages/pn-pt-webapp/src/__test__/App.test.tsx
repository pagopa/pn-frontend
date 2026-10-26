import App from '../App';
import { HOME } from '../navigation/routes.const';
import { render, screen } from './test-utils';

describe('App', () => {
  it('renders the home page', () => {
    const { router } = render(<App />);
    expect(screen.getByTestId('homePage')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(HOME);
  });
});
