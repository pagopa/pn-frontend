import { act, renderHook } from '../../test-utils';
import { useEventEmitter } from '../useEventEmitter';

describe('useEventEmitter', () => {
  it('should return empty data when no event is emitted', () => {
    const { result } = renderHook(() => useEventEmitter<string>('test-event'));
    expect(result.current.eventData).toBeUndefined();
  });

  it('should return data when event is emitted', () => {
    const { result } = renderHook(() => useEventEmitter<string>('test-event'));
    act(() => {
      result.current.publishEvent('greatings');
    });
    expect(result.current.eventData).toBe('greatings');
  });
});
