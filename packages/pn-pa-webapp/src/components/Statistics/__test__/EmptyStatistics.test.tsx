import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import EmptyStatistics from '../EmptyStatistics';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('EmptyStatistics component tests', () => {
  it('renders the component', () => {
    const { container, getByTestId } = render(<EmptyStatistics />);

    expect(container).toHaveTextContent('empty.no_data_found');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });

  it('renders the component with custom description', () => {
    const { container, getByTestId } = render(<EmptyStatistics description="custom-description" />);

    expect(container).toHaveTextContent('custom-description');

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });

  it('renders the component with not enough data description and link to dashboard', () => {
    const { container, getByTestId } = render(
      <EmptyStatistics description="empty.not_enough_data" />
    );

    expect(container).toHaveTextContent('empty.not_enough_data');

    const link = getByTestId('link-to-dashboard');
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DASHBOARD);

    const emptyImg = getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
