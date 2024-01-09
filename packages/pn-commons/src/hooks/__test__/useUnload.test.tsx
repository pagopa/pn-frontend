import { vi } from 'vitest';

import { render } from '../../test-utils';
import { useUnload } from '../useUnload';

const MockComponent = ({ fn }: { fn: () => void }) => {
  useUnload(fn);
  return <div>Mock Component</div>;
};

describe('useUnload', () => {
  it("should call the provided function on 'beforeunload'", () => {
    const mockCallback = vi.fn();
    const { unmount } = render(<MockComponent fn={mockCallback} />);
    // Trigger the beforeunload event
    window.dispatchEvent(new Event('beforeunload'));
    // Expect the callback to have been called
    expect(mockCallback).toHaveBeenCalled();
    // Destroy the component (useEffect clean up function called)
    unmount();
    // Trigger the beforeunload event again
    window.dispatchEvent(new Event('beforeunload'));
    // Expect the callback not to have been called this time (therefore it has been called only once during test execution)
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
