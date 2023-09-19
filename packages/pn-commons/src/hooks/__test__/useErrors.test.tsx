import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useErrors } from '../useErrors';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { appStateActions, appStateReducer } from '../../redux/slices/appStateSlice';

describe('useErrors', () => {
    let store;

    beforeAll(() => {
        store = createTestStore();
    });
    
    it('should return false when there are no errors', () => {
        const wrapper = ({ children }) => (
            <TestStoreProvider store={store}>{children}</TestStoreProvider>
        );

        const { result } = renderHook(() => useErrors(), { wrapper });
        expect(result.current.hasApiErrors()).toBe(false);
    });

    it('should return false when there are no errors for a specific actionType', () => {
        const payload = { action: 'FETCH_DATA_ERROR', title: 'mocked-title', message: 'mocked-message' };
        store.dispatch(appStateActions.addError(payload));
        const wrapper = ({ children }) => (
            <TestStoreProvider store={store}>{children}</TestStoreProvider>
        );

        const { result } = renderHook(() => useErrors(), { wrapper });
        expect(result.current.hasApiErrors('SOME_OTHER_ACTION')).toBe(false);
    });

    it('should return true when there are errors for a specific actionType', () => {
        const payload = { action: 'FETCH_DATA_ERROR', title: 'mocked-title', message: 'mocked-message' };
        store.dispatch(appStateActions.addError(payload));

        const wrapper = ({ children }) => (
            <TestStoreProvider store={store}>{children}</TestStoreProvider>
        );

        const { result } = renderHook(() => useErrors(), { wrapper });
        expect(result.current.hasApiErrors('FETCH_DATA_ERROR')).toBe(true);
    });
});

export const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: { appState: appStateReducer },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

const TestStoreProvider = ({ children, store }) => {
    return <Provider store={store}>{children}</Provider>;
};