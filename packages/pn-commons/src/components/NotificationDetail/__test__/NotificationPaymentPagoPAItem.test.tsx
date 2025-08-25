import { vi } from 'vitest';

import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import {
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
} from '../../../models';
import { fireEvent, getById, queryById, render, waitFor } from '../../../test-utils';
import { formatEurocentToCurrency, populatePaymentsPagoPaF24 } from '../../../utility';
import NotificationPaymentPagoPAItem from '../NotificationPaymentPagoPAItem';

describe('NotificationPaymentPagoPAItem Component', () => {
  const pagoPAItems: PaymentDetails[] = populatePaymentsPagoPaF24(
    notificationDTO.timeline,
    notificationDTO.recipients[0].payments as PaymentDetails[],
    paymentInfo
  );

  const pagoPAItem = pagoPAItems.find((item) => item.pagoPa)?.pagoPa as PagoPAPaymentFullDetails;

  it('renders component - should show radio button when status is REQUIRED', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.REQUIRED,
      applyCost: false,
      amount: undefined,
    };
    const { container, getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const box = getById(container, `paymentPagoPa-${pagoPAItem.noticeCode}`);
    expect(box).toBeInTheDocument();
    // radio
    const radioButton = getByTestId('radio-button');
    expect(radioButton).toBeInTheDocument();
    // no caption
    const caption = queryByTestId('apply-costs-caption');
    expect(caption).not.toBeInTheDocument();
    // no chip
    const chip = queryByTestId(/statusChip-detail\.payment\.status\.\w+/);
    expect(chip).not.toBeInTheDocument();
    // no amount
    const amountContainer = queryByTestId('payment-amount');
    expect(amountContainer).not.toBeInTheDocument();
    // no skeleton
    const skeleton = queryByTestId('skeleton-card');
    expect(skeleton).not.toBeInTheDocument();
  });

  it('renders component - should show badge when status is SUCCEEDED and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.SUCCEEDED };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const chip = getByTestId('statusChip-detail.payment.status.succeeded');
    const radio = queryByTestId('radio-button');
    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders component - should show badge when status is FAILED (expired) and not show radio', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_EXPIRED,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const chip = getByTestId('statusChip-detail.payment.status.failed');
    const radio = queryByTestId('radio-button');
    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders component - should show badge when status is INPROGRESS and not show radio', () => {
    const item = { ...pagoPAItem, status: PaymentStatus.INPROGRESS };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const chip = getByTestId('statusChip-detail.payment.status.inprogress');
    const radio = queryByTestId('radio-button');
    expect(radio).not.toBeInTheDocument();
    expect(chip).toBeInTheDocument();
  });

  it('renders component - should show amount if present', () => {
    const amount = 1000;
    const item = { ...pagoPAItem, amount };
    const { getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const amountContainer = getByTestId('payment-amount');
    expect(amountContainer).toHaveTextContent(
      formatEurocentToCurrency(amount).replace(/\u00a0/g, ' ')
    );
  });

  it('renders component - should show label if costs are included', () => {
    const amount = 1000;
    const item = { ...pagoPAItem, amount, applyCost: true };
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    expect(container).toHaveTextContent('included-costs');
    const amountContainer = getByTestId('payment-amount');
    expect(amountContainer).toHaveTextContent(
      formatEurocentToCurrency(amount).replace(/\u00a0/g, ' ')
    );
  });

  it('Should call handleDeselectPayment when radio button is selected and is clicked', async () => {
    const item = { ...pagoPAItem, status: PaymentStatus.REQUIRED };
    const handleDeselectPaymentMk = vi.fn();
    const { container } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={true}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={handleDeselectPaymentMk}
        isCancelled={false}
      />
    );
    const radioButton = container.querySelector('[data-testid="radio-button"] input');
    expect(radioButton).toBeChecked();
    fireEvent.click(radioButton!);
    expect(handleDeselectPaymentMk).toBeCalledTimes(1);
  });

  it('Should call handleFetchPaymentsInfo when reload button is clicked', async () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    };
    const handleFetchPaymentsInfoMk = vi.fn();
    const { getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={handleFetchPaymentsInfoMk}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const reloadButton = getByTestId('reload-button');
    fireEvent.click(reloadButton);
    await waitFor(() => {
      expect(handleFetchPaymentsInfoMk).toBeCalledTimes(1);
    });
  });

  it('Error - Show canceled chip when payment is Canceled. Radio and reload buttons should not exists', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_CANCELED,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const chip = getByTestId('statusChip-detail.payment.status.canceled');
    const radio = queryByTestId('radio-button');
    const reloadButton = queryByTestId('reload-button');
    expect(chip).toBeInTheDocument();
    expect(radio).not.toBeInTheDocument();
    expect(reloadButton).not.toBeInTheDocument();
  });

  it('Error - Show generic error message and reload button when payment is Failed and detail is GENERIC_ERROR', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
    };
    const { getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const message = getByTestId('generic-error-message');
    const reloadButton = getByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(message).toHaveTextContent('detail.payment.error.generic-error');
  });

  it('should show error message for PAYMENT_UNAVAILABLE', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const errorMessage = getByTestId('assistence-error-message');
    const reloadButton = queryByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for DOMAIN_UNKNOWN', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const errorMessage = getByTestId('assistence-error-message');
    const reloadButton = queryByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for PAYMENT_UNKNOWN. Reload buttons should exist', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const errorMessage = getByTestId('assistence-error-message');
    const reloadButton = queryByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.notice-error');
    expect(errorMessage).toHaveTextContent('detail.payment.error.assistence');
  });

  it('should show error message for PAYMENT_DUPLICATED. Reload buttons should exist', () => {
    const item = {
      ...pagoPAItem,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.PAYMENT_DUPLICATED,
    };
    const { getByTestId, queryByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={item}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={false}
      />
    );
    const errorMessage = getByTestId('payment-duplicated-message');
    const reloadButton = queryByTestId('reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('detail.payment.error.duplicated');
  });

  it('should show creditorTaxId if notification is Cancelled', () => {
    const { getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={pagoPAItem}
        loading={false}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={true}
      />
    );
    const creditorTaxId = getByTestId('creditorTaxId');
    expect(creditorTaxId).toBeInTheDocument();
    expect(creditorTaxId).toHaveTextContent(pagoPAItem.creditorTaxId);
  });

  it('should show only skeleton when loading is true', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentPagoPAItem
        pagoPAItem={pagoPAItem}
        loading={true}
        isSelected={false}
        handleFetchPaymentsInfo={() => void 0}
        handleDeselectPayment={() => void 0}
        isCancelled={true}
      />
    );
    // no payment box
    const box = queryById(container, `paymentPagoPa-${pagoPAItem.noticeCode}`);
    expect(box).not.toBeInTheDocument();
    // skeleton
    const skeleton = getByTestId('skeleton-card');
    expect(skeleton).toBeInTheDocument();
  });
});
