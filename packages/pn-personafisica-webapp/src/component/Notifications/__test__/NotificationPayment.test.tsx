import {
  AppResponseMessage,
  NotificationDetailPayment,
  PaymentInfo,
  PaymentInfoDetail,
  PaymentStatus,
  RecipientType,
  ResponseEventDispatcher,
  apiOutcomeTestHelper,
} from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { act, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { NOTIFICATION_PAYMENT_INFO } from '../../../api/notifications/notifications.routes';
import NotificationPayment from '../NotificationPayment';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked-text',
}));

/**
 * Vedi commenti nella definizione di simpleMockForApiErrorWrapper
 */
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
  };
});

const mockedNotificationDetailPayment = {
  notificationFeePolicy: 'FLAT_RATE',
  noticeCode: 'mocked-noticeCode',
  creditorTaxId: 'mocked-creditorTaxId',
  pagoPaForm: {
    digests: {
      sha256: 'mocked-pagopa-sha256',
    },
    contentType: 'application/pdf',
    ref: {
      key: 'mocked-pagopa-key',
      versionToken: 'mockedVersionToken',
    },
  },
  f24flatRate: {
    digests: {
      sha256: 'mocked-f24-sha256',
    },
    contentType: 'application/pdf',
    ref: {
      key: 'mocked-f24-key',
      versionToken: 'mockedVersionToken',
    },
  },
} as NotificationDetailPayment;

const mocked_payments_detail = {
  required: {
    amount: 47350,
    status: PaymentStatus.REQUIRED,
    url: '',
  },
  inprogress: {
    amount: 47350,
    status: PaymentStatus.INPROGRESS,
    url: '',
  },
  succeeded: {
    status: PaymentStatus.SUCCEEDED,
    url: '',
  },
  failed: [
    {
      // 0
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
      detail_v2: 'PPT_STAZIONE_INT_PA_ERRORE_RESPONSE',
      errorCode: 'CODICE_ERRORE',
      url: '',
    },
    {
      // 1
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
      detail_v2: 'PPT_INTERMEDIARIO_PSP_SCONOSCIUTO',
      errorCode: 'CODICE_ERRORE',
      url: '',
    },
    {
      // 2
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
      detail_v2: 'PAA_PAGAMENTO_SCONOSCIUTO',
      errorCode: 'CODICE_ERRORE',
      url: '',
    },
    {
      // 3
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
      url: '',
    },
    {
      // 4
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_CANCELED,
      url: '',
    },
    {
      // 5
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
      url: '',
    },
  ],
};

