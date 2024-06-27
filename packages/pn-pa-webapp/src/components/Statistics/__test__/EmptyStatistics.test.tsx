import { render } from '../../../__test__/test-utils';
import EmptyStatistics from '../EmptyStatistics';

describe('EmptyStatistics component tests', () => {
  it('renders the component', () => {
    const result = render(<EmptyStatistics />);

    expect(result.container).toHaveTextContent('empty.description');

    const emptyImg = result.getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });

  it('renders the component with custom description', () => {
    const result = render(<EmptyStatistics description="custom-description" />);

    expect(result.container).toHaveTextContent('custom-description');

    const emptyImg = result.getByTestId('empty-image');
    expect(emptyImg).toBeInTheDocument();
  });
});
