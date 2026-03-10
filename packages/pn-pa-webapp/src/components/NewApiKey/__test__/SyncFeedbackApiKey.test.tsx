import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import SyncFeedbackApiKey from '../SyncFeedbackApiKey';

describe('SyncFeedbackApiKey Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders SyncFeedback', () => {
    const { getByRole, getByText } = render(<SyncFeedbackApiKey />);
    expect(getByRole('heading', { name: /api-key-succesfully-generated/i })).toBeInTheDocument();
    expect(getByText(/copy-the-api-key/i)).toBeInTheDocument();
    const button = getByRole('button', { name: /go-to-api-keys/i });
    expect(button).toBeInTheDocument();
  });

  it('navigate to api keys', () => {
    const { getByRole, router } = render(<SyncFeedbackApiKey />);
    const button = getByRole('button', { name: /go-to-api-keys/i });
    fireEvent.click(button);
    expect(router.state.location.pathname).toBe(routes.API_KEYS);
  });
});
