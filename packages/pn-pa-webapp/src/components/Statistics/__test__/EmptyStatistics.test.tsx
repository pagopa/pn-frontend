import { render } from '../../../__test__/test-utils';
import EmptyStatistics from '../EmptyStatistics';

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
});
