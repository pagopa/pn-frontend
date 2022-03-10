import * as redux from 'react-redux';

import { render } from "../../../test-utils";
import { LoadingOverlay } from "../LoadingOverlay";

describe('LoadingOverlay Component', () => {

  let useSelectorSpy: jest.SpyInstance; 

  beforeEach(() => {
    useSelectorSpy = jest.spyOn(redux, 'useSelector');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading overlay (false)', () => {
    useSelectorSpy.mockReturnValue(false);
    // render component
    const result = render(<LoadingOverlay />);
    const spinner = result.queryByRole('loadingSpinner');
    expect(spinner).not.toBeInTheDocument();
  });

  it('renders loading overlay (true)', () => {
    useSelectorSpy.mockReturnValue(true);
    // render component
    const result = render(<LoadingOverlay />);
    const spinner = result?.queryByRole('loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });
});