import { vi } from 'vitest';

import { IAppMessage } from '../../models/AppMessage';
import { act, render } from '../../test-utils';
import AppMessage from '../AppMessage';

const baseMessage: IAppMessage = {
  id: 'mocked-id',
  blocking: false,
  message: 'Mocked message',
  title: 'Mocked title',
  showTechnicalData: false,
  toNotify: true,
  alreadyShown: false,
};

const success: Array<IAppMessage> = [
  {
    id: 'mocked-id',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    showTechnicalData: false,
    toNotify: true,
    alreadyShown: false,
  },
];

const info: Array<IAppMessage> = [
  {
    id: 'mocked-id',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    showTechnicalData: false,
    toNotify: true,
    alreadyShown: false,
  },
];

describe('AppMessage Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers(); // cleans active timers
    vi.useRealTimers();
  });

  it('renders and auto-closes error message after 5s', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [baseMessage],
            success: [],
            info: [],
            warning: [],
          },
        },
      },
    });

    expect(getByTestId('snackBarContainer')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(testStore.getState().appState.messages.errors).toEqual([
      { ...baseMessage, alreadyShown: true },
    ]);
  });

  it('renders and does NOT auto-close if showTechnicalData is true', async () => {
    const techMessage = { ...baseMessage, id: 'msg-tech', showTechnicalData: true };
    const { getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [techMessage],
            success: [],
            info: [],
            warning: [],
          },
        },
      },
    });

    const snackBar = getByTestId('snackBarContainer');
    expect(snackBar).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(6000);
    });

    expect(snackBar).toBeInTheDocument(); // Still shown
  });

  it('does not enqueue alreadyShown messages', () => {
    const shownMessage = { ...baseMessage, id: 'msg-shown', alreadyShown: true };
    const { queryByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [shownMessage],
            success: [],
            info: [],
            warning: [],
          },
        },
      },
    });

    expect(queryByTestId('snackBarContainer')).not.toBeInTheDocument();
  });

  it('renders toast and dispatches event on close - success', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success,
            info: [],
            warning: [],
          },
        },
      },
    });

    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(testStore.getState().appState.messages.success).toStrictEqual([]);
  });

  it('renders toast and dispatches event on close - info', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success: [],
            info,
            warning: [],
          },
        },
      },
    });

    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(testStore.getState().appState.messages.info).toStrictEqual([]);
  });

  it('renders MISnackbar for warning messages', () => {
    const { getByRole, queryByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success: [],
            info: [],
            warning: [baseMessage],
          },
        },
      },
    });

    expect(
      getByRole('alert', { name: `${baseMessage.title}. ${baseMessage.message}` })
    ).toBeInTheDocument();
    expect(queryByTestId('snackBarContainer')).not.toBeInTheDocument();
  });

  it('renders MISnackbar for all warnings', () => {
    const miWarning: IAppMessage = {
      ...baseMessage,
      id: 'mi-warning',
      title: '',
      message: 'Dedicated warning',
    };

    const { getByRole, queryByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success: [],
            info: [],
            warning: [miWarning],
          },
        },
      },
    });

    expect(getByRole('alert', { name: 'Dedicated warning' })).toHaveTextContent(
      'Dedicated warning'
    );

    expect(queryByTestId('snackBarContainer')).not.toBeInTheDocument();
  });
});
