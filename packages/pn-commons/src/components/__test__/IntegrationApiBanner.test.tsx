import { render } from '../../test-utils';
import IntegrationApiBanner from '../IntegrationApiBanner';

describe('IntegrationApiBanner Component', () => {
  it('render components', () => {
    const { container } = render(
      <IntegrationApiBanner  />
    );

    expect(container).toHaveTextContent('banner.description');
  });
});
