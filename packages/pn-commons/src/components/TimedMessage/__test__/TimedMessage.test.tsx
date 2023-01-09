import React from 'react';

import { render, screen, act } from '../../../test-utils';
import TimedMessage from '../TimedMessage';

describe('TimedMessage component', () => {

  const callbackFn = jest.fn();

  it('render text message for 2000 milliseconds', async () => {

    // Render component
    void render(<TimedMessage
      message={'mock-message'}
      timeout={2000}
      callback={callbackFn}
    />);

    // Expect the message to be rendered
    const messageRendered = await screen.findByTestId("timed-message");
    expect(messageRendered).toBeInTheDocument();

    // Wait for 2000 milliseconds
    await act(() => new Promise(t => setTimeout(t, 2000)));

    // Expect the message to be disappeared
    expect(messageRendered).not.toBeInTheDocument();

    // Expect the function callback to be called
    expect(callbackFn).toBeCalledTimes(1);
  });

});