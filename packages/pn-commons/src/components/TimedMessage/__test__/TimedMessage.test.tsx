import React from 'react';

import { RenderResult, act, render } from '../../../test-utils';
import TimedMessage from '../TimedMessage';

describe('TimedMessage component', () => {
  const callbackFn = jest.fn();

  let result: RenderResult;

  it('render text message for 2000 milliseconds', async () => {
    // Render component
    await act(async () => {
      result = render(
        <TimedMessage message={'mock-message'} timeout={2000} callback={callbackFn} />
      );
    });

    // Expect the message to be rendered
    const messageRendered = result?.getByTestId('timed-message');
    expect(messageRendered).toBeInTheDocument();

    // Wait for 2000 milliseconds
    await act(() => new Promise((t) => setTimeout(t, 2000)));

    // Expect the message to be disappeared
    expect(messageRendered).not.toBeInTheDocument();

    // Expect the function callback to be called
    expect(callbackFn).toBeCalledTimes(1);
  });
});
