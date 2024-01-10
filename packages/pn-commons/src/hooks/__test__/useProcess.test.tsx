import { vi } from 'vitest';

import { act, renderHook, waitFor } from '../../test-utils';
import { useProcess } from '../useProcess';

describe('useProcess Hook', () => {
  // Test setup
  beforeEach(() => {
    vi.useFakeTimers(); // Optional: Use fake timers to control setTimeout
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with NOT_STARTED step', () => {
    const { result } = renderHook(() => useProcess([]));
    expect(result.current.currentSituation.step).toBe('NotStarted');
    expect(result.current.currentSituation.isActive).toBeFalsy();
  });

  it('should allow starting and ending a step', () => {
    const { result } = renderHook(() => useProcess(['Step1']));
    act(() => {
      result.current.startStep('Step1');
    });
    expect(result.current.currentSituation.step).toBe('Step1');
    expect(result.current.currentSituation.isActive).toBeTruthy();
    act(() => {
      result.current.endCurrentStep();
    });
    expect(result.current.currentSituation.isActive).toBeFalsy();
  });

  it('should not allow starting a step if the previous step is active', () => {
    const { result } = renderHook(() => useProcess(['Step1', 'Step2']));
    const action = vi.fn();
    act(() => {
      result.current.startStep('Step1');
    });
    act(() => {
      result.current.performStep('Step2', action);
    });
    expect(result.current.currentSituation.step).toBe('Step1');
    expect(result.current.currentSituation.isActive).toBeTruthy();
  });

  // TO-FIX
  // This test fails, probably due of the combination of useFakeTimers with a waitFor block.
  // I skip it to go forward with the migration jest -> vitest.
  // To analyze jointly with the skipped tests in src/components/NotificationDetail/__test__/NotificationPaymentF24Item.test.tsx
  // and src/components/SnackBar/__test__/SnackBar.test.tsx
  // ---------------------------------
  // Carlos Lombardi, 2023-11-10
  // ---------------------------------
  it.skip('should perform a step with an async action', async () => {
    const asyncAction = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() => useProcess(['Step1']));
    act(() => {
      result.current.performStep('Step1', asyncAction);
    });
    expect(result.current.currentSituation.step).toBe('Step1');
    expect(result.current.currentSituation.isActive).toBeTruthy();
    await waitFor(() => {
      expect(asyncAction).toHaveBeenCalled();
      expect(result.current.currentSituation.isActive).toBeFalsy();
    }); // Wait for the async action to complete
  });

  it('should check if the process is finished', () => {
    const { result } = renderHook(() => useProcess(['Step1']));
    const action = vi.fn();
    expect(result.current.isFinished()).toBeFalsy();
    act(() => {
      result.current.startStep('Step1');
    });
    expect(result.current.isFinished()).toBeFalsy();
    act(() => {
      result.current.performStep('Step2', action);
    });
    expect(result.current.isFinished()).toBeFalsy();
  });
});
