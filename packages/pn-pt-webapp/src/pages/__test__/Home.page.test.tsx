import { render, screen } from '../../__test__/test-utils';
import Home from '../Home.page';

describe('Home page', () => {
  it('renders the page title', () => {
    render(<Home />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });
});
