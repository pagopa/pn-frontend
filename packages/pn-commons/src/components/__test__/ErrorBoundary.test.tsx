import React from 'react';
import { vi } from 'vitest';

import { fireEvent, getById, initLocalizationForTest, render } from '../../test-utils';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test');
};

const mockEventTrackingCallback = vi.fn();
const mockEventTrackingCallbackRefreshPage = vi.fn();
const mockReload = vi.fn();

describe('ErrorBoundary Component', () => {
  const original = window.location;

  beforeAll(() => {
    initLocalizationForTest();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockReload },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('renders ErrorBoundary (no errors)', () => {
    // render component
    const { container } = render(
      <ErrorBoundary>
        <div>Mocked Page</div>
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('Mocked Page');
  });

  it('renders ErrorBoundary (with errors)', async () => {
    // prevent error logging
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // render component
    const { container } = render(
      <ErrorBoundary eventTrackingCallback={mockEventTrackingCallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('common - error-boundary.title');
    expect(container).toHaveTextContent('common - error-boundary.description');
    expect(mockEventTrackingCallback).toBeCalledTimes(1);
  });

  it('reload page', async () => {
    // prevent error logging
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // render component
    const { container } = render(
      <ErrorBoundary
        eventTrackingCallback={mockEventTrackingCallback}
        eventTrackingCallbackRefreshPage={mockEventTrackingCallbackRefreshPage}
      >
        <ThrowError />
      </ErrorBoundary>
    );
    const reloadButton = getById(container, 'reloadButton');
    fireEvent.click(reloadButton);
    expect(mockEventTrackingCallbackRefreshPage).toBeCalledTimes(1);
    expect(mockReload).toBeCalledTimes(1);
  });
});
