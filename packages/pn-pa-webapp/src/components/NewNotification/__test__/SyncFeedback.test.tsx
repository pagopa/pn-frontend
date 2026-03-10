import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import SyncFeedback from '../SyncFeedback';

describe('SyncFeedback Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders SyncFeedback', () => {
    // render component
    const result = render(<SyncFeedback />);
    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('message');
    const button = result.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('go-to-notifications');
  });

  it('navigate to notifications', () => {
    // render component
    const { container, router } = render(<SyncFeedback />);
    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(router.state.location.pathname).toBe(routes.DASHBOARD);
  });
});
