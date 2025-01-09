import { render } from '../../test-utils';
import DowntimeLanguageBanner from '../DowntimeLanguageBanner';

describe('DowntimeLanguageBanner Component', () => {
  it('render components', () => {
    const { container, getByTestId } = render(
      <DowntimeLanguageBanner downtimeExampleLink="mock-downtime-link" />
    );

    expect(container).toHaveTextContent('downtime_language_banner.message');
    const link = getByTestId('link-downtime-example');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('downtime_language_banner.link');
  });
});
