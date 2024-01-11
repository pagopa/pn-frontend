import { useEffect } from 'react';
import { vi } from 'vitest';

import { render } from '../../test-utils';
import { useSessionCheck } from '../useSessionCheck';

const mockFn = vi.fn();

const Component = ({ delay }: { delay: number }) => {
  const sessionCheck = useSessionCheck(1, mockFn);

  useEffect(() => {
    const nowEpoch = new Date();
    nowEpoch.setSeconds(nowEpoch.getSeconds() + delay);
    sessionCheck(nowEpoch.setMilliseconds(0) / 1000);
  }, []);

  return <div>Session check test</div>;
};

describe('test useSessionCheck hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hook should call callback', async () => {
    render(<Component delay={-10} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockFn).toBeCalledTimes(1);
  });

  it('hook should call callback - now', async () => {
    render(<Component delay={0} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockFn).toBeCalledTimes(1);
  });

  test("hook shouldn't call callback", async () => {
    render(<Component delay={10} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockFn).toBeCalledTimes(0);
  });
});
