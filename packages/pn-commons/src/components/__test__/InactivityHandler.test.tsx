import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../test-utils';
import InactivityHandler from '../InactivityHandler';

const timerExpiredHandler = vi.fn();
const inactivityTimer = 2000;

const Component = () => (
  <InactivityHandler inactivityTimer={inactivityTimer} onTimerExpired={timerExpiredHandler}>
    Mocked children
  </InactivityHandler>
);

describe('InactivityHandler Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('test inactivity', async () => {
    // render component
    render(<Component />);
    await waitFor(
      () => {
        expect(timerExpiredHandler).toHaveBeenCalledTimes(1);
      },
      { timeout: inactivityTimer + 1000 }
    );
  });

  it('test user interaction', async () => {
    // render component
    const result = render(<Component />);
    await waitFor(
      () => { },
      { timeout: inactivityTimer - 1000 }
    );
    const buttonOfSessionModal = result.getByTestId('buttonOfSessionModal')
    fireEvent.click(buttonOfSessionModal);
    await waitFor(
      () => {
        expect(timerExpiredHandler).toHaveBeenCalledTimes(0);
      },
    );
  });
});
