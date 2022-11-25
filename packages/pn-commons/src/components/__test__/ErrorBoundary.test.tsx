import { render } from '../../test-utils';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test');
};

const mockEventTrackingCallback = jest.fn();

describe('ErrorBoundary Component', () => {
  it('renders ErrorBoundary (no errors)', () => {
    // render component
    const result = render(
      <ErrorBoundary>
        <div>Mocked Page</div>
      </ErrorBoundary>
    );
    expect(result.container).toHaveTextContent('Mocked Page');
  });

  it('renders ErrorBoundary (with errors)', async () => {
    // prevent error logging
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // render component
    const result = render(
      <ErrorBoundary eventTrackingCallback={mockEventTrackingCallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(result.container).toHaveTextContent('Qualcosa è andato storto');
    expect(result.container).toHaveTextContent(
      'Non siamo riusciti a caricare la pagina. Ricaricala, oppure prova più tardi.'
    );
    expect(mockEventTrackingCallback).toBeCalledTimes(1);
  });
});
