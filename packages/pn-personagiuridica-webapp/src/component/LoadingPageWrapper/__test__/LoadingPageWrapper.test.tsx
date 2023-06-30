import { render } from '../../../__test__/test-utils';
import LoadingPageWrapper from '../LoadingPageWrapper';


describe('LoadingPageWrapper component', () => {
  it('renders the skeleton', () => {
    const result = render(<LoadingPageWrapper>test</LoadingPageWrapper>);
    const skeleton = result.getByTestId('loading-skeleton')
    expect(skeleton).toBeInTheDocument();
  });

  it('renders the loading spinner', () => {
    const result = render(<LoadingPageWrapper isInitialized>test</LoadingPageWrapper>, {
      preloadedState: {
        appState: {
          loading: {
            result: true
          }
        }
      }
    });
    const innerComponent = result.getByTestId('loading-spinner');
    expect(innerComponent).toBeInTheDocument();
  });

  it('renders the inner component', () => {
    const result = render(<LoadingPageWrapper isInitialized><div data-testid="inner-component">test</div></LoadingPageWrapper>, {
      preloadedState: {
        appState: {
          loading: {
            result: true
          }
        }
      }
    });
    const innerComponent = result.getByTestId('inner-component')
    expect(innerComponent).toBeInTheDocument();
  });
});
