import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { act, screen, render as originalRender, cleanup } from '@testing-library/react';
import { AppCurrentStatus } from '../../../models';
import { render } from '../../../test-utils';
import { AppStatusBar } from '../AppStatusBar';

const fakePalette = { success: {main: "#00FF00"}, error: {main: "#FF0000"} };

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ palette: fakePalette }),
  };
});

/* eslint-disable-next-line functional/no-let */
let mockIsMobile: boolean;

jest.mock('../../../hooks', () => {
  const original = jest.requireActual('../../../hooks');
  return {
    ...original,
    useIsMobile: () => mockIsMobile,
  };
});

jest.mock('../../../services/localization.service', () => {
  const original = jest.requireActual('../../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_: string, key: string) => key,
  };
});

const baseStatus: Omit<AppCurrentStatus, "appIsFullyOperative"> = {
  lastCheckTimestamp: "2022-11-21T06:07:08Z",
  statusByFunctionality: [],
}
const okStatus: AppCurrentStatus = {...baseStatus, appIsFullyOperative: true};
const notOkStatus: AppCurrentStatus = {...baseStatus, appIsFullyOperative: false};

describe('AppStatusBar component', () => {
  /* eslint-disable-next-line functional/no-let */
  let checkIconElement: HTMLElement | null;
  /* eslint-disable-next-line functional/no-let */
  let errorIconElement: HTMLElement | null;

  beforeAll(async () => {
    originalRender(<CheckCircleIcon data-testid="icon"/>);
    checkIconElement = screen.queryByTestId("icon");
    cleanup();    
    originalRender(<ErrorIcon data-testid="icon"/>);
    errorIconElement = screen.queryByTestId("icon");
    cleanup();    
  });


  it('desktop - app status OK', async () => {
    mockIsMobile = false;
    await act(async () => void render(<AppStatusBar status={ okStatus }/>));

    // check the "status OK" message is present, and that the "status not OK" message is not
    const okMessageComponent = screen.queryByText('appStatus.statusDescription.ok');
    const errorMessageComponent = screen.queryByText('appStatus.statusDescription.not-ok');
    expect(okMessageComponent).toBeInTheDocument();
    expect(errorMessageComponent).not.toBeInTheDocument();

    // check main element: flexbox with row direction, border color success
    const mainElement = screen.queryByTestId("app-status-bar");
    expect(mainElement).toHaveStyle({ display: "flex", "flex-direction": "row", "border-color": fakePalette.success.main });

    // check icon: must be CheckCircleIcon
    const iconElement = screen.queryByTestId("app-status-bar-icon");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.innerHTML).toEqual(checkIconElement?.innerHTML);
  });

  it('desktop - app status not OK', async () => {
    mockIsMobile = false;
    await act(async () => void render(<AppStatusBar status={ notOkStatus }/>));

    // check the "status not OK" message is present, and that the "status OK" message is not
    const okMessageComponent = screen.queryByText('appStatus.statusDescription.ok');
    const errorMessageComponent = screen.queryByText('appStatus.statusDescription.not-ok');
    expect(okMessageComponent).not.toBeInTheDocument();
    expect(errorMessageComponent).toBeInTheDocument();

    // check main element: flexbox with row direction, border color error
    const mainElement = screen.queryByTestId("app-status-bar");
    expect(mainElement).toHaveStyle({ display: "flex", "flex-direction": "row", "border-color": fakePalette.error.main });

    // check icon: must be ErrorIcon
    const iconElement = screen.queryByTestId("app-status-bar-icon");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.innerHTML).toEqual(errorIconElement?.innerHTML);
  });

  it('mobile - app status OK', async () => {
    mockIsMobile = true;
    await act(async () => void render(<AppStatusBar status={ okStatus }/>));

    // check the "status OK" message is present, and that the "status not OK" message is not
    const okMessageComponent = screen.queryByText('appStatus.statusDescription.ok');
    const errorMessageComponent = screen.queryByText('appStatus.statusDescription.not-ok');
    expect(okMessageComponent).toBeInTheDocument();
    expect(errorMessageComponent).not.toBeInTheDocument();

    // check main element: flexbox with column direction, border color error
    const mainElement = screen.queryByTestId("app-status-bar");
    expect(mainElement).toHaveStyle({ display: "flex", "flex-direction": "column", "border-color": fakePalette.success.main });

    // check icon: must be CheckCircleIcon
    const iconElement = screen.queryByTestId("app-status-bar-icon");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.innerHTML).toEqual(checkIconElement?.innerHTML);
  });
});
