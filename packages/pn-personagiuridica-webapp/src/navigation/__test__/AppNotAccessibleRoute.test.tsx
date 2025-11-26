import { vi } from 'vitest';

import { fireEvent, render } from '../../__test__/test-utils';
import { getConfiguration } from '../../services/configuration.service';
import AppNotAccessibleRoute from '../AppNotAccessibleRoute';
import * as routes from '../routes.const';

vi.mock('@pagopa-pn/pn-commons', async () => {
  const actual = await vi.importActual<any>('@pagopa-pn/pn-commons');
  return {
    ...actual,
    AppNotAccessible: ({ reason, onAction }: { reason: string; onAction: () => void }) => (
      <div data-testid="app-not-accessible" data-reason={reason}>
        <button data-testid="action-button" onClick={onAction}>
          Action
        </button>
      </div>
    ),
  };
});

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

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const wrapper = getByTestId('app-not-accessible');
    expect(wrapper.dataset.reason).toBe('not-accessible');
  });

  it('uses "user-validation-failed" reason when query param is set', () => {
    globalThis.history.pushState({}, '', `${notAccessibleBaseRoute}?reason=user-validation-failed`);

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const wrapper = getByTestId('app-not-accessible');
    expect(wrapper.dataset.reason).toBe('user-validation-failed');
  });

  it('redirects to landing site when reason is "not-accessible"', () => {
    globalThis.history.pushState({}, '', notAccessibleBaseRoute);

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const mockLocation = { href: '' };
    globalThis.location = mockLocation as any;

    const button = getByTestId('action-button');
    fireEvent.click(button);

    expect(mockLocation.href).toBe(landingSiteUrl);
  });

  it('opens mailto to support when reason is "user-validation-failed"', () => {
    globalThis.history.pushState({}, '', `${notAccessibleBaseRoute}?reason=user-validation-failed`);

    const { getByTestId } = render(<AppNotAccessibleRoute />);

    const mockLocation = { href: '' };
    globalThis.location = mockLocation as any;

    const button = getByTestId('action-button');
    fireEvent.click(button);

    expect(mockLocation.href).toBe(`mailto:${supportEmail}`);
  });
});
