import { vi } from 'vitest';

import { RenderResult, act, render } from '../../../test-utils';
import TimedMessage from '../TimedMessage';

describe('TimedMessage component', () => {
  const callbackFn = vi.fn();

  let result: RenderResult;

  it('render text message for 2000 milliseconds', async () => {
    // Render component
    await act(async () => {
      result = render(
        <TimedMessage timeout={2000} callback={callbackFn}>
          mock-message
        </TimedMessage>
      );
    });
    // Expect the message to be rendered
    const messageRendered = result.getByTestId('timed-message');
    expect(messageRendered).toBeInTheDocument();
    // Wait for 2000 milliseconds
    await act(() => new Promise((t) => setTimeout(t, 2000)));
    // Expect the message to be disappeared
    expect(messageRendered).not.toBeInTheDocument();
    // Expect the function callback to be called
    expect(callbackFn).toBeCalledTimes(1);
  });

  it('no message if timeout is 0', async () => {
    // Render component
    await act(async () => {
      result = render(
        <TimedMessage timeout={0} callback={callbackFn}>
          mock-message
        </TimedMessage>
      );
    });
    // Expect the message to be rendered
    const messageRendered = result.queryByTestId('timed-message');
    expect(messageRendered).not.toBeInTheDocument();
  });
});
