import { vi } from 'vitest';

import { useMobileOS } from '@pagopa-pn/pn-commons';
import { getByRole } from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import IOSmartAppBanner from '../IoSmartAppBanner';

vi.mock('@pagopa-pn/pn-commons', async (importActual) => {
  const actual = await importActual<typeof import('@pagopa-pn/pn-commons')>();
  return {
    ...actual,
    useMobileOS: vi.fn(), // Mock useMobileOS only
  };
});

describe('test IO Smart App Banner', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders the component', () => {
    (useMobileOS as jest.Mock).mockReturnValue('Android');
    render(<IOSmartAppBanner />);
    const container = document.body;
    expect(container).toHaveTextContent('ioSmartAppBanner.title');
    expect(container).toHaveTextContent('ioSmartAppBanner.subtitle');

    const openLink = getByRole(container, 'link');
    expect(openLink).toBeInTheDocument();
    expect(container).toHaveTextContent('ioSmartAppBanner.cta');
  });

  it("sets proper url for the 'open' link on Unknown devices", () => {
    (useMobileOS as jest.Mock).mockReturnValue('Unknown');
    render(<IOSmartAppBanner />);
    const container = document.body;

    const openLink = getByRole(container, 'link');
    expect(openLink).toHaveAttribute('href', getConfiguration().APP_IO_SITE);
  });

  it("sets proper url for the 'open' link on Android devices", () => {
    (useMobileOS as jest.Mock).mockReturnValue('Android');
    render(<IOSmartAppBanner />);
    const container = document.body;

    const openLink = getByRole(container, 'link');
    expect(openLink).toHaveAttribute('href', getConfiguration().APP_IO_ANDROID);
  });

  it("sets proper url for the 'open' link on iOS devices", () => {
    (useMobileOS as jest.Mock).mockReturnValue('iOS');
    render(<IOSmartAppBanner />);
    const container = document.body;

    const openLink = getByRole(container, 'link');
    expect(openLink).toHaveAttribute('href', getConfiguration().APP_IO_IOS);
  });
});
