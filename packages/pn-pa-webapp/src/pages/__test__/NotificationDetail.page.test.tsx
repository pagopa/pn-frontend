import React from 'react';

import { LegalFactId, NotificationDetailTableRow } from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, mockApi, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
} from '../../api/notifications/notifications.routes';
import {
  notificationFromBe,
  notificationFromBeMultiRecipient,
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../redux/notification/__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'c_b963-220220221119' }),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockLegalIds = {
  key: 'mocked-key',
  category: 'mocked-category',
};

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailTable: ({ rows }: { rows: Array<NotificationDetailTableRow> }) => {
    const amount = rows.find((r) => r.label === 'detail.amount');
    const noticeCodes = rows.find((r) => r.label === 'detail.notice-code');
    return (
      <div>
        <div>{noticeCodes && noticeCodes.value}</div>
        <div>{amount && amount.value}</div>
        Table
      </div>
    );
  },
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
    <div data-testid="legalFactButton" onClick={() => clickHandler(mockLegalIds)}>
      Timeline
    </div>
  ),
}));

describe('NotificationDetail Page (one recipient)', () => {
  let result: RenderResult;

  test('renders NotificationDetail page', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(notificationFromBe.iun),
      200,
      undefined,
      notificationFromBe
    );
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent(/1,30 €/i);
    expect(result.container).toHaveTextContent(
      `${notificationToFe.recipients[0].payment?.creditorTaxId} - ${notificationToFe.recipients[0].payment?.noticeCode}`
    );
    expect(result.container).toHaveTextContent(/Documents/i);
    expect(result.container).toHaveTextContent(/Timeline/i);
    // check payment history box
    const paymentTable = result.getByTestId('paymentTable');
    const paymentRecipient = result.getByTestId('paymentRecipient');
    expect(paymentTable).toBeInTheDocument();
    expect(paymentRecipient).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    mock.reset();
    mock.restore();
  });

  test('executes the document and legal fact download handler', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(notificationFromBe.iun),
      200,
      undefined,
      notificationFromBe
    );
    const mockDocument = mockApi(
      mock,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(notificationToFe.iun, '0'),
      200,
      undefined,
      {
        filename: notificationToFe.documents[0].ref.key,
        contentType: notificationToFe.documents[0].contentType,
        contentLength: 3028,
        sha256: notificationToFe.documents[0].digests.sha256,
        url: 'https://mocked-url.com',
      }
    );
    mockApi(
      mockDocument,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(notificationToFe.iun, mockLegalIds as LegalFactId),
      200,
      undefined,
      {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      }
    );
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    const documentButton = result.getAllByTestId('documentButton');
    const legalFactButton = result.getByTestId('legalFactButton');
    fireEvent.click(documentButton[0]);
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[1].url).toContain(
      `/delivery/notifications/sent/${notificationToFe.iun}/attachments/documents/0`
    );
    fireEvent.click(legalFactButton);
    expect(mock.history.get).toHaveLength(3);
    expect(mock.history.get[2].url).toContain(
      `/delivery-push/${notificationToFe.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
    );
    mock.reset();
    mock.restore();
  });

  test('clicks on the back button', async () => {
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    const backButton = result.getByRole('button', { name: /indietro/i });
    fireEvent.click(backButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  test.skip('clicks on the cancel button and on close modal', async () => {
    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = modal?.querySelector('[data-testid="modalCloseBtnId"]');
    fireEvent.click(closeModalBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  test.skip('clicks on the cancel button and on confirm button', async () => {
    const cancelNotificationBtn = result.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn);
    const modal = await waitFor(() => result.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const modalCloseAndProceedBtn = modal?.querySelector(
      '[data-testid="modalCloseAndProceedBtnId"]'
    );
    fireEvent.click(modalCloseAndProceedBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
    expect(mockNavigateFn).toBeCalledTimes(1);
  });
});

describe('NotificationDetail Page (multi recipient)', () => {
  let result: RenderResult;

  test('renders NotificationDetail page', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(notificationFromBeMultiRecipient.iun),
      200,
      undefined,
      notificationToFeMultiRecipient
    );
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(
      notificationToFeMultiRecipient.subject
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent(/2,00 €/i);
    for (const recipient of notificationToFeMultiRecipient.recipients) {
      expect(result.container).toHaveTextContent(
        `${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
      );
    }
    expect(result.container).toHaveTextContent(/Documents/i);
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    mock.reset();
    mock.restore();
  });
});
