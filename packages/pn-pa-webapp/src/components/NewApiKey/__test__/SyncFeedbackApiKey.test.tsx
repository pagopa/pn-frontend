import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import SyncFeedbackApiKey from '../SyncFeedbackApiKey';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

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
    const { getByRole } = render(<SyncFeedbackApiKey />);
    const button = getByRole('button', { name: /go-to-api-keys/i });
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.API_KEYS);
  });
});
