import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO, payments } from '../../../__mocks__/NotificationDetail.mock';
import { PaymentsData } from '../../../models';
import { initLocalizationForTest, render } from '../../../test-utils';
import { getF24Payments, getPagoPaF24Payments, populatePaymentsPagoPaF24 } from '../../../utility';
import NotificationPaymentTitle from '../NotificationPaymentTitle';

describe('NotificationPaymentTite component', () => {
  const paymentsData: PaymentsData = {
    pagoPaF24: populatePaymentsPagoPaF24(
      notificationDTO.timeline,
      getPagoPaF24Payments(payments, 0),
      paymentInfo
    ),
    f24Only: getF24Payments(payments, 0),
  };

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('render component - multi payments', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentTitle
        pagoPaF24={paymentsData.pagoPaF24}
        f24Only={paymentsData.f24Only}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={false}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent(
      'notifiche - detail.payment.subtitle-mixed notifiche - detail.payment.how'
    );
    const faq = getByTestId('faqNotificationCosts');
    expect(faq).toBeInTheDocument();
  });

  it('render component - one payment', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentTitle
        pagoPaF24={[paymentsData.pagoPaF24[0]]}
        f24Only={[]}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={false}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent(
      'notifiche - detail.payment.single-payment-subtitle notifiche - detail.payment.how'
    );
    const faq = getByTestId('faqNotificationCosts');
    expect(faq).toBeInTheDocument();
  });

  it('render component - multi payments whit no f24', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentTitle
        pagoPaF24={paymentsData.pagoPaF24}
        f24Only={[]}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={false}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent(
      'notifiche - detail.payment.subtitle notifiche - detail.payment.how'
    );
    const faq = getByTestId('faqNotificationCosts');
    expect(faq).toBeInTheDocument();
  });

  it('render component - only f24', () => {
    const { container, queryByTestId } = render(
      <NotificationPaymentTitle
        pagoPaF24={[]}
        f24Only={paymentsData.f24Only}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={false}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent('notifiche - detail.payment.subtitle-f24');
    const faq = queryByTestId('faqNotificationCosts');
    expect(faq).toBeInTheDocument();
  });

  it('should not show title if has only one page and all payments are paid', () => {
    const { container } = render(
      <NotificationPaymentTitle
        pagoPaF24={[]}
        f24Only={[]}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={true}
        hasMoreThanOnePage={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should show title if all payments are paid but has more than one page', () => {
    const { container, getByTestId } = render(
      <NotificationPaymentTitle
        pagoPaF24={paymentsData.pagoPaF24}
        f24Only={paymentsData.f24Only}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={true}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent(
      'notifiche - detail.payment.subtitle-mixed notifiche - detail.payment.how'
    );
    const faq = getByTestId('faqNotificationCosts');
    expect(faq).toBeInTheDocument();
  });
  
  it('should show title if all payments are paid, has more than one page BUT there are f24Only ', () => {
    const { container } = render(
      <NotificationPaymentTitle
        pagoPaF24={[]}
        f24Only={paymentsData.f24Only}
        landingSiteUrl="https://www.mocked-url.com"
        handleTrackEventFn={() => {}}
        allPaymentsIsPaid={true}
        hasMoreThanOnePage={true}
      />
    );

    expect(container).toHaveTextContent(
      'notifiche - detail.payment.subtitle-f24 notifiche - detail.payment.how'
    );
  });
});
