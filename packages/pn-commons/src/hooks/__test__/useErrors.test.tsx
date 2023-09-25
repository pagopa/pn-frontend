import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import { appStateActions } from '../../redux/slices/appStateSlice';
import { createTestStore } from '../../test-utils';
import { useErrors } from '../useErrors';

const TestStoreProvider = ({ children, store }) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useErrors', () => {
  let store;
  let wrapper;

  beforeAll(() => {
    store = createTestStore();
    wrapper = ({ children }) => <TestStoreProvider store={store}>{children}</TestStoreProvider>;
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
    };
    store.dispatch(appStateActions.addError(payload));

    const { result } = renderHook(() => useErrors(), { wrapper });
    expect(result.current.hasApiErrors('FETCH_DATA_ERROR')).toBeTruthy();
  });
});
