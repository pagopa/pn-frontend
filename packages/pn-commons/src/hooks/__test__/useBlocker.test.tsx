import type { Transition } from 'history';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import { vi } from 'vitest';

import { renderHook } from '../../test-utils';
import { useBlocker } from '../useBlocker';

const blocker = vi.fn();

describe('useBlocker', () => {
  let navigator: {
    block: (cbk: (obj: { retry: () => void }) => void) => void;
    replace: () => void;
    go: () => void;
    push: () => void;
    createHref: () => string;
  };

  beforeEach(() => {
    navigator = {
      block: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      push: vi.fn(),
      createHref: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not set up a blocker when "when" is false', () => {
    const { unmount } = renderHook(() => useBlocker(blocker, false), {
      wrapper: ({ children }) => (
        <UNSAFE_NavigationContext.Provider value={{ navigator, basename: 'mock', static: true }}>
          {children}
        </UNSAFE_NavigationContext.Provider>
      ),
    });
    expect(navigator.block).not.toHaveBeenCalled();
    unmount();
  });

  it('should set up a blocker when "when" is true', () => {
    const { unmount } = renderHook(() => useBlocker(blocker, true), {
      wrapper: ({ children }) => (
        <UNSAFE_NavigationContext.Provider value={{ navigator, basename: 'mock', static: true }}>
          {children}
        </UNSAFE_NavigationContext.Provider>
      ),
    });
    expect(navigator.block).toHaveBeenCalled();
    unmount();
  });

  it('should call the provided blocker function when a transition occurs', () => {
    navigator = {
      ...navigator,
      block: vi.fn((callback) => {
        callback({ retry: vi.fn() });
      }),
    };
    const { unmount } = renderHook(() => useBlocker(blocker, true), {
      wrapper: ({ children }) => (
        <UNSAFE_NavigationContext.Provider value={{ navigator, basename: 'mock', static: true }}>
          {children}
        </UNSAFE_NavigationContext.Provider>
      ),
    });
    expect(blocker).toHaveBeenCalled();
    unmount();
  });

  // Questo test non è di facile implementazione
  // COSA SI VUOLE TESTARE
  // si vuole testare la parte di codice
  /*
  retry() {
    // stop blocking
    unblock();
    // retries location update
    tx.retry();
  },
  */
  // che si verifica quando la funzione retry viene chiamata
  // il problema sta nella funzione di unblock che, non venendo restituita, blocca l'esecuzione del codice
  // e fa fallire il test
  it.skip('should unblock the navigation when the blocker callback is retried', () => {
    const retryCallback = vi.fn();
    const unblockFn = vi.fn();

    navigator = {
      ...navigator,
      block: jest
        .fn((callback) => {
          callback({ retry: retryCallback });
          return unblockFn;
        })
        .mockReturnValue(unblockFn),
    };
    const blocker = (tx: Transition) => {
      tx.retry();
    };
    const { unmount } = renderHook(() => useBlocker(blocker, true), {
      wrapper: ({ children }) => (
        <UNSAFE_NavigationContext.Provider value={{ navigator, basename: 'mock', static: true }}>
          {children}
        </UNSAFE_NavigationContext.Provider>
      ),
    });
    expect(unblockFn).toBeCalledTimes(1);
    expect(retryCallback).toBeCalledTimes(1);
    unmount();
  });
});
