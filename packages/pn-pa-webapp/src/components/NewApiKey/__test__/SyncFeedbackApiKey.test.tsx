import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import SyncFeedbackApiKey from '../SyncFeedbackApiKey';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')) as any,
  useNavigate: () => mockNavigateFn,
}));

describe('SyncFeedbackApiKey Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders SyncFeedback', () => {
    // render component
    const result = render(<SyncFeedbackApiKey />);
    expect(result.container).toHaveTextContent('api-key-succesfully-generated');
    expect(result.container).toHaveTextContent('copy-the-api-key');
    const button = result.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('go-to-api-keys');
  });

  it('navigate to api keys', () => {
    // render component
    const result = render(<SyncFeedbackApiKey />);
    const button = result.container.querySelector('button');
    fireEvent.click(button!);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.API_KEYS);
  });
});
