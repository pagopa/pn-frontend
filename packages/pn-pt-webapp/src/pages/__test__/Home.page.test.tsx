import { render, screen } from '../../__test__/test-utils';
import Home from '../Home.page';

describe('Home page', () => {
  it('renders title and subtitle', () => {
    render(<Home />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.subtitle')).toBeInTheDocument();
  });
});
