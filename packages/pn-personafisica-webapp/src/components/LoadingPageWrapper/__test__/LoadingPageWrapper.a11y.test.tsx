import { axe, render } from '../../../__test__/test-utils';
import LoadingPageWrapper from '../LoadingPageWrapper';

describe('LoadingPageWrapper component - accessibility tests', () => {
  it('is component accessible - skeleton', async () => {
    const result = render(<LoadingPageWrapper>test</LoadingPageWrapper>);
    const results = await axe(result.container);
    expect(results).toHaveNoViolations();
  });

  it('is component accessible - spinner', async () => {
    const result = render(<LoadingPageWrapper isInitialized>test</LoadingPageWrapper>, {
      preloadedState: {
        appState: {
          loading: {
            result: true,
          },
        },
      },
    });
    const results = await axe(result.container);
    expect(results).toHaveNoViolations();
  });
});
