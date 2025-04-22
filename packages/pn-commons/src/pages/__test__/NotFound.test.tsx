import { vi } from 'vitest';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  const goBackFn = vi.fn();

  it('renders not found', () => {
    // render component
    const { getByTestId } = render(<NotFound goBackAction={goBackFn} />);
    const heading = getByTestId('not-found-title');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('common - not-found.title');
    const subHeading = getByTestId('not-found-description');
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent('common - not-found.description');
    const goBackAction = getByTestId('not-found-back-button');
    expect(goBackAction).toBeInTheDocument();
    expect(goBackAction).toHaveTextContent('common - not-found.back-to-home');
    fireEvent.click(goBackAction);
    expect(goBackFn).toHaveBeenCalledTimes(1);
  });
});
