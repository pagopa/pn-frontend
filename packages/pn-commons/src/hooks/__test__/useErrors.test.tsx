import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { EnhancedStore } from '@reduxjs/toolkit';

import { AppStateState, appStateActions } from '../../redux/slices/appStateSlice';
import { createTestStore, renderHook } from '../../test-utils';
import { useErrors } from '../useErrors';

const TestStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: EnhancedStore<{ appState: AppStateState }>;
}) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useErrors', () => {
  let store: EnhancedStore<{ appState: AppStateState }>;
  let wrapper: FC<{ children: ReactNode }>;

  beforeAll(() => {
    store = createTestStore();
    wrapper = ({ children }: { children: ReactNode }) => (
      <TestStoreProvider store={store}>{children}</TestStoreProvider>
    );
  });

  it('should return false when there are no errors', () => {
    const { result } = renderHook(() => useErrors(), { wrapper });
    expect(result.current.hasApiErrors()).toBeFalsy();
  });

  it('should return false when there are no errors for a specific actionType', () => {
    const payload = {
      action: 'FETCH_DATA_ERROR',
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
      traceId: 'trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));

    const { result } = renderHook(() => useErrors(), { wrapper });
    expect(result.current.hasApiErrors('SOME_OTHER_ACTION')).toBeFalsy();
  });

  it('should return true when there are errors for a specific actionType', () => {
    const payload = {
      action: 'FETCH_DATA_ERROR',
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
      traceId: 'trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));

    const { result } = renderHook(() => useErrors(), { wrapper });
    expect(result.current.hasApiErrors('FETCH_DATA_ERROR')).toBeTruthy();
  });
});
