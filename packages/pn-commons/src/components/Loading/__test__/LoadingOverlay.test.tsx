import { act, RenderResult } from "@testing-library/react";
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

  it('renders loading overlay (false)', async () => {
    useSelectorSpy.mockReturnValue(false);
    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(<LoadingOverlay />);
    });
    const spinner = result?.queryByRole('loadingSpinner');
    expect(spinner).not.toBeInTheDocument();
  });

  it('renders loading overlay (true)', async () => {
    useSelectorSpy.mockReturnValue(true);
    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(<LoadingOverlay />);
    });
    const spinner = result?.queryByRole('loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });
});