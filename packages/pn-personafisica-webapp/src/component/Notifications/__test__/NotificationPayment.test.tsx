/* eslint-disable functional/no-let */
import { NotificationDetailPayment } from "@pagopa-pn/pn-commons";
import { waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PaymentStatus } from "@pagopa-pn/pn-commons/src/types/NotificationDetail";
import { axe, render, screen } from "../../../__test__/test-utils";
import * as actions from '../../../redux/notification/actions';
import * as hooks from '../../../redux/hooks';
import NotificationPayment from "../NotificationPayment";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
    Trans: () => "mocked-text",
}));

const mockedNotificationDetailPayment = {
  notificationFeePolicy: 'FLAT_RATE',
  noticeCode: 'mocked-noticeCode',
  creditorTaxId: "mocked-creditorTaxId",
  pagoPaForm: {
    "digests": {
      "sha256": "mocked-sha256"
    },
    "contentType": "application/pdf",
    "ref": {
      "key": "mocked-key",
      "versionToken": "mockedVersionToken"
    }
  }
} as NotificationDetailPayment;

const mocked_payments_detail = {
  required: {
    amount: 47350,
    status: PaymentStatus.REQUIRED
  },
  inprogress: {
    amount: 47350,
    status: PaymentStatus.INPROGRESS
  },
  succeeded: {
    status: PaymentStatus.SUCCEEDED
  },
  failed: {
    amount: 47350,
    status: PaymentStatus.FAILED,
  }
};

describe('NotificationPayment component', () => {
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
  
  beforeEach(() => {
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'getNotificationPaymentInfo');
    actionSpy.mockImplementation(mockActionFn as any);
    
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));

    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders properly while loading payment info', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    const title = screen.getByRole('heading', { name: 'detail.payment.summary'});
    expect(title).toBeInTheDocument();

    const amountLoader = screen.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.getByRole('button', { name: 'detail.payment.submit'});
    expect(loadingButton.querySelector('svg')).toBeInTheDocument();
    expect(loadingButton).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });
  });

  it('renders properly if getPaymentInfo returns a "required" status', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.required);

    const amountLoader = screen.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });
    
    const title = screen.getByRole('heading', { name: 'detail.payment.summary' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: /473,50\b/ });
    expect(amount).toBeInTheDocument();

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.getByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton.querySelector('svg')).not.toBeInTheDocument();

    const divider = screen.getByRole("separator");
    expect(divider).toBeInTheDocument();

    const pagopaAttachmentButton = screen.getByRole("button", { name: 'detail.payment.download-pagopa-notification' });
    expect(pagopaAttachmentButton).toBeInTheDocument();

    const f24AttachmentButton = screen.getByRole("button", { name: 'detail.payment.download-f24' });
    expect(f24AttachmentButton).toBeInTheDocument();
  });

  it('renders properly if getPaymentInfo returns a "in progress" status', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.inprogress);

    const amountLoader = screen.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });
    
    const title = screen.getByRole('heading', { name: 'detail.payment.summary' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: /473,50\b/ });
    expect(amount).toBeInTheDocument();

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('SuccessOutlinedIcon');
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('mocked-text');
  });

  it('renders properly if getPaymentInfo returns a "succeeded" status', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.succeeded);

    const amountLoader = screen.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });
    
    const title = screen.getByRole('heading', { name: 'detail.payment.summary' });
    expect(title).toBeInTheDocument();

    // const amount = screen.getByRole('heading', { name: /473,50\b/ });
    // expect(amount).toBeInTheDocument();

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).not.toBeInTheDocument();

    const alert = screen.getByTestId('SuccessOutlinedIcon');// getByRole('alert', { name: 'mocked-description'});
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.message-completed');
  });

  it('renders properly if getPaymentInfo returns a "failed" status', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.failed);

    const amountLoader = screen.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });
    
    const title = screen.getByRole('heading', { name: 'detail.payment.summary' });
    expect(title).toBeInTheDocument();

    const amount = screen.getByRole('heading', { name: /473,50\b/ });
    expect(amount).toBeInTheDocument();

    const disclaimer = screen.getByText('detail.payment.disclaimer');
    expect(disclaimer).toBeInTheDocument();

    const loadingButton = screen.queryByRole('button', { name: /detail.payment.submit 473,50\b/ });
    expect(loadingButton).toBeInTheDocument();

    const alert = screen.getByTestId('ErrorOutlineIcon');// getByRole('alert', { name: 'mocked-description'});
    expect(alert).toBeInTheDocument();

    const alertMessage = screen.getByRole('alert').querySelector('p');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('detail.payment.message-failed');
  });

  it('does not have basic accessibility issues (required status)', async () => {
    const result = render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.required);

    const amountLoader = result.getByRole('heading', { name: ''}).querySelector('svg');
    expect(amountLoader).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
      expect(amountLoader).not.toBeInTheDocument();
    });

    const amount = result.getByRole('heading', { name: /473,50\b/ });
    expect(amount).toBeInTheDocument();

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});