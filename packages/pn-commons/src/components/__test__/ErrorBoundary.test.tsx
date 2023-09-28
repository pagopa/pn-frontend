import React from 'react';

import { fireEvent, getById, initLocalizationForTest, render } from '../../test-utils';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test');
};

const mockEventTrackingCallback = jest.fn();
const mockReload = jest.fn();

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
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // render component
    const { container } = render(
      <ErrorBoundary eventTrackingCallback={mockEventTrackingCallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    const reloadButton = getById(container, 'reloadButton');
    fireEvent.click(reloadButton);
    expect(mockReload).toBeCalledTimes(1);
  });
});
