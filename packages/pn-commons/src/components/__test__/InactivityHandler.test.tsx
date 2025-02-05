import { vi } from 'vitest';

import { act, fireEvent, render, within } from '../../test-utils';
import InactivityHandler from '../InactivityHandler';

const timerExpiredHandler = vi.fn();
const inactivityTimer = 60 * 1000;

const Component = () => (
  <InactivityHandler inactivityTimer={inactivityTimer} onTimerExpired={timerExpiredHandler}>
    Mocked children
  </InactivityHandler>
);

describe('InactivityHandler Component', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('test inactivity', async () => {
    // render component
    const { container } = render(<Component />);
    expect(container).toHaveTextContent('Mocked children');
    await act(() => vi.advanceTimersByTime(inactivityTimer));
    expect(timerExpiredHandler).toHaveBeenCalledTimes(1);
  });

  it('test user interaction', async () => {
    // render component
    const { getByTestId } = render(<Component />);
    await act(() => vi.advanceTimersByTime(inactivityTimer - 30 * 1000));
    const inactivityDialog = getByTestId('inactivity-modal');
    expect(inactivityDialog).toBeInTheDocument();
    const inactivityButton = within(inactivityDialog).getByTestId('inactivity-button');
    fireEvent.click(inactivityButton);
    expect(timerExpiredHandler).toHaveBeenCalledTimes(0);
  });
});
