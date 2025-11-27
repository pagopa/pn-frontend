import { fireEvent, render } from '../../__test__/test-utils';
import { getConfiguration } from '../../services/configuration.service';
import AppNotAccessibleRoute from '../AppNotAccessibleRoute';
import * as routes from '../routes.const';

describe('AppNotAccessibleRoute Component', () => {
  const notAccessibleBaseRoute = routes.NOT_ACCESSIBLE;

  let landingSiteUrl: string;
  let supportEmail: string;
  const originalLocation = globalThis.location;

  beforeAll(() => {
    const config = getConfiguration();
    landingSiteUrl = config.LANDING_SITE_URL;
    supportEmail = config.PAGOPA_HELP_EMAIL;
  });

  beforeEach(() => {
    globalThis.history.pushState({}, '', '/');
  });

  afterEach(() => {
    globalThis.location = originalLocation;
  });

  it('uses "not-accessible" as default reason when query param is missing', () => {
    globalThis.history.pushState({}, '', notAccessibleBaseRoute);

    const { container } = render(<AppNotAccessibleRoute />);

    expect(container).toHaveTextContent('not-accessible.title');
    expect(container).toHaveTextContent('not-accessible.description');
    expect(container).toHaveTextContent('not-accessible.action');
  });

  it('uses "user-validation-failed" reason when query param is set', () => {
    globalThis.history.pushState({}, '', `${notAccessibleBaseRoute}?reason=user-validation-failed`);

    const { container } = render(<AppNotAccessibleRoute />);

    expect(container).toHaveTextContent('user-validation-failed.title');
    expect(container).toHaveTextContent('user-validation-failed.description');
    expect(container).toHaveTextContent('user-validation-failed.cta');
  });

  it('redirects to landing site when reason is "not-accessible"', () => {
    globalThis.history.pushState({}, '', notAccessibleBaseRoute);

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const mockLocation = { href: '' };
    globalThis.location = mockLocation as any;

    const button = getByTestId('goToLanding-link');
    fireEvent.click(button);

    expect(mockLocation.href).toBe(landingSiteUrl);
  });

  it('opens mailto to support when reason is "user-validation-failed"', () => {
    globalThis.history.pushState({}, '', `${notAccessibleBaseRoute}?reason=user-validation-failed`);

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const mockLocation = { href: '' };
    globalThis.location = mockLocation as any;

    const button = getByTestId('feedback-button');
    fireEvent.click(button);

    expect(mockLocation.href).toBe(`mailto:${supportEmail}`);
  });
});
