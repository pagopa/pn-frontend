import { render, screen } from '../../__test__/test-utils';
import Home from '../Institutions.page';

describe('Institutions page', () => {
  it('renders title and subtitle', () => {
    render(<Home />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('work-in-progress-alert')).toBeInTheDocument();
  });
});
