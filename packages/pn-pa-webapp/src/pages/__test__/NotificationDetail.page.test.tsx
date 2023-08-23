import React from 'react';
import * as redux from 'react-redux';

import { NotificationStatus } from '@pagopa-pn/pn-commons';
import { RenderResult, fireEvent, waitFor } from '@testing-library/react';

import { render } from '../../__test__/test-utils';
import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../redux/notification/__test__/test-utils';
import * as actions from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/apiClients';
import { store } from '../../redux/store';
import { cancelNotification } from '../../redux/notification/actions';
import { CANCEL_NOTIFICATION } from '../../api/notifications/notifications.routes';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'mocked-id' }),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailDocuments: ({
    clickHandler,
  }: {
    clickHandler: (documentIndex: string) => void;
  }) => (
    <div data-testid="documentButton" onClick={() => clickHandler('0')}>
      Documents
    </div>
  ),
  NotificationDetailTimeline: ({
    clickHandler,
  }: {
    clickHandler: (legalFact: { key: string; category: string }) => void;
  }) => (
    <div
      data-testid="legalFactButton"
      onClick={() => clickHandler({ key: 'mocked-key', category: 'mocked-category' })}
    >
      Timeline
    </div>
  ),
}));

describe('NotificationDetail Page (one recipient)', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    mock = new MockAdapter(apiClient);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getSentNotification');
    actionSpy.mockImplementation(mockActionFn);

    // render component
    result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: notificationToFe,
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
  });

  const changeStatus = (status: NotificationStatus) => {
    result.unmount();
    result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: { ...notificationToFe, notificationStatus: status },
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('renders NotificationDetail page', () => {
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.getByTestId('detailTable')).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/1,30 €/i);
    expect(result.container).toHaveTextContent(
      `${notificationToFe.recipients[0].payment?.creditorTaxId} - ${notificationToFe.recipients[0].payment?.noticeCode}`
    );
    expect(result.container).toHaveTextContent(/Documents/i);
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-id');
    // check payment history box
    const paymentTable = result.getByTestId('paymentTable');
    const paymentRecipient = result.getByTestId('paymentRecipient');
    expect(paymentTable).toBeInTheDocument();
    expect(paymentRecipient).toBeInTheDocument();
  });

  test('executes the document and legal fact download handler', async () => {
    const documentButton = result.getAllByTestId('documentButton');
    const legalFactButton = result.getByTestId('legalFactButton');
    expect(mockDispatchFn).toBeCalledTimes(1);
    fireEvent.click(documentButton[0]);
    expect(mockDispatchFn).toBeCalledTimes(2);
    fireEvent.click(legalFactButton);
    expect(mockDispatchFn).toBeCalledTimes(4);
  });

  test('clicks on the back button', () => {
    const backButton = result.getByRole('button', { name: /indietro/i });
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });

  test('clicks on the cancel button and on close modal', async () => {
    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = modal?.querySelector('[data-testid="modalCloseBtnId"]');
    fireEvent.click(closeModalBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  test('check alert on screen with change status', () => {
    changeStatus(NotificationStatus.CANCELLED);
    const alert = result.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(result.container).toHaveTextContent('detail.alert-cancellation-confirmed');
    changeStatus(NotificationStatus.CANCELLATION_IN_PROGRESS);
    expect(result.container).toHaveTextContent('detail.alert-cancellation-in-progress');
    changeStatus(NotificationStatus.DELIVERED);
    expect(alert).not.toBeInTheDocument();
  });

  test('clicks on the cancel button and on confirm button', async () => {
    mock.onPut(CANCEL_NOTIFICATION('mocked-iun')).reply(200);

    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const modalCloseAndProceedBtn = modal?.querySelector(
      '[data-testid="modalCloseAndProceedBtnId"]'
    );
    fireEvent.click(modalCloseAndProceedBtn!);
    const action = await store.dispatch(cancelNotification('mocked-iun'));
    expect(action.type).toBe('cancelNotification/fulfilled');
    expect(action.payload).toEqual(undefined);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });
});

describe('NotificationDetail Page (multi recipient)', () => {
  let result: RenderResult;
  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getSentNotification');
    actionSpy.mockImplementation(mockActionFn);
    // render component
    result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: notificationToFeMultiRecipient,
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
  });

  test('renders NotificationDetail page', () => {
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(
      notificationToFeMultiRecipient.subject
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.getByTestId('detailTable')).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/2,00 €/i);
    for (const recipient of notificationToFeMultiRecipient.recipients) {
      expect(result.container).toHaveTextContent(
        `${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
      );
    }
    expect(result.container).toHaveTextContent(/Documents/i);
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-id');
  });
});
