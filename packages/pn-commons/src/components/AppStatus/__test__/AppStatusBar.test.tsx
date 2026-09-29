import { themeNext as theme } from '@pagopa/mui-italia';

import { AppCurrentStatus } from '../../../models/AppStatus';
import {
  RenderResult,
  act,
  createMatchMedia,
  initLocalizationForTest,
  render,
} from '../../../test-utils';
import { AppStatusBar } from '../AppStatusBar';

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
      'border-color': theme.palette.success.main,
    });
    // check icon: must be CheckCircleRoundedIcon
    const iconElement = result?.getByTestId('CheckCircleRoundedIcon');
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
      'border-color': theme.palette.error.light,
    });
    // check icon: must be ErrorRoundedIcon
    const iconElement = result?.getByTestId('ReportRoundedIcon');
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
      'border-color': theme.palette.success.main,
    });
    // check icon: must be CheckCircleRoundedIcon
    const iconElement = result?.getByTestId('CheckCircleRoundedIcon');
    expect(iconElement).toBeInTheDocument();
  });
});
