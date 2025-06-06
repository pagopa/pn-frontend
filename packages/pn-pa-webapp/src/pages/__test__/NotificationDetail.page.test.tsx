import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  AppMessage,
  AppResponseMessage,
  NotificationDetail as NotificationDetailModel,
  NotificationDetailOtherDocument,
  NotificationStatus,
  ResponseEventDispatcher,
  TimelineCategory,
  formatDate,
  formatToTimezoneString,
  today,
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
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: () => ({ id: 'RTRD-UDGU-QTQY-202308-P-1' }),
}));

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) =>
      t.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0];
};

describe('NotificationDetail Page', async () => {
  const mockLegalIds = getLegalFactIds(notificationDTO, 0);
  const original = window.location;

  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: vi.fn() },
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('renders NotificationDetail page - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationDTO.subject);
    expect(result.container).toHaveTextContent(notificationDTO.abstract!);
    // check summary table
    const notificationDetailTable = result.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(`detail.sender${notificationDTO.senderDenomination}`);
    expect(tableRows[1]).toHaveTextContent(
      `detail.recipient${notificationDTO.recipients[0].denomination}`
    );
    expect(tableRows[2]).toHaveTextContent(
      `detail.tax-id-citizen-recipient${notificationDTO.recipients[0].taxId}`
    );
    // format date beacuse in UI the date is formatted
    expect(tableRows[3]).toHaveTextContent(`detail.date${formatDate(notificationDTO.sentAt)}`);
    expect(tableRows[4]).toHaveTextContent(`detail.iun${notificationDTO.iun}`);
    expect(tableRows[5]).toHaveTextContent(`detail.groups${notificationDTO.group}`);
    // check documents box
    let notificationDocumentLength: number;
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    if (notificationDTOMultiRecipient.otherDocuments) {
      notificationDocumentLength =
        notificationDTOMultiRecipient.documents.length +
        notificationDTOMultiRecipient.otherDocuments.length;
    } else {
      notificationDocumentLength = notificationDTOMultiRecipient.documents.length;
    }

    expect(notificationDetailDocuments?.length).toBeGreaterThanOrEqual(notificationDocumentLength);
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.download-aar-available|detail.download-message-available|detail.download-message-expired|detail.download-aar-expired/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment history box
    const paymentsTable = result.getByTestId('paymentInfoBox');
    expect(paymentsTable).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
    // check cancellation alert
    const alert = result.queryByTestId('alert');
    expect(alert).not.toBeInTheDocument();
  });

  it('checks not available documents - mono recipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, { ...notificationDTO, documentsAvailable: false });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    // check documents box
    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    expect(notificationDetailDocumentsMessage[0]).toHaveTextContent(
      'detail.download-message-expired'
    );
  });

  it('checks not immediately available aar (otherDocuments) - mono recipient', async () => {
    const notificationAfter150Days = {
      ...notificationDTO,
      sentAt: formatToTimezoneString(new Date(today.getTime() - 12960000000)) /* 150 days ago*/,
    };
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, notificationAfter150Days);

    const otherDocument: NotificationDetailOtherDocument = {
      documentId: notificationAfter150Days.otherDocuments?.[0].documentId ?? '',
      documentType: notificationAfter150Days.otherDocuments?.[0].documentType ?? '',
      digests: { sha256: '' },
      contentType: '',
      ref: {
        key: '',
        versionToken: '',
      },
    };

    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationAfter150Days.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationDetail />
        </>
      );
    });

    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    expect(notificationDetailDocumentsMessage[1]).toHaveTextContent(
      'detail.download-aar-available'
    );

    const documentButton = result.getAllByTestId('documentButton');
    fireEvent.click(documentButton[1]);

    await waitFor(() => {
      const alertMessage = result.getAllByTestId('snackBarContainer')[0];
      expect(alertMessage).toBeInTheDocument();
    });
    // simulate that aar is now available
    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationAfter150Days.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-aar-com',
      });
    fireEvent.click(documentButton[1]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/sent/${notificationAfter150Days.iun}/documents/AAR?documentId=${otherDocument.documentId}`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-aar-com');
    });
  });

  it('checks expired aar (otherDocuments) - mono recipient', async () => {
    const notificationAfter10Years = {
      ...notificationDTO,
      sentAt: formatToTimezoneString(new Date(today.getTime() - 31536000000100)) /* 10 years ago*/,
    };
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, notificationAfter10Years);

    await act(async () => {
      result = render(<NotificationDetail />);
    });

    const notificationDetailDocumentsMessage = result.getAllByTestId('documentsMessage');
    expect(notificationDetailDocumentsMessage[1]).toHaveTextContent('detail.download-aar-expired');

    const documentButton = result.getAllByTestId('documentButton');
    expect(documentButton[1].getAttributeNames()).toContain('disabled');

    fireEvent.click(documentButton[1]);
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
      result = render(<NotificationDetail />);
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

  it('executes the legal fact download handler - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(
        <>
          <AppMessage />
          <NotificationDetail />
        </>
      );
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    const legalFactButton = result.getAllByTestId('download-legalfact');

    fireEvent.click(legalFactButton[0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });
    const docNotAvailableAlert = await waitFor(() => result.getByTestId('snackBarContainer'));
    expect(docNotAvailableAlert).toBeInTheDocument();

    mock
      .onGet(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });
    // simulate that legal fact is now available
    fireEvent.click(legalFactButton[0]);

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/bff/v1/notifications/sent/${notificationDTO.iun}/documents/LEGAL_FACT?documentId=${mockLegalIds.key}`
      );
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://mocked-url-com');
    });
  });

  it('executes the downtimws legal fact download handler - mono recipient', async () => {
    mock.onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock.onGet(`/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`).reply(200, {
      filename: 'mocked-filename',
      contentLength: 1000,
      url: 'https://mocked-url-com',
    });
    await act(async () => {
      result = render(<NotificationDetail />);
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

  it('clicks on the back button - mono recipient', async () => {
    // restore window location
    Object.defineProperty(window, 'location', { configurable: true, value: original });
    // insert two entries into the history, so the initial render will refer to the path /
    // and when the back button is pressed and so navigate(-1) is invoked,
    // the path will change to /mock-path
    const history = createBrowserHistory();
    history.push('/mock-path');
    history.push('/');

    // render with an ad-hoc router
    await act(async () => {
      result = render(
        <Routes>
          <Route path={'/mock-path'} element={<div data-testid="mocked-page">hello</div>} />
          <Route path={'/'} element={<NotificationDetail />} />
        </Routes>
      );
    });

    // before pressing "back" button - mocked page not present
    const mockedPageBefore = result.queryByTestId('mocked-page');
    expect(mockedPageBefore).not.toBeInTheDocument();

    // simulate press of "back" button
    const backButton = result.getByRole('button', { name: /indietro/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // after pressing "back" button - mocked page present
    await waitFor(() => {
      const mockedPageAfter = result.queryByTestId('mocked-page');
      expect(mockedPageAfter).toBeInTheDocument();
    });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: vi.fn() },
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
        </>
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
      result = render(<NotificationDetail />);
    });
    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
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
      result = render(<NotificationDetail />);
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
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTO.iun}`)
      .reply(200, { ...notificationDTO, notificationStatus: NotificationStatus.CANCELLED });
    // we use regexp to not set the query parameters
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
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
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    expect(mock.history.get[1].url).toContain('/bff/v1/downtime/history');
    // the only thing that change from mono to multi recipient is the data shown in the table and the payments number
    // check summary table
    const notificationDetailTable = result.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows[0]).toHaveTextContent(
      `detail.sender${notificationDTOMultiRecipient.senderDenomination}`
    );
    notificationDTOMultiRecipient.recipients.forEach((recipient, index) => {
      expect(tableRows[1]).toHaveTextContent(
        index === 0
          ? `detail.recipients${recipient.denomination} - ${recipient.taxId}`
          : `${recipient.denomination} - ${recipient.taxId}`
      );
    });
    expect(tableRows[2]).toHaveTextContent(
      `detail.date${formatDate(notificationDTOMultiRecipient.sentAt)}`
    );
    expect(tableRows[3]).toHaveTextContent(`detail.iun${notificationDTOMultiRecipient.iun}`);
    expect(tableRows[4]).toHaveTextContent(`detail.groups${notificationDTOMultiRecipient.group}`);
    // check payment history box
    const paymentsTable = result.getByTestId('paymentInfoBox');
    expect(paymentsTable).toBeInTheDocument();
    // check documents box
    let notificationDocumentLength: number;
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    if (notificationDTOMultiRecipient.otherDocuments) {
      notificationDocumentLength = notificationDTOMultiRecipient.documents.length;
      +notificationDTOMultiRecipient.otherDocuments.length;
    } else {
      notificationDocumentLength = notificationDTOMultiRecipient.documents.length;
    }

    expect(notificationDetailDocuments?.length).toBeGreaterThanOrEqual(notificationDocumentLength);
    // check timeline box
    const NotificationDetailTimeline = result.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
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
      result = render(<NotificationDetail />);
    });
    const paymentsTable = result.queryByTestId('paymentInfoBox');
    expect(paymentsTable).not.toBeInTheDocument();
  });

  it('render success alert when documents have been picked up - monorecipient', async () => {
    mock
      .onGet(`/bff/v1/notifications/sent/${raddNotificationDTO.iun}`)
      .reply(200, raddNotificationDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
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
      result = render(<NotificationDetail />);
    });

    const alertRadd = result.getByTestId('raddAlert');
    expect(alertRadd).toBeInTheDocument();
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.title');
    expect(alertRadd).toHaveTextContent('detail.timeline.radd.description-multi-recipients');
  });
});
