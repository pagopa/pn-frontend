import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useBlocker } from '../useBlocker';
import { UNSAFE_NavigationContext } from 'react-router-dom';

let navigator;

beforeEach(() => {
    navigator = {
        block: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        push: jest.fn(),
        createHref: jest.fn(),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('useBlocker', () => {
    it('should not set up a blocker when "when" is false', () => {
        const blocker = jest.fn();


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
        const blocker = jest.fn();

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
        const blocker = jest.fn();
        navigator = {
            ...navigator,
            block: jest.fn((callback) => {
                callback({ retry: jest.fn() });
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

    it('should unblock the navigation when the blocker callback is retried', () => {
        const retryCallback = jest.fn();
        navigator = {
            ...navigator,
            block: jest.fn((callback) => {
                callback({ retry: jest.fn() });
            }),
        };

        const { unmount } = renderHook(() => useBlocker(() => { }), {
            wrapper: ({ children }) => (
                <UNSAFE_NavigationContext.Provider value={{ navigator, basename: 'mock', static: true }}>
                    {children}
                </UNSAFE_NavigationContext.Provider>
            ),
        });

        retryCallback(); // Simulate retrying the blocker
        expect(retryCallback).toHaveBeenCalled();
        unmount();
    });
});
