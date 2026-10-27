import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppMessage, AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { errorMock } from '../../__mocks__/Errors.mock';
import { INFORMAL_NOTIFICATION_DETAIL_MOCK } from '../../__mocks__/InformalNotificationDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import InformalNotificationDetail from '../InformalNotificationDetail.page';

const campaignId = 'campaign-id';
const iun = INFORMAL_NOTIFICATION_DETAIL_MOCK.iun;
const recipient = INFORMAL_NOTIFICATION_DETAIL_MOCK.recipients[0];
const primaryMessage = recipient.message!.primaryMessage!;
const document = INFORMAL_NOTIFICATION_DETAIL_MOCK.documents![0];
const detailUrl = `/bff/v1/notifications/informal/sent/${iun}`;
const documentUrl = `${detailUrl}/attachments/documents/${document.docIdx}`;

const renderPage = () =>
  render(
    <>
      <ResponseEventDispatcher />
      <AppResponseMessage />
      <AppMessage />
      <InformalNotificationDetail />
    </>,
    {
      route: routes.GET_DETTAGLIO_COMBO_PATH(campaignId, iun),
      path: routes.DETTAGLIO_COMBO,
    }
  );

describe('InformalNotificationDetail Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
    globalThis.location.href = '';
  });

  afterAll(() => {
    mock.restore();
    vi.unstubAllGlobals();
  });

  it('renders InformalNotificationDetail page', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);

    await act(async () => {
      result = renderPage();
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(detailUrl);

    // check breadcrumb
    expect(result.getByTestId('breadcrumb-root-button')).toHaveTextContent(
      'detail.breadcrumb-root'
    );
    expect(result.getByText(campaignId)).toBeInTheDocument();
    expect(result.getByRole('heading', { level: 1 })).toHaveTextContent(iun);

    // check summary card
    const senderDetail = result.getByText('informal.detail.sender').parentElement;
    expect(senderDetail).toHaveTextContent(INFORMAL_NOTIFICATION_DETAIL_MOCK.senderDenomination);

    const recipientDetail = result.getByText('informal.detail.recipient').parentElement;
    expect(recipientDetail).toHaveTextContent(`${recipient.denomination} (${recipient.taxId})`);

    const subjectDetail = result.getByText('informal.detail.subject').parentElement;
    expect(subjectDetail).toHaveTextContent(primaryMessage.subject!);

    // check attached documents
    const notificationDetailDocuments = result.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(1);
    expect(notificationDetailDocuments[0]).toHaveTextContent(document.title || document.ref.key);
    expect(notificationDetailDocuments[0]).toHaveTextContent(
      'informal.detail.documents.download-message-available'
    );

    // check payment box
    expect(result.getByTestId('paymentInfoBox')).toBeInTheDocument();

    // check status box
    const statusBox = result.getByTestId('NotificationDetailTimeline');
    expect(statusBox).toHaveTextContent('detail.communications.statuses.success');
    expect(statusBox).toHaveTextContent('informal.status.completed.description');

    // check channels status box
    const channelsStatusBox = result.getByText(
      'informal.detail.send-by-channel.title'
    ).parentElement;
    expect(within(channelsStatusBox!).getAllByRole('listitem')).toHaveLength(
      INFORMAL_NOTIFICATION_DETAIL_MOCK.channelsStatus!.length
    );
  });

  it('opens and closes the details drawer', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByRole('button', { name: 'informal.detail.aria-label' }));

    const notificationDetailsDrawer = result.getByTestId('notificationDetailsDrawer');
    expect(notificationDetailsDrawer).toBeInTheDocument();
    expect(notificationDetailsDrawer).toHaveTextContent('informal.detail.title');

    const iunDetail =
      within(notificationDetailsDrawer).getByText('informal.detail.iun').parentElement;
    expect(iunDetail).toHaveTextContent(iun);

    const textDetail =
      within(notificationDetailsDrawer).getByText('informal.detail.text').parentElement;
    expect(textDetail).toHaveTextContent(primaryMessage.longBody!.trim());

    fireEvent.click(result.getByTestId('notificationDetailsDrawerClose'));

    await waitFor(() => {
      expect(result.queryByTestId('notificationDetailsDrawer')).not.toBeInTheDocument();
    });
  });

  it('renders recipients label when there are multiple recipients', async () => {
    mock.onGet(detailUrl).reply(200, {
      ...INFORMAL_NOTIFICATION_DETAIL_MOCK,
      recipients: [
        recipient,
        { ...recipient, taxId: 'RSSMRA80A01H501U', denomination: 'Mario Rossi', payments: [] },
      ],
    });

    await act(async () => {
      result = renderPage();
    });

    const recipientsDetail = result.getByText('informal.detail.recipients').parentElement;
    expect(within(recipientsDetail!).getAllByTestId('recipients')).toHaveLength(2);
    expect(result.queryByText('informal.detail.recipient')).not.toBeInTheDocument();
  });

  it('checks not available documents', async () => {
    mock.onGet(detailUrl).reply(200, {
      ...INFORMAL_NOTIFICATION_DETAIL_MOCK,
      documentsAvailable: false,
    });

    await act(async () => {
      result = renderPage();
    });

    expect(result.getByTestId('documentsDisabled')).toHaveTextContent(
      'informal.detail.documents.download-message-expired'
    );
    expect(result.queryByTestId('documentButton')).not.toBeInTheDocument();
  });

  it('does not render documents box when the communication has no documents', async () => {
    const { documentsAvailable, documents, ...notificationWithoutDocuments } =
      INFORMAL_NOTIFICATION_DETAIL_MOCK;
    mock.onGet(detailUrl).reply(200, notificationWithoutDocuments);

    await act(async () => {
      result = renderPage();
    });

    expect(result.queryByText('informal.detail.documents.title')).not.toBeInTheDocument();
    expect(result.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
  });

  it('does not render payment and channels boxes when there are no payments and no channels', async () => {
    mock.onGet(detailUrl).reply(200, {
      ...INFORMAL_NOTIFICATION_DETAIL_MOCK,
      recipients: [{ ...recipient, payments: [] }],
      channelsStatus: [],
    });

    await act(async () => {
      result = renderPage();
    });

    expect(result.queryByTestId('paymentInfoBox')).not.toBeInTheDocument();
    expect(result.queryByText('informal.detail.send-by-channel.title')).not.toBeInTheDocument();
  });

  it('renders unknown status when the status is not mapped', async () => {
    mock.onGet(detailUrl).reply(200, {
      ...INFORMAL_NOTIFICATION_DETAIL_MOCK,
      notificationStatus: 'IN_VALIDATION',
    });

    await act(async () => {
      result = renderPage();
    });

    const statusBox = result.getByTestId('NotificationDetailTimeline');
    expect(statusBox).toHaveTextContent('informal.status.unknown.label');
    expect(statusBox).toHaveTextContent('informal.status.unknown.description');
  });

  it('executes the document download handler', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);
    mock.onGet(documentUrl).reply(200, {
      filename: document.ref.key,
      contentType: document.contentType,
      contentLength: 3028,
      sha256: document.digests.sha256,
      url: 'https://mocked-url.com',
    });

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByTestId('documentButton'));

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(documentUrl);
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-url.com');
    });
  });

  it('shows info message when the document is not available yet', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);
    mock.onGet(documentUrl).reply(200, { retryAfter: 1000 });

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByTestId('documentButton'));

    expect(
      await result.findByText('informal.detail.documents.document-not-available')
    ).toBeInTheDocument();
    expect(globalThis.location.href).toBe('');
  });

  it('executes the pagoPA notice download handler', async () => {
    const paymentUrl = `${detailUrl}/attachments/payment/0/PAGOPA?attachmentIdx=0`;
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);
    mock.onGet(paymentUrl).reply(200, { url: 'https://mocked-pagopa-url.com' });

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByTestId('download-pagoPA-notice-button'));

    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toBe(paymentUrl);
    });
    await waitFor(() => {
      expect(globalThis.location.href).toBe('https://mocked-pagopa-url.com');
    });
  });

  it('errors on api call', async () => {
    mock.onGet(detailUrl).reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = renderPage();
    });

    expect(
      result.getByTestId(`api-error-${NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION}`)
    ).toBeInTheDocument();
    expect(result.getByTestId('breadcrumb-root-button')).toBeInTheDocument();
    expect(result.queryByTestId('notificationDetailDocuments')).not.toBeInTheDocument();
  });

  it('navigates to the campaigns list when clicking the root breadcrumb', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByTestId('breadcrumb-root-button'));

    expect(result.router.state.location.pathname).toBe(routes.CAMPAIGNS);
  });

  it('navigates to the campaign detail when clicking the campaign breadcrumb', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByText(campaignId));

    expect(result.router.state.location.pathname).toBe(routes.GET_CAMPAIGN_DETAIL_PATH(campaignId));
  });

  it('navigates to the communication timeline from the status box', async () => {
    mock.onGet(detailUrl).reply(200, INFORMAL_NOTIFICATION_DETAIL_MOCK);

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByRole('button', { name: 'informal.detail.status.aria-label' }));

    expect(result.router.state.location.pathname).toBe(
      routes.GET_DETTAGLIO_COMBO_TIMELINE_PATH(campaignId, iun)
    );
  });
});
