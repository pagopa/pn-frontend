import { useRef } from 'react';

import { useEventEmitter } from '../../hooks';
import { fireEvent, render, waitFor } from '../../test-utils';
import A11yMessageAnnouncer, { A11yMessage } from '../A11yMessageAnnouncer';

const Component: React.FC = () => {
  const { publishEvent } = useEventEmitter<A11yMessage>('a11y-message');
  const clicks = useRef<number>(0);

  const handleClick = () => {
    if (clicks.current <= 1) {
      publishEvent({ message: 'Accessibility is great!!!' });
    } else {
      publishEvent({ message: 'Accessibility is so hard!!!' });
    }
    clicks.current++;
  };

  return (
    <>
      <A11yMessageAnnouncer />
      <button data-testid="emit-event" onClick={handleClick}>
        Emit event
      </button>
    </>
  );
};

describe('A11yMessageAnnouncer Component', () => {
  it('renders without message', () => {
    const { container } = render(<Component />);
    expect(container).not.toHaveTextContent('Accessibility is great!!!');
  });

  it('renders with message', async () => {
    const { container, getByTestId } = render(<Component />);
    const button = getByTestId('emit-event');
    fireEvent.click(button);
    await waitFor(() => {
      expect(container).toHaveTextContent('Accessibility is great!!!' + '\u200B');
    });
    // click again to check if the suffix change
    fireEvent.click(button);
    await waitFor(() => {
      expect(container).toHaveTextContent('Accessibility is great!!!' + '\u200C');
    });
    // click last time to check if with different message, suffix has the first value
    fireEvent.click(button);
    await waitFor(() => {
      expect(container).toHaveTextContent('Accessibility is so hard!!!' + '\u200B');
    });
  });
});
