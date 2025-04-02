import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import IOSmartAppBanner from '../IoSmartAppBanner';

describe('test IO Smart App Banner', () => {
  it('renders the component', () => {
    render(<IOSmartAppBanner />);
    const container = document.body;
    expect(container).toHaveTextContent('ioSmartAppBanner.title');
    expect(container).toHaveTextContent('ioSmartAppBanner.subtitle');

    const button = getById(container, 'ioSmartAppBannerAction');
    expect(button).toBeInTheDocument();
    expect(container).toHaveTextContent('ioSmartAppBanner.cta');
  });

  it('clicks the open button', () => {
    render(<IOSmartAppBanner />);
    // TODO: implement
  });
});
