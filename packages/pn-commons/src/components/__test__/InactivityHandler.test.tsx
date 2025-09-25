import { vi } from 'vitest';

import { act, fireEvent, render, within } from '../../test-utils';
import InactivityHandler, { warningTimer } from '../InactivityHandler';

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

  it('test user interaction in warning modal', async () => {
    let fakeNow = 0;
    vi.setSystemTime(fakeNow);
    const { getByTestId } = render(<Component />);

    // Step for warning modal
    await act(async () => {
      fakeNow += inactivityTimer - warningTimer;
      vi.setSystemTime(fakeNow);
      vi.advanceTimersByTime(inactivityTimer - warningTimer);
    });

    const inactivityDialog = getByTestId('inactivity-modal');
    expect(inactivityDialog).toBeInTheDocument();
    const inactivityButton = within(inactivityDialog).getByTestId('inactivity-button');
    fireEvent.click(inactivityButton);

    // Step 1sec for interval callback
    await act(async () => {
      fakeNow += 1000;
      vi.setSystemTime(fakeNow);
      vi.advanceTimersByTime(1000);
    });

    expect(timerExpiredHandler).toHaveBeenCalledTimes(1);
  });
});
