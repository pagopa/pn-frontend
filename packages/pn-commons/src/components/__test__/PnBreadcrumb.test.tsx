import React from 'react';
import { vi } from 'vitest';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import PnBreadcrumb from '../PnBreadcrumb';

const mockBackActionHandler = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom') as any,
  useNavigate: () => mockBackActionHandler,
}));

describe('BreadcrumbLink Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb link', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        goBackAction={mockBackActionHandler}
        goBackLabel={'mocked-back-label'}
        linkRoute={'mocked-route'}
        linkLabel={'mocked-label'}
        currentLocationLabel={'mocked-current-label'}
      />
    );
    const indietroButton = result.getByTestId('breadcrumb-indietro-button');
    expect(indietroButton).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/mocked-label/i);
    expect(result.container).toHaveTextContent(/mocked-current-label/i);
    expect(indietroButton).toHaveTextContent(/mocked-back-label/i);
    fireEvent.click(indietroButton!);
    expect(mockBackActionHandler).toBeCalledTimes(1);
  });

  it('renders breadcrumb link - default back button label', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        goBackAction={mockBackActionHandler}
        linkRoute={'mocked-route'}
        linkLabel={'mocked-label'}
        currentLocationLabel={'mocked-current-label'}
      />
    );
    const indietroButton = result.getByTestId('breadcrumb-indietro-button');
    expect(indietroButton).toHaveTextContent('common - button.indietro');
  });

  it('renders breadcrumb link - default back action', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        linkRoute={'mocked-route'}
        linkLabel={'mocked-label'}
        currentLocationLabel={'mocked-current-label'}
      />
    );
    const indietroButton = result.getByTestId('breadcrumb-indietro-button');
    fireEvent.click(indietroButton!);
    expect(mockBackActionHandler).toBeCalledTimes(1);
    expect(mockBackActionHandler).toBeCalledWith(-1);
  });

  it('renders breadcrumb - no back button', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        showBackAction={false}
        goBackAction={mockBackActionHandler}
        goBackLabel={'mocked-back-label'}
        linkRoute={'mocked-route'}
        linkLabel={'mocked-label'}
        currentLocationLabel={'mocked-current-label'}
      />
    );
    const indietroButton = result.queryByTestId('breadcrumb-indietro-button');
    expect(indietroButton).not.toBeInTheDocument();
  });
});
