import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  NotificationDetailOtherDocument,
  NotificationStatus,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import {
  cancelledNotificationDTO,
  notificationDTO,
  notificationDTOMultiRecipient,
  raddNotificationDTO,
  raddNotificationDTOMultiRecipient,
} from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';

describe('NotificationDetail Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
  });

  it('renders NotificationDetail page - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');

    expect(
      result.getByRole('button', {
        name: /detail.breadcrumb-root/i,
      })
    ).toBeInTheDocument();

    expect(
      result.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent(notificationDTO.iun);

    // check summary card
    const protocolNumberDetail = result.getByText('detail.protocol-number').parentElement;
    expect(protocolNumberDetail).toHaveTextContent(notificationDTO.paProtocolNumber!);

    const subjectDetail = result.getByText('detail.subject').parentElement;
    expect(subjectDetail).toHaveTextContent(notificationDTO.subject);

    const senderDetail = result.getByText('detail.sender').parentElement;
    expect(senderDetail).toHaveTextContent(notificationDTO.senderDenomination!);

    const recipientDetail = result.getByText('detail.recipient').parentElement;

    expect(recipientDetail).not.toBeNull();
    expect(recipientDetail).toHaveTextContent(
      `${notificationDTO.recipients[0].denomination} - ${notificationDTO.recipients[0].taxId}`
    );
    expect(within(recipientDetail!).queryByRole('list')).not.toBeInTheDocument();

    // check notification details drawer
    fireEvent.click(
      result.getByRole('button', {
        name: 'detail.notification-details-aria-label',
      })
    );

    const notificationDetailsDrawer = result.getByTestId('notificationDetailsDrawer');
    expect(notificationDetailsDrawer).toBeInTheDocument();

    const notificationTextDetail = within(notificationDetailsDrawer).getByText(
      'detail.notification-text'
    ).parentElement;
    expect(notificationTextDetail).toHaveTextContent(notificationDTO.abstract!);

    const groupDetail = within(notificationDetailsDrawer).getByText('detail.groups').parentElement;
    expect(groupDetail).toHaveTextContent(notificationDTO.group!);

    const drawerRecipientDetail =
      within(notificationDetailsDrawer).getByText('detail.recipient').parentElement;

    expect(drawerRecipientDetail).not.toBeNull();
    expect(drawerRecipientDetail).toHaveTextContent(
      `${notificationDTO.recipients[0].denomination} - ${notificationDTO.recipients[0].taxId}`
    );
    expect(within(drawerRecipientDetail!).queryByRole('list')).not.toBeInTheDocument();

    // check attached documents
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');

    expect(notificationDetailDocuments).toHaveLength(notificationDTO.documents.length);

    notificationDetailDocuments.forEach((document) => {
      expect(document).toHaveTextContent('detail.download-message-available');
    });

    // check AAR documents
    const aarDocuments = result.getAllByTestId('aarBox');

    expect(aarDocuments).toHaveLength(notificationDTO.otherDocuments?.length ?? 0);

    aarDocuments.forEach((aarDocument) => {
      expect(aarDocument).toHaveTextContent('detail.download-aar-available');
    });

    // check timeline box
    expect(result.getByTestId('NotificationDetailTimeline')).toBeInTheDocument();

    // check payment box
    expect(result.getByTestId('paymentInfoBox')).toBeInTheDocument();

    // check downtimes box
    expect(result.getByTestId('downtimesBox')).toBeInTheDocument();

    // check cancellation alert
    expect(result.queryByTestId('alert')).not.toBeInTheDocument();
  });

  it('checks not available documents - mono recipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, { ...notificationDTO, documentsAvailable: false });

    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });

    const documentsDisabledAlert = result.getByTestId('documentsDisabled');

    expect(documentsDisabledAlert).toBeInTheDocument();
    expect(documentsDisabledAlert).toHaveTextContent('detail.download-message-expired');

    expect(result.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
  });

  it('checks temporarily unavailable aar (otherDocuments) - mono recipient', async () => {
    const notificationWithAvailableAar = {
      ...notificationDTO,
      aarDocumentAvailable: true,
    };
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationWithAvailableAar.iun}`)
      .reply(200, notificationWithAvailableAar);

    const otherDocument: NotificationDetailOtherDocument = {
      documentId: notificationWithAvailableAar.otherDocuments?.[0].documentId ?? '',
      documentType: notificationWithAvailableAar.otherDocuments?.[0].documentType ?? '',
      digests: { sha256: '' },
      contentType: '',
      ref: {
        key: '',
        versionToken: '',
      },
    };

    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationWithAvailableAar.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationDetail />
        </>,
        {
          route: `/${notificationWithAvailableAar.iun}`,
          path: '/:id',
        }
      );
    });

    const aarBox = result.getAllByTestId('aarBox')[0];
    expect(aarBox).toHaveTextContent('detail.download-aar-available');

    const documentButton = within(aarBox).getByTestId('documentButton');
    fireEvent.click(documentButton);

    await waitFor(() => {
      const alertMessage = result.getAllByTestId('snackBarContainer')[0];
      expect(alertMessage).toBeInTheDocument();
    });
    // simulate that aar is now available
    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationWithAvailableAar.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-aar-com',
      });
    fireEvent.click(documentButton);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/sent/${notificationWithAvailableAar.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-aar-com');
    });
  });

  it('checks unavailable aar (otherDocuments) - mono recipient', async () => {
    const notificationWithUnavailableAar = {
      ...notificationDTO,
      aarDocumentAvailable: false,
    };
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, notificationWithUnavailableAar);

    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });

    const aarSection = result.getByTestId('aarDownload');

    const aarDisabled = within(aarSection).getByTestId('aarDisabled');
    expect(aarDisabled).toHaveTextContent('detail.download-aar-expired');

    const documentButton = within(aarSection).queryAllByTestId('documentButton');
    expect(documentButton).toHaveLength(0);
  });

  it('executes the document download handler - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}/documents/ATTACHMENT?documentIdx=0`)
      .reply(200, {
        filename: notificationDTO.documents[0].ref.key,
        contentType: notificationDTO.documents[0].contentType,
        contentLength: 3028,
        sha256: notificationDTO.documents[0].digests.sha256,
        url: 'https://mocked-url.com',
      });
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    const documentButton = result.getAllByTestId('documentButton');
    fireEvent.click(documentButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/ATTACHMENT?documentIdx=0`
      );
    });
  });

  it('executes the downtimes legal fact download handler - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock.onGet(`/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      url: 'https://mocked-url-com',
    });
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    const downtimesBox = result.getByTestId('downtimesBox');
    const legalFactDowntimesButton = downtimesBox?.querySelectorAll('button');
    fireEvent.click(legalFactDowntimesButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`
      );
    });
  });

  it('clicks on the root button - mono recipient', async () => {
    // Seed history to verify that the back action uses the previous location.
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(
        <Routes>
          <Route path={routes.DASHBOARD} element={<div data-testid="mocked-page">hello</div>} />
          <Route path={'/:id'} element={<NotificationDetail />} />
        </Routes>,
        {
          path: '*',
          route: [routes.DASHBOARD, `/${notificationDTO.iun}`],
        }
      );
    });

    // before pressing "back" button - mocked page not present
    const mockedPageBefore = result.queryByTestId('mocked-page');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate press of "back" button
    const backButton = result.getByRole('button', { name: /detail.breadcrumb-root/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // after pressing "back" button - mocked page present
    await waitFor(() => {
      const mockedPageAfter = result.queryByTestId('mocked-page');
      expect(mockedPageAfter).toBeInTheDocument();
    });
  });

  it('errors on api call - mono recipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(errorMock.status, errorMock.data);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationDetail />
        </>,
        {
          route: `/${notificationDTO.iun}`,
          path: '/:id',
        }
      );
    });
    const statusApiErrorComponent = result.queryByTestId(
      `api-error-${NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it('clicks on the cancel button and on close modal', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });
    const cancelNotificationBtn = await waitFor(() => result.getByTestId('cancelNotificationBtn'));
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.getByTestId('cancel-notification-modal'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = within(modal).getByTestId('modalCloseBtnId');
    fireEvent.click(closeModalBtn);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  it('clicks on the cancel button and on confirm button', async () => {
    let count = 0;
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(() => {
      if (count === 0) {
        return [200, notificationDTO];
      }
      return [200, cancelledNotificationDTO];
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock.onPut(`/bff/v1/notifications/sent/${notificationDTO.iun}/cancel`).reply(200);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });

    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.getByTestId('cancel-notification-modal'));
    expect(modal).toBeInTheDocument();
    const checkbox = within(modal).getByTestId('checkbox');
    fireEvent.click(checkbox);
    const modalCloseAndProceedBtn = await waitFor(() =>
      within(modal).getByTestId('modalCloseAndProceedBtnId')
    );
    count++;
    fireEvent.click(modalCloseAndProceedBtn);
    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });
    expect(mock.history.put).toHaveLength(1);
    expect(mock.history.put[0].url).toBe(
      `/bff/v1/notifications/sent/${notificationDTO.iun}/cancel`
    );
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[2].url).toBe(`/bff/v1/notifications/sent/${notificationDTO.iun}`);
    });
    // check alert cancellation in progress
    let alert = await waitFor(() => result.getByTestId('alert'));
    expect(alert).toBeInTheDocument();
    expect(result.container).toHaveTextContent('detail.alert-cancellation-in-progress');
    expect(cancelNotificationBtn).not.toBeInTheDocument();
  });

  it('check alert on screen with change status', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      notificationStatus: NotificationStatus.CANCELLED,
      notificationStatusHistory: [
        {
          status: NotificationStatus.CANCELLED,
          activeFrom: '2033-08-14T13:42:54.17675939Z',
          relatedTimelineElements: [],
        },
        ...notificationDTO.notificationStatusHistory,
      ],
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });
    const alert = result.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(result.container).toHaveTextContent('detail.alert-cancellation-confirmed');
  });

  it('renders NotificationDetail page - multi recipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTOMultiRecipient.iun}`)
      .reply(200, notificationDTOMultiRecipient);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTOMultiRecipient.iun}`,
        path: '/:id',
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    // check summary card
    expect(result.container).toHaveTextContent(notificationDTOMultiRecipient.iun);
    expect(result.container).toHaveTextContent(notificationDTOMultiRecipient.paProtocolNumber!);
    expect(result.container).toHaveTextContent(notificationDTOMultiRecipient.subject);
    expect(result.container).toHaveTextContent(notificationDTOMultiRecipient.senderDenomination!);

    const recipientsDetail = result.getByText('detail.recipients').parentElement;
    expect(recipientsDetail).not.toBeNull();

    const recipientsList = within(recipientsDetail!).getByRole('list');
    const recipientItems = within(recipientsList).getAllByRole('listitem');

    expect(recipientItems).toHaveLength(notificationDTOMultiRecipient.recipients.length);

    notificationDTOMultiRecipient.recipients.forEach((recipient, index) => {
      expect(recipientItems[index]).toHaveTextContent(
        `${recipient.denomination} - ${recipient.taxId}`
      );
    });
    // check payment history box
    const paymentsTable = result.getByTestId('paymentInfoBox');
    expect(paymentsTable).toBeInTheDocument();
    // check documents box
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationDTOMultiRecipient.documents.length
    );
    expect(result.getAllByTestId('aarBox')).toHaveLength(
      notificationDTOMultiRecipient.otherDocuments?.length ?? 0
    );
    // check timeline summary box
    const notificationTimelineBox = result.getByTestId('NotificationDetailTimeline');
    expect(notificationTimelineBox).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
  });

  it('should not show the payment history box if there are no payments', async () => {
    const recipientsWithoutPayments = notificationDTO.recipients.map((recipient) => ({
      ...recipient,
      payments: [],
    }));

    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      recipients: recipientsWithoutPayments,
    });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${notificationDTO.iun}`,
        path: '/:id',
      });
    });
    const paymentsTable = result.queryByTestId('paymentInfoBox');
    expect(paymentsTable).not.toBeInTheDocument();
  });

  it('render success alert when documents have been picked up - monorecipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${raddNotificationDTO.iun}`)
      .reply(200, raddNotificationDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${raddNotificationDTO.iun}`,
        path: '/:id',
      });
    });

    const alertRadd = result.getByTestId('raddAlert');
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.description-mono-recipient');
  });

  it('render success alert when documents have been picked up - multirecipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${raddNotificationDTOMultiRecipient.iun}`)
      .reply(200, raddNotificationDTOMultiRecipient);
    await act(async () => {
      result = render(<NotificationDetail />, {
        route: `/${raddNotificationDTOMultiRecipient.iun}`,
        path: '/:id',
      });
    });

    const alertRadd = result.getByTestId('raddAlert');
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.description-multi-recipients');
  });
});
