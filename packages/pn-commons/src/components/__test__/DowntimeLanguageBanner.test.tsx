import { render, within } from '../../test-utils';
import DowntimeLanguageBanner from '../DowntimeLanguageBanner';

describe('DowntimeLanguageBanner Component', () => {
  it('render components', () => {
    const { container, getByTestId } = render(
      <DowntimeLanguageBanner downtimeExampleLink="mock-downtime-link" />
    );

    expect(container).toHaveTextContent('downtime_language_banner.message');

    const alert = getByTestId('downtimeLanguageBanner');
    expect(alert).toBeInTheDocument();

    const link = within(alert).getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('downtime_language_banner.link');
  });
});
