import { initLocalizationForTest, render } from '../../test-utils';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders not found', () => {
    // render component
    const { getByTestId } = render(<NotFound />);
    const heading = getByTestId('notFoundTitle');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('common - not-found.title');
    const subHeading = getByTestId('notFoundDescription');
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent('common - not-found.description');
  });
});
