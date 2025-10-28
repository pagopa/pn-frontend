import { vi } from 'vitest';

import { AppCurrentStatus } from '../../../models/AppStatus';
import {
  RenderResult,
  act,
  createMatchMedia,
  initLocalizationForTest,
  render,
} from '../../../test-utils';
import { AppStatusBar } from '../AppStatusBar';

const fakePalette = { success: { main: '#00FF00' }, error: { main: '#FF0000' } };

vi.mock('@mui/material', async () => {
  const original = await vi.importActual<any>('@mui/material');
  return {
    ...original,
    useTheme: () => ({
      ...original.useTheme(),
      palette: { ...original.useTheme().palette, ...fakePalette },
    }),
  };
});

const baseStatus: Omit<AppCurrentStatus, 'appIsFullyOperative'> = {
  lastCheckTimestamp: '2022-11-21T06:07:08Z',
};
const okStatus: AppCurrentStatus = { ...baseStatus, appIsFullyOperative: true };
const notOkStatus: AppCurrentStatus = { ...baseStatus, appIsFullyOperative: false };

describe('AppStatusBar component', () => {
  const original = window.matchMedia;
  let result: RenderResult | undefined;

  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    result = undefined;
  });

  afterAll(() => {
    window.matchMedia = original;
  });

  it('desktop - app status OK', async () => {
    await act(async () => {
      result = render(<AppStatusBar status={okStatus} />);
    });
    // check the "status OK" message is present, and that the "status not OK" message is not
    const okMessageComponent = result?.getByText('appStatus - appStatus.statusDescription.ok');
    const errorMessageComponent = result?.queryByText(
      'appStatus - appStatus.statusDescription.not-ok'
    );
    expect(okMessageComponent).toBeInTheDocument();
    expect(errorMessageComponent).not.toBeInTheDocument();
    // check main element: flexbox with row direction, border color success
    const mainElement = result?.getByTestId('app-status-bar');
    expect(mainElement).toHaveStyle({
      display: 'flex',
      'flex-direction': 'row',
      'border-color': fakePalette.success.main,
    });
    // check icon: must be CheckCircleIcon
    const iconElement = result?.getByTestId('CheckCircleIcon');
    expect(iconElement).toBeInTheDocument();
  });

  it('desktop - app status not OK', async () => {
    await act(async () => {
      result = render(<AppStatusBar status={notOkStatus} />);
    });
    // check the "status not OK" message is present, and that the "status OK" message is not
    const okMessageComponent = result?.queryByText('appStatus - appStatus.statusDescription.ok');
    const errorMessageComponent = result?.getByText(
      'appStatus - appStatus.statusDescription.not-ok'
    );
    expect(okMessageComponent).not.toBeInTheDocument();
    expect(errorMessageComponent).toBeInTheDocument();
    // check main element: flexbox with row direction, border color error
    const mainElement = result?.getByTestId('app-status-bar');
    expect(mainElement).toHaveStyle({
      display: 'flex',
      'flex-direction': 'row',
      'border-color': fakePalette.error.main,
    });
    // check icon: must be ErrorIcon
    const iconElement = result?.getByTestId('ErrorIcon');
    expect(iconElement).toBeInTheDocument();
  });

  it('mobile - app status OK', async () => {
    window.matchMedia = createMatchMedia(800);
    await act(async () => {
      result = render(<AppStatusBar status={okStatus} />);
    });
    // check the "status OK" message is present, and that the "status not OK" message is not
    const okMessageComponent = result?.getByText('appStatus - appStatus.statusDescription.ok');
    const errorMessageComponent = result?.queryByText(
      'appStatus - appStatus.statusDescription.not-ok'
    );
    expect(okMessageComponent).toBeInTheDocument();
    expect(errorMessageComponent).not.toBeInTheDocument();
    // check main element: flexbox with column direction, border color error
    const mainElement = result?.getByTestId('app-status-bar');
    expect(mainElement).toHaveStyle({
      display: 'flex',
      'flex-direction': 'column',
      'border-color': fakePalette.success.main,
    });
    // check icon: must be CheckCircleIcon
    const iconElement = result?.getByTestId('CheckCircleIcon');
    expect(iconElement).toBeInTheDocument();
  });
});
