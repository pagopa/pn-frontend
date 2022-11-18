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
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/mocked-label/i);
    expect(result.container).toHaveTextContent(/mocked-current-label/i);
    const button = result.container.querySelector('button');
    expect(button).toHaveTextContent(/mocked-back-label/i);
    fireEvent.click(button!);
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
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).not.toBeInTheDocument();
  });
});
