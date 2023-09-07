import React from 'react';

import { fireEvent, render } from '../../test-utils';
import PnBreadcrumb from '../PnBreadcrumb';

describe('BreadcrumbLink Component', () => {
  const backActionHandlerMock = jest.fn();

  it('renders breadcrumb link', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        goBackAction={backActionHandlerMock}
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
    expect(backActionHandlerMock).toBeCalledTimes(1);
  });

  it('renders breadcrumb - no back button', () => {
    // render component
    const result = render(
      <PnBreadcrumb
        showBackAction={false}
        goBackAction={backActionHandlerMock}
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
