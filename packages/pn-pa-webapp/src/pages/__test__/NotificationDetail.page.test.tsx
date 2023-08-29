import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import {
  DOWNTIME_LEGAL_FACT_DETAILS,
  LegalFactId,
  NotificationDetail as NotificationDetailModel,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import {
  notificationDTO,
  notificationDTOMultiRecipient,
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
} from '../../api/notifications/notifications.routes';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = jest.fn();

const initialEntries = ['/dashboard/RTRD-UDGU-QTQY-202308-P-/dettaglio'];
// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'RTRD-UDGU-QTQY-202308-P-1' }),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) =>
      t.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0] as LegalFactId;
};

describe('NotificationDetail Page (one recipient)', () => {
  const mockLegalIds = getLegalFactIds(notificationToFe, 0);

  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NotificationDetail page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);

    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table and payment amount
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    expect(result?.container).toHaveTextContent(
      `${notificationToFe.recipients[0].payment?.creditorTaxId} - ${notificationToFe.recipients[0].payment?.noticeCode}`
    );
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(2);
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment history box
    const paymentTable = result?.getByTestId('paymentTable');
    expect(paymentTable).toBeInTheDocument();
    expect(paymentTable).toHaveTextContent(/2,00 €/i);
    const paymentRecipient = result?.getByTestId('paymentRecipient');
    expect(paymentRecipient).toBeInTheDocument();

    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
  });

  it('executes the document and legal fact download handler', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock.onGet(DOWNTIME_LEGAL_FACT_DETAILS(mockLegalIds.key)).reply(200, {
      result: [],
      nextPage: null,
    });
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(notificationToFe.iun, '0')).reply(200, {
      filename: notificationToFe.documents[0].ref.key,
      contentType: notificationToFe.documents[0].contentType,
      contentLength: 3028,
      sha256: notificationToFe.documents[0].digests.sha256,
      url: 'https://mocked-url.com',
    });
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(notificationToFe.iun, mockLegalIds as LegalFactId))
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    const documentButton = result?.getAllByTestId('documentButton');
    const legalFactButton = result?.getAllByTestId('download-legalfact');
    await waitFor(() => fireEvent.click(documentButton![0]));
    await waitFor(() => fireEvent.click(legalFactButton![0]));
    expect(mock.history.get).toHaveLength(4);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    expect(mock.history.get[2].url).toContain(
      `/delivery/notifications/sent/${notificationToFe.iun}/attachments/documents/0`
    );
    expect(mock.history.get[3].url).toContain(
      `/delivery-push/${notificationToFe.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
    );
  });

  it('clicks on the back button', async () => {
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    const backButton = result?.getByRole('button', { name: /indietro/i });
    fireEvent.click(backButton!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  test.skip('clicks on the cancel button and on close modal', async () => {
    const cancelNotificationBtn = result?.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn!);
    const modal = await waitFor(() => result?.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = modal?.querySelector('[data-testid="modalCloseBtnId"]');
    fireEvent.click(closeModalBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  test.skip('clicks on the cancel button and on confirm button', async () => {
    const cancelNotificationBtn = result?.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn!);
    const modal = await waitFor(() => result?.queryByTestId('modalId'));
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
  const mockLegalIds = getLegalFactIds(notificationToFeMultiRecipient, 1);

  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NotificationDetail page', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTOMultiRecipient.iun))
      .reply(200, notificationToFeMultiRecipient);

    await act(async () => {
      result = render(<NotificationDetail />);
    });

    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(
      notificationToFeMultiRecipient.subject
    );
    expect(result?.container).toHaveTextContent(notificationToFe.abstract!);
    // check summary table and payment amounts
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const paymentTables = result?.getAllByTestId('paymentTable');
    expect(paymentTables).toHaveLength(2);
    for (const paymentTable of paymentTables!) {
      expect(paymentTable).toBeInTheDocument();
      expect(paymentTable).toHaveTextContent(/2,00 €/i);
    }
    for (const recipient of notificationToFeMultiRecipient.recipients) {
      expect(result?.container).toHaveTextContent(
        `${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
      );
    }
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(3);
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
  });

  it('executes the document and legal fact download handler', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTOMultiRecipient.iun))
      .reply(200, notificationToFeMultiRecipient);
    mock.onGet(DOWNTIME_LEGAL_FACT_DETAILS(mockLegalIds.key)).reply(200, {
      result: [],
      nextPage: null,
    });
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(notificationToFeMultiRecipient.iun, '0')).reply(200, {
      filename: notificationToFeMultiRecipient.documents[0].ref.key,
      contentType: notificationToFeMultiRecipient.documents[0].contentType,
      contentLength: 3028,
      sha256: notificationToFeMultiRecipient.documents[0].digests.sha256,
      url: 'https://mocked-url.com',
    });
    mock
      .onGet(
        NOTIFICATION_DETAIL_LEGALFACT(
          notificationToFeMultiRecipient.iun,
          mockLegalIds as LegalFactId
        )
      )
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });
    await act(async () => {
      result = render(<NotificationDetail />);
    });

    const documentButton = result?.getAllByTestId('documentButton');
    const legalFactButton = result?.getAllByTestId('download-legalfact');
    await waitFor(() => fireEvent.click(documentButton![0]));
    await waitFor(() => fireEvent.click(legalFactButton![0]));
    expect(mock.history.get).toHaveLength(4);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    expect(mock.history.get[2].url).toContain(
      `/delivery/notifications/sent/${notificationToFe.iun}/attachments/documents/0`
    );
    expect(mock.history.get[3].url).toContain(
      `/delivery-push/${notificationToFe.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
    );
  });
});
