/* eslint-disable functional/no-let */
import { NotificationDetailPayment } from "@pagopa-pn/pn-commons";
import { waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { PaymentStatus } from "@pagopa-pn/pn-commons/src/types/NotificationDetail";
import { render, screen } from "../../../__test__/test-utils";
import * as actions from '../../../redux/notification/actions';
import * as hooks from '../../../redux/hooks';
import NotificationPayment from "../NotificationPayment";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
    Trans: () => "mocked verify description",
}));

const mockedNotificationDetailPayment = {
  iuv: "mocked-iuv",
  notificationFeePolicy: 'FLAT_RATE',
  f24: {
    flatRate: {
      digests: {
        sha256: ""
      },
      contentType: 'application/pdf',
      title: "mocked-pagopa"
    },
    digital: {
      digests: {
        sha256: ""
      },
      contentType: 'application/pdf',
      title: "mocked-f24"
    },
    analog: {
      digests: {
        sha256: ""
      },
      contentType: 'application/pdf',
      title: "pagopa"
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

  it('renders properly before receiving payment info', () => {
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
  });

  it('renders properly ', async () => {
    render(<NotificationPayment notificationPayment={mockedNotificationDetailPayment} onDocumentDownload={mockActionFn}/>);
    mockUseAppSelector.mockReturnValue(mocked_payments_detail.required);

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith('mocked-iuv');
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
  });
});