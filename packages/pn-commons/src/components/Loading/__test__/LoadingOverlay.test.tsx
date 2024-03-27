import React from 'react';

import { render } from '../../../test-utils';
import { LoadingOverlay } from '../LoadingOverlay';

describe('LoadingOverlay Component', () => {
  const setLoadingState = (result: boolean) => ({
    preloadedState: {
      appState: {
        loading: {
          result,
        },
      },
    },
  });

  it('renders loading overlay (false)', () => {
    // render component
    const result = render(<LoadingOverlay />, setLoadingState(false));
    const spinner = result.queryByRole('loadingSpinner');
    expect(spinner).not.toBeInTheDocument();
  });

  it('renders loading overlay (true)', () => {
    // render component
    const result = render(<LoadingOverlay />, setLoadingState(true));
    const spinner = result?.getByRole('loadingSpinner');
    expect(spinner).toBeInTheDocument();
  });
});