describe('NotificationPayment component', () => {
  let mock: MockAdapter;
  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    mock.resetHistory();
  });

  afterAll(() => {
    mock.restore();
  });

  function mockPaymentApi(responseBody: PaymentInfo) {
    mock
      .onGet(
        NOTIFICATION_PAYMENT_INFO(
          mockedNotificationDetailPayment.creditorTaxId,
          mockedNotificationDetailPayment.noticeCode!
        )
      )
      .reply(200, responseBody);
  }

  it('renders properly while loading payment info', async () => {
    mockPaymentApi({
      status: PaymentStatus.SUCCEEDED,
      amount: 10,
      url: '',
    });
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );
    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const loadingButton = screen.getByRole('button', { name: 'detail.payment.submit' });
    expect(loadingButton.querySelector('svg')).toBeInTheDocument();
    expect(loadingButton).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });
  });

  it('renders properly if getPaymentInfo returns a "required" status', async () => {
    mockPaymentApi(mocked_payments_detail.required);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);

    const loadingButton = screen.getByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton.querySelector('svg')).not.toBeInTheDocument();

    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();

    const pagopaAttachmentButton = screen.getByRole('button', {
      name: 'detail.payment.download-pagopa-notification',
    });
    expect(pagopaAttachmentButton).toBeInTheDocument();

    const f24AttachmentButton = screen.getByRole('button', { name: 'detail.payment.download-f24' });
    expect(f24AttachmentButton).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "in progress" status', async () => {
    mockPaymentApi(mocked_payments_detail.inprogress);
    const result = render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-in-progress' });
    expect(title).toBeInTheDocument();
    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);
    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();
    const alert = screen.getByTestId('InfoOutlinedIcon');
    expect(alert).toBeInTheDocument();
    expect(result.container).toHaveTextContent('detail.payment.summary-in-progress');
  });

  it('renders properly if getPaymentInfo returns a "succeeded" status', async () => {
    mockPaymentApi(mocked_payments_detail.succeeded);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
        paymentHistory={[
          {
            recipientDenomination: 'Mario Rossi',
            recipientTaxId: 'RSSMRA80A01H501U',
            paymentSourceChannel: 'EXTERNAL_REGISTRY',
            recipientType: RecipientType.PF,
          },
        ]}
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.queryByTestId('loading-skeleton');
    expect(amountLoader).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(0);
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-succeeded' });
    expect(title).toBeInTheDocument();
    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');
    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();
    const alert = screen.getByTestId('SuccessOutlinedIcon');
    expect(alert).toBeInTheDocument();
    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.message-completed');
    // check payment history box
    const paymentTable = screen.getByTestId('paymentTable');
    expect(paymentTable).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "domain_unknown" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[0]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-domain-unknown');

    const errorCode = screen.getByText('PPT_STAZIONE_INT_PA_ERRORE_RESPONSE');
    expect(errorCode).toBeInTheDocument();

    const copyLink = screen.getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "payment_unavailable" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[1]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-payment-unavailable');

    const errorCode = screen.getByText('PPT_INTERMEDIARIO_PSP_SCONOSCIUTO');
    expect(errorCode).toBeInTheDocument();

    const copyLink = screen.getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "payment_unknown" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[2]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-payment-unknown');

    const errorCode = screen.getByText('PAA_PAGAMENTO_SCONOSCIUTO');
    expect(errorCode).toBeInTheDocument();

    const copyLink = screen.getByRole('button', { name: /detail.payment.copy-to-clipboard/ });
    expect(copyLink).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /detail.payment.contact-support/ });
    expect(button).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "generic_error" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[3]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-generic');

    const copyLink = screen.getByRole('button', { name: /detail.payment.contact-support/ });
    expect(copyLink).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /detail.payment.reload-page/ });
    expect(button).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "payment_canceled" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[4]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-canceled');

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "payment_expired" detail', async () => {
    mockPaymentApi(mocked_payments_detail.failed[5]);
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />,
      { preloadedState: { notificationState: { paymentInfo: {} } } }
    );

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toContain('mocked-creditorTaxId/mocked-noticeCode');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.error-expired');

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });
});

describe('NotificationPayment - different payment fetch API behaviors', () => {
  let mock: MockAdapter;
  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    mock.reset();
    apiOutcomeTestHelper.clearMock();
  });

  afterAll(() => {
    mock.restore();
  });

  it('API error', async () => {
    const taxId = 'mocked-creditorTaxId';
    const noticeCode = 'mocked-noticeCode';
    mock
      .onGet(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode))
      .reply(500, { response: { status: 500 } });
    // const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentInfo');
    // apiSpy.mockRejectedValue({ response: { status: 500 } });
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <NotificationPayment
              iun="mocked-iun"
              notificationPayment={mockedNotificationDetailPayment}
              senderDenomination="mocked-senderDenomination"
              subject="mocked-subject"
            />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    const taxId = 'mocked-creditorTaxId';
    const noticeCode = 'mocked-noticeCode';
    mock.onGet(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode)).reply(200, {
      status: PaymentStatus.SUCCEEDED,
      url: 'https://react.org',
    });
    // const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentInfo');
    // apiSpy.mockResolvedValue({ status: PaymentStatus.SUCCEEDED, url: 'https://react.org' });
    await act(
      async () =>
        void render(
          <>
            <ResponseEventDispatcher />
            <AppResponseMessage />
            <NotificationPayment
              iun="mocked-iun"
              notificationPayment={mockedNotificationDetailPayment}
              senderDenomination="mocked-senderDenomination"
              subject="mocked-subject"
            />
          </>
        )
    );
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
