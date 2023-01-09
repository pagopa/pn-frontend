import React from 'react';
import {
  apiOutcomeTestHelper,
  AppResponseMessage,
  NotificationDetailPayment,
  ResponseEventDispatcher,
  PaymentStatus,
  PaymentInfoDetail,
} from '@pagopa-pn/pn-commons';
import { act, waitFor } from '@testing-library/react';

import { render, screen } from '../../../__test__/test-utils';
import * as actions from '../../../redux/notification/actions';
import * as hooks from '../../../redux/hooks';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import NotificationPayment from '../NotificationPayment';
import { doMockUseDispatch } from './NotificationPayment.test-utils';

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
  },
  inprogress: {
    amount: 47350,
    status: PaymentStatus.INPROGRESS,
  },
  succeeded: {
    status: PaymentStatus.SUCCEEDED,
  },
  failed: [
    {
      // 0
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
      detail_v2: 'PPT_STAZIONE_INT_PA_ERRORE_RESPONSE',
      errorCode: 'CODICE_ERRORE',
    },
    {
      // 1
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
      detail_v2: 'PPT_INTERMEDIARIO_PSP_SCONOSCIUTO',
      errorCode: 'CODICE_ERRORE',
    },
    {
      // 2
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
      detail_v2: 'PAA_PAGAMENTO_SCONOSCIUTO',
      errorCode: 'CODICE_ERRORE',
    },
    {
      // 3
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    },
    {
      // 4
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_CANCELED,
    },
    {
      // 5
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
    },
  ],
};

describe('NotificationPayment component', () => {
  /* eslint-disable functional/no-let */
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  /* eslint-enable functional/no-let */
  const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');

  function prepareMockForPaymentInfo(paymentInfo: any) {
    // The component makes three queries into the Redux store, the first one to get the payment info, 
    // the latter two to get the eventual urls to launch the download.
    // Only the first query should produce a value.
    mockUseAppSelector.mockReturnValueOnce(paymentInfo);
    mockUseAppSelector.mockReturnValue(undefined);
  }

  beforeEach(() => {
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'getNotificationPaymentInfo');
    actionSpy.mockImplementation(mockActionFn as any);

    // mock dispatch
    mockDispatchFn = doMockUseDispatch();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders properly while loading payment info', async () => {
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

    const loadingButton = screen.getByRole('button', { name: 'detail.payment.submit' });
    expect(loadingButton.querySelector('svg')).toBeInTheDocument();
    expect(loadingButton).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });
  });

  it('renders properly if getPaymentInfo returns a "required" status', async () => {
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.required);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.inprogress);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent(/473,50\b/);

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('InfoOutlinedIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByText('detail.payment.message-in-progress');
    expect(alertMessage).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "succeeded" status', async () => {
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.succeeded);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-succeeded' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('SuccessOutlinedIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.message-completed');
  });

  it('renders properly if getPaymentInfo returns a "failed" status and "domain_unknown" detail', async () => {
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[0]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[1]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[2]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[3]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[4]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
    render(
      <NotificationPayment
        iun="mocked-iun"
        notificationPayment={mockedNotificationDetailPayment}
        senderDenomination="mocked-senderDenomination"
        subject="mocked-subject"
      />
    );
    prepareMockForPaymentInfo(mocked_payments_detail.failed[5]);

    const amountLoader = screen.getByTestId('loading-skeleton');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer_loading = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer_loading).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        noticeCode: 'mocked-noticeCode',
        taxId: 'mocked-creditorTaxId',
      });
      expect(amountLoader).not.toBeInTheDocument();
    });

    const title = screen.getByRole('heading', { name: 'detail.payment.summary-pending' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: 'detail.payment.amount' });
    expect(amount).toBeInTheDocument();
    expect(amount).toHaveTextContent('');

    const disclaimer = screen.queryByText('detail.payment.disclaimer');
    expect(disclaimer).not.toBeInTheDocument();

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
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
  });

  it('API error', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentInfo');
    apiSpy.mockRejectedValue({ response: { status: 500 } });
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
    const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentInfo');
    apiSpy.mockResolvedValue({ status: PaymentStatus.SUCCEEDED, url: 'https://react.org' });
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
