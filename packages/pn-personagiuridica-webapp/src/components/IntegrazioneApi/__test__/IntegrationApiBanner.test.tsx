import { render } from '@pagopa-pn/pn-commons/src/test-utils';

import IntegrationApiBanner from '../IntegrationApiBanner';

describe('IntegrationApiBanner Component', () => {
  it('render components admin', () => {
    const { container } = render(<IntegrationApiBanner isAdminWithoutGroups={true} />);
    expect(container).toHaveTextContent('banner.title');
    expect(container).toHaveTextContent('banner.description-admin');
  });

  it('render components operator', () => {
    const { container } = render(<IntegrationApiBanner isAdminWithoutGroups={false} />);
    expect(container).toHaveTextContent('banner.title');
    expect(container).toHaveTextContent('banner.description-operator');
  });
});
