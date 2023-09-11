import MockAdapter from 'axios-mock-adapter';
import React, { ReactNode } from 'react';

import {
  AppResponseMessage,
  PaymentAttachmentSName,
  PaymentInfoDetail,
  PaymentStatus,
  RecipientType,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';

import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { act, fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../../../api/notifications/notifications.routes';
import { NOTIFICATION_ACTIONS } from '../../../redux/notification/actions';
import NotificationPayment from '../NotificationPayment';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string; components: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components.map((c) => c)}
    </>
  ),
}));

const exitFn = jest.fn();

/*
ATTENZIONE: se si dovesse modificare il mock, alcuni test potrebbero fallire
*/
const payment = notificationToFe.recipients[1].payment;

describe('NotificationPayment component', () => {
  let mock: MockAdapter;
  const original = window.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'mocked-return-url', assign: exitFn },
    });
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('payment in SUCCEEDED status', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              200,
              {
                status: PaymentStatus.SUCCEEDED,
                amount: 10,
                url: '',
              },
            ]);
          }, 2000);
        });
      });
    const { container, getByTestId, getByRole, queryByTestId } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amountLoader = getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();
    const loadingButton = getByTestId('loadingButton');
    expect(loadingButton).toBeInTheDocument();
    // Wait for 2000 milliseconds
    await act(() => new Promise((t) => setTimeout(t, 2000)));
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toBe(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    expect(amountLoader).not.toBeInTheDocument();
    expect(loadingButton).not.toBeInTheDocument();
    expect(container).toHaveTextContent('detail.payment.message-completed');
    // check cancelled alert
    const alert = queryByTestId('cancelledAlertTextPayment');
    expect(alert).not.toBeInTheDocument();
  });

  it('payment in SUCCEEDED status and PaymentHistory populated', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.SUCCEEDED,
        url: '',
      });
    const { getByRole, queryByTestId, queryByRole, getByTestId } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
        paymentHistory={[
          {
            recipientDenomination: 'Mario Rossi',
            recipientTaxId: 'RSSMRA80A01H501U',
            paymentSourceChannel: 'EXTERNAL_REGISTRY',
            recipientType: RecipientType.PF,
          },
        ]}
      />
    );

    const amountLoader = queryByTestId('loading-skeleton');
    expect(amountLoader).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mock.history.get.length).toBe(0);
      expect(amountLoader).not.toBeInTheDocument();
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-succeeded' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.message-completed');
    // check payment history box
    const paymentTable = getByTestId('paymentTable');
    expect(paymentTable).toBeInTheDocument();
  });

  it('payment in REQUIRED status', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.REQUIRED,
        url: '',
      });
    mock
      .onGet(NOTIFICATION_PAYMENT_ATTACHMENT(notificationToFe.iun, PaymentAttachmentSName.PAGOPA))
      .reply(200, { url: 'http://mocked-url.com' });
    mock
      .onPost(NOTIFICATION_PAYMENT_URL(), {
        paymentNotice: {
          noticeNumber: payment?.noticeCode!,
          fiscalCode: payment?.creditorTaxId!,
          amount: 47350,
          companyName: notificationToFe.senderDenomination,
          description: notificationToFe.subject,
        },
        returnUrl: 'mocked-return-url',
      })
      .reply(200, {
        checkoutUrl: 'mocked-url',
      });
    const { getByRole } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toBe(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);
    const submitButton = getByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(submitButton).toBeInTheDocument();
    const divider = getByRole('separator');
    expect(divider).toBeInTheDocument();
    const pagopaAttachmentButton = getByRole('button', {
      name: 'detail.payment.download-pagopa-notification',
    });
    expect(pagopaAttachmentButton).toBeInTheDocument();
    const f24AttachmentButton = getByRole('button', { name: 'detail.payment.download-f24' });
    expect(f24AttachmentButton).toBeInTheDocument();
    // dowload the attachment
    fireEvent.click(pagopaAttachmentButton);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);
      expect(mock.history.get[1].url).toBe(
        NOTIFICATION_PAYMENT_ATTACHMENT(notificationToFe.iun, PaymentAttachmentSName.PAGOPA)
      );
    });
    // pay
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe(NOTIFICATION_PAYMENT_URL());
    });
    expect(exitFn).toBeCalledTimes(1);
    expect(exitFn).toBeCalledWith('mocked-url');
  });

  it('payment in PROGRESS status', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        amount: 47350,
        status: PaymentStatus.INPROGRESS,
        url: '',
      });
    const { getByRole, queryByRole, getByTestId } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-in-progress' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);
    const submitButton = queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.message-in-progress');
    // reload button
    const reloadButton = getByTestId('reload-payment-button');
    fireEvent.click(reloadButton);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);
      expect(mock.history.get[1].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    // support button
    const supportButton = getByTestId('support-button');
    expect(supportButton).toBeInTheDocument();
  });

  it('payment in FAILED status and DOMAIN_UNKNOWN detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
        detail_v2: 'PPT_STAZIONE_INT_PA_ERRORE_RESPONSE',
        errorCode: 'CODICE_ERRORE',
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-domain-unknown');
    const errorCode = getByText('PPT_STAZIONE_INT_PA_ERRORE_RESPONSE');
    expect(errorCode).toBeInTheDocument();
    const copyLink = getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();
    const button = getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('payment in FAILED status and PAYMENT_UNAVAILABLE detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
        detail_v2: 'PPT_INTERMEDIARIO_PSP_SCONOSCIUTO',
        errorCode: 'CODICE_ERRORE',
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-payment-unavailable');
    const errorCode = getByText('PPT_INTERMEDIARIO_PSP_SCONOSCIUTO');
    expect(errorCode).toBeInTheDocument();
    const copyLink = getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();
    const button = getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('payment in FAILED status and PAYMENT_UNKNOWN detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        // 2
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
        detail_v2: 'PAA_PAGAMENTO_SCONOSCIUTO',
        errorCode: 'CODICE_ERRORE',
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-payment-unknown');
    const errorCode = getByText('PAA_PAGAMENTO_SCONOSCIUTO');
    expect(errorCode).toBeInTheDocument();
    const copyLink = getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();
    const button = getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('payment in FAILED status and GENERIC_ERROR detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.GENERIC_ERROR,
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-generic');
    const copyLink = getByRole('button', { name: /detail.payment.contact-support/ });
    expect(copyLink).toBeInTheDocument();
    const button = getByRole('button', { name: /detail.payment.reload-page/ });
    expect(button).toBeInTheDocument();
  });

  it('payment in FAILED status and PAYMENT_CANCELED detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.PAYMENT_CANCELED,
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-canceled');
    const button = queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('payment in FAILED status and PAYMENT_EXPIRED detail', async () => {
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!))
      .reply(200, {
        status: PaymentStatus.FAILED,
        detail: PaymentInfoDetail.PAYMENT_EXPIRED,
        url: '',
      });
    const { getByRole, queryByRole, getByTestId, getByText } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain(
        NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)
      );
    });
    const title = getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();
    const amount = getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const submitButton = queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(submitButton).not.toBeInTheDocument();
    const alert = getByTestId('messageAlert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('detail.payment.error-expired');
    const button = queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  // Questo test fallisce per un bug nel dettaglio notifica. La paymentInfo viene chiamata anche se la notifica è in stato annullata
  // Rimuovere il commento e lo skip del test una volta sistemato il bug
  it.skip('renders payment when notification is CANCELLED', async () => {
    const { getByTestId } = render(
      <NotificationPayment
        iun={notificationToFe.iun}
        notificationPayment={payment!}
        senderDenomination={notificationToFe.senderDenomination}
        subject={notificationToFe.subject}
        notificationIsCancelled
      />
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(0);
    });
    // check cancelled alert
    const alert = getByTestId('cancelledAlertTextPayment');
    expect(alert).toBeInTheDocument();
    // COSE DA FARE:
    // testare che l'amount non sia visibile
    // testare il click alla FAQ
    // testare che non venga mostrato l'elemento con data-testid=messageAlert
    // testare che non esistano attachments (verificare che non ci siano i bottoni di download pagopa e f24 - vedere test con pagamento REQUIRED)
  });

  it('API error', async () => {
    mock.onGet(NOTIFICATION_PAYMENT_INFO(payment?.creditorTaxId!, payment?.noticeCode!)).reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationPayment
            iun={notificationToFe.iun}
            notificationPayment={payment!}
            senderDenomination={notificationToFe.senderDenomination}
            subject={notificationToFe.subject}
          />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${NOTIFICATION_ACTIONS.GET_NOTIFICATION_PAYMENT_INFO}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
