import { IAppMessage } from '../../models';
import { act, render } from '../../test-utils';
import AppMessage from '../AppMessage';

const errors: Array<IAppMessage> = [
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
  it('renders toast and dispacthes event on close - error', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors,
            success: [],
            info: [],
          },
        },
      },
    });
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait toast auto closing
    await act(() => new Promise((t) => setTimeout(t, 6000)));
    expect(testStore.getState().appState.messages.errors).toStrictEqual([
      { ...errors[0], alreadyShown: true },
    ]);
  }, 10000);

  it('renders toast and dispacthes event on close - success', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success: success,
            info: [],
          },
        },
      },
    });
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait toast auto closing
    await act(() => new Promise((t) => setTimeout(t, 6000)));
    expect(testStore.getState().appState.messages.success).toStrictEqual([]);
  }, 10000);

  it('renders toast and dispacthes event on close - info', async () => {
    const { testStore, getByTestId } = render(<AppMessage />, {
      preloadedState: {
        appState: {
          messages: {
            errors: [],
            success: [],
            info: info,
          },
        },
      },
    });
    const snackBarContainer = getByTestId('snackBarContainer');
    expect(snackBarContainer).toBeInTheDocument();
    // wait toast auto closing
    await act(() => new Promise((t) => setTimeout(t, 6000)));
    expect(testStore.getState().appState.messages.info).toStrictEqual([]);
  }, 10000);
});
