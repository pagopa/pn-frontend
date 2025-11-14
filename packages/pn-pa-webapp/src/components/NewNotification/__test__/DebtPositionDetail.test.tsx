import { isNil } from 'lodash-es';
import { vi } from 'vitest';

import { getById, testInput, testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  newNotification,
  newNotificationRecipients,
} from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { NotificationFeePolicy, PaymentModel } from '../../../models/NewNotification';
import { newF24Payment, newPagopaPayment } from '../../../utility/notification.utility';
import DebtPositionDetail from '../DebtPositionDetail';

const confirmHandlerMk = vi.fn();
const previousStepMk = vi.fn();

describe('DebtPositionDetail Component', async () => {
  describe('Render Payment Boxes', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders component - one recipient - debtPosition pagopa only', async () => {
      const newNotificationWithPagopaOnly = {
        ...newNotification,
        recipients: [newNotificationRecipients[0]],
      };
      const recipientTaxId = newNotificationWithPagopaOnly.recipients[0].taxId;

      const { getByTestId, getAllByTestId, queryAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotificationWithPagopaOnly}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');
      await testRadio(paymentChoiceBox, 'pagoPaIntMode', ['radios.sync', 'radios.async']);

      const paymentsBox = getByTestId(`${recipientTaxId}-payments`);
      expect(paymentsBox).toBeInTheDocument();
      const pagoPaPaymentBox = getAllByTestId(`${recipientTaxId}-pagopa-payment-box`);
      expect(pagoPaPaymentBox).toHaveLength(1);
      const f24PaymentBox = queryAllByTestId(`${recipientTaxId}-f24-payment-box`);
      expect(f24PaymentBox).toHaveLength(0);

      const buttonSubmit = getByTestId('step-submit');
      expect(buttonSubmit).toHaveTextContent('button.continue');
      const buttonPrevious = getByTestId('previous-step');
      expect(buttonPrevious).toBeInTheDocument();
      expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
      // check the click on prev button
      fireEvent.click(buttonPrevious);
      expect(previousStepMk).toHaveBeenCalledTimes(1);
    });

    it('renders component - one recipient - debtPosition f24 only', async () => {
      const newNotificationWithF24Only = {
        ...newNotification,
        recipients: [newNotificationRecipients[2]],
      };
      const recipientTaxId = newNotificationWithF24Only.recipients[0].taxId;

      const { getByTestId, getAllByTestId, queryAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotificationWithF24Only}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).not.toHaveTextContent('pagopa-int-mode.title');

      const paymentsBox = getByTestId(`${recipientTaxId}-payments`);
      expect(paymentsBox).toBeInTheDocument();
      const f24PaymentBox = getAllByTestId(`${recipientTaxId}-f24-payment-box`);
      expect(f24PaymentBox).toHaveLength(1);
      const pagoPaPaymentBox = queryAllByTestId(`${recipientTaxId}-pagopa-payment-box`);
      expect(pagoPaPaymentBox).toHaveLength(0);

      const buttonSubmit = getByTestId('step-submit');
      expect(buttonSubmit).toHaveTextContent('button.continue');
      const buttonPrevious = getByTestId('previous-step');
      expect(buttonPrevious).toBeInTheDocument();
      expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
      // check the click on prev button
      fireEvent.click(buttonPrevious);
      expect(previousStepMk).toHaveBeenCalledTimes(1);
    });

    it('renders component - one recipient - debtPosition f24 and pagopa', async () => {
      const newNotificationWithF24AndPagopa = {
        ...newNotification,
        recipients: [newNotificationRecipients[1]],
      };
      const recipientTaxId = newNotificationWithF24AndPagopa.recipients[0].taxId;

      const { getByTestId, getAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotificationWithF24AndPagopa}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');

      const paymentsBox = getByTestId(`${recipientTaxId}-payments`);
      expect(paymentsBox).toBeInTheDocument();
      const pagoPaPaymentBox = getAllByTestId(`${recipientTaxId}-pagopa-payment-box`);
      expect(pagoPaPaymentBox).toHaveLength(1);
      const f24PaymentBox = getAllByTestId(`${recipientTaxId}-f24-payment-box`);
      expect(f24PaymentBox).toHaveLength(1);

      const buttonSubmit = getByTestId('step-submit');
      expect(buttonSubmit).toHaveTextContent('button.continue');
      const buttonPrevious = getByTestId('previous-step');
      expect(buttonPrevious).toBeInTheDocument();
      expect(buttonPrevious).toHaveTextContent('back-to-debt-position');
      // check the click on prev button
      fireEvent.click(buttonPrevious);
      expect(previousStepMk).toHaveBeenCalledTimes(1);
    });

    it('renders component - multi recipient - debtPosition pagopa only', async () => {
      const newNotificationWithPagoPaOnly = {
        ...newNotification,
        recipients: newNotification.recipients.map((r) => ({
          ...r,
          debtPosition: PaymentModel.PAGO_PA,
          payments: r.payments?.map((_, i) => ({
            pagoPa: newPagopaPayment(r.taxId, i, '77777777777'),
            f24: undefined,
          })),
        })),
      };

      const { getByTestId, getAllByTestId, queryAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotificationWithPagoPaOnly}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');
      await testRadio(paymentChoiceBox, 'pagoPaIntMode', ['radios.sync', 'radios.async']);

      for (const recipient of newNotification.recipients) {
        const paymentsBox = getByTestId(`${recipient.taxId}-payments`);
        expect(paymentsBox).toBeInTheDocument();
        const pagoPaPaymentBox = getAllByTestId(`${recipient.taxId}-pagopa-payment-box`);
        expect(pagoPaPaymentBox).toHaveLength(1);
        const f24PaymentBox = queryAllByTestId(`${recipient.taxId}-f24-payment-box`);
        expect(f24PaymentBox).toHaveLength(0);
      }
    });

    it('renders component - multi recipient - debtPosition f24 only', async () => {
      const newNotificationWithF24Only = {
        ...newNotification,
        recipients: newNotification.recipients.map((r) => ({
          ...r,
          debtPosition: PaymentModel.F24,
          payments: r.payments?.map((_, i) => ({
            pagoPa: undefined,
            f24: newF24Payment(r.taxId, i),
          })),
        })),
      };

      const { getByTestId, getAllByTestId, queryAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotificationWithF24Only}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).not.toHaveTextContent('pagopa-int-mode.title');

      for (const recipient of newNotification.recipients) {
        const paymentsBox = getByTestId(`${recipient.taxId}-payments`);
        expect(paymentsBox).toBeInTheDocument();
        const f24PaymentBox = getAllByTestId(`${recipient.taxId}-f24-payment-box`);
        expect(f24PaymentBox).toHaveLength(1);
        const pagoPaPaymentBox = queryAllByTestId(`${recipient.taxId}-pagopa-payment-box`);
        expect(pagoPaPaymentBox).toHaveLength(0);
      }
    });

    it('renders component - multi recipient - debtPosition f24 and pagopa', async () => {
      const { getByTestId, queryAllByTestId } = render(
        <DebtPositionDetail
          notification={newNotification}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toHaveTextContent('back-to-debt-position');
      expect(paymentChoiceBox).toHaveTextContent('notification-fee.title');
      await testRadio(paymentChoiceBox, 'notificationFeePolicy', [
        'radios.flat-rate',
        'radios.delivery-mode',
      ]);
      expect(paymentChoiceBox).toHaveTextContent('pagopa-int-mode.title');

      for (const recipient of newNotification.recipients) {
        const paymentsBox = getByTestId(`${recipient.taxId}-payments`);
        expect(paymentsBox).toBeInTheDocument();
        const pagoPaPaymentBox = queryAllByTestId(`${recipient.taxId}-pagopa-payment-box`);
        expect(pagoPaPaymentBox).toHaveLength(
          recipient.payments?.filter((p) => !!p.pagoPa).length ?? 0
        );
        const f24PaymentBox = queryAllByTestId(`${recipient.taxId}-f24-payment-box`);
        expect(f24PaymentBox).toHaveLength(recipient.payments?.filter((p) => !!p.f24).length ?? 0);
      }
    });
  });

  describe('Debt Position Validations', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should show error if notification cost is greater than 1.00 or it has more than 2 decimals', async () => {
      const result = render(
        <DebtPositionDetail
          notification={newNotification}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const form = result.container.querySelector('form')!;
      expect(form).toHaveTextContent('back-to-debt-position');
      expect(form).toHaveTextContent('notification-fee.title');
      await testRadio(
        form,
        'notificationFeePolicy',
        ['radios.flat-rate', 'radios.delivery-mode'],
        1,
        true
      );

      const notificationPaFee = result.getByTestId('notification-pa-fee');
      expect(notificationPaFee).toBeInTheDocument();
      const paFeeInput = getById(form, 'paFee');
      fireEvent.focus(paFeeInput);

      expect(notificationPaFee).toHaveTextContent('pa-fee-validation');

      await testInput(form, 'paFee', '1.50');
      const errorMaxValue = form.querySelector(`[id="paFee-helper-text"]`);
      expect(errorMaxValue).toHaveTextContent('pa-fee-max-value');

      await testInput(form, 'paFee', '0,9888');
      const errorCurrency = form.querySelector(`[id="paFee-helper-text"]`);
      expect(errorCurrency).toHaveTextContent('pa-fee-currency');

      await testInput(form, 'paFee', '0.99');
      expect(form).not.toHaveTextContent('notification-fee.pa-fee-max-value');
      expect(form).not.toHaveTextContent('notification-fee.pa-fee-currency');
    });

    it('should show error when type 2 identical notice code for the same creditor tax id', async () => {
      const notificationWithTwoPagoPa = {
        ...newNotification,
        recipients: [
          {
            ...newNotification.recipients[0],
            debtPosition: PaymentModel.PAGO_PA,
            payments: [
              {
                pagoPa: newPagopaPayment(newNotification.recipients[0].taxId, 0, '77777777777'),
              },
              {
                pagoPa: newPagopaPayment(newNotification.recipients[0].taxId, 1, '77777777777'),
              },
            ],
          },
        ],
      };
      const recipientTaxId = newNotification.recipients[0].taxId;
      const recipientType = newNotification.recipients[0].recipientType;
      const recipientKey = `${recipientType}-${recipientTaxId}`;

      const result = render(
        <DebtPositionDetail
          notification={notificationWithTwoPagoPa}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentsBox = result.getByTestId(`${recipientTaxId}-payments`);
      expect(paymentsBox).toBeInTheDocument();

      const firstPagoPaBox = result.getByTestId(`recipients.${recipientKey}.pagoPa.0`);
      const secondPagoPaBox = result.getByTestId(`recipients.${recipientKey}.pagoPa.1`);

      await testInput(firstPagoPaBox, 'noticeCode', '111111111111111111');
      await testInput(secondPagoPaBox, 'noticeCode', '111111111111111111');

      let firstFieldError = firstPagoPaBox.querySelector('[id="noticeCode-helper-text"]');
      let secondFieldError = secondPagoPaBox.querySelector('[id="noticeCode-helper-text"]');

      expect(firstFieldError).toHaveTextContent('identical-notice-codes-error');
      expect(secondFieldError).toHaveTextContent('identical-notice-codes-error');

      // Change one value in order to clear errors
      await testInput(firstPagoPaBox, 'noticeCode', '222222222222222222');

      firstFieldError = firstPagoPaBox.querySelector('[id="noticeCode-helper-text"]');
      secondFieldError = secondPagoPaBox.querySelector('[id="noticeCode-helper-text"]');

      expect(firstFieldError).not.toBeInTheDocument();
      expect(secondFieldError).not.toBeInTheDocument();
    });

    it('should show error when notificationFeePolicy is DELIVERY_MODE and no applyCost switch is selected', async () => {
      const notificationWithFalseApplyCost = {
        ...newNotification,
        notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
        paFee: '0,99',
        vat: 4,
        recipients: newNotification.recipients.map((r) => ({
          ...r,
          payments: r.payments?.map((p) => ({
            pagoPa: p.pagoPa ? { ...p.pagoPa, applyCost: false } : undefined,
            f24: p.f24 ? { ...p.f24, applyCost: false } : undefined,
          })),
        })),
      };

      const result = render(
        <DebtPositionDetail
          notification={notificationWithFalseApplyCost}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => result.getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toBeInTheDocument();

      for (const recipient of notificationWithFalseApplyCost.recipients) {
        const recipientKey = `${recipient.recipientType}-${recipient.taxId}`;
        if (!recipient.payments) continue;
        let pagoPaIdx = 0;
        let f24Idx = 0;
        for (const payment of recipient.payments) {
          if (!isNil(payment.pagoPa)) {
            const pagoPaPaymentBox = result.getByTestId(
              `recipients.${recipientKey}.pagoPa.${pagoPaIdx}`
            );
            const applyCostError = within(pagoPaPaymentBox).getByTestId('applyCost-helper-text');
            expect(applyCostError).toHaveTextContent('at-least-one-applycost');
          }
          if (!isNil(payment.f24)) {
            const f24PaymentBox = result.getByTestId(`recipients.${recipientKey}.f24.${f24Idx}`);
            const applyCostError = within(f24PaymentBox).getByTestId('applyCost-helper-text');
            expect(applyCostError).toHaveTextContent('at-least-one-applycost');
          }
        }
      }
    });

    it('should show error when upload two identical files', async () => {
      const notificationWithEmptyFiles = {
        ...newNotification,
        recipients: [
          {
            ...newNotification.recipients[0],
            debtPosition: PaymentModel.PAGO_PA,
            payments: [
              {
                pagoPa: newPagopaPayment(newNotification.recipients[0].taxId, 0, '77777777777'),
              },
              {
                pagoPa: newPagopaPayment(newNotification.recipients[0].taxId, 1, '77777777777'),
              },
            ],
          },
        ],
      };

      const result = render(
        <DebtPositionDetail
          notification={notificationWithEmptyFiles}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousStepMk}
        />
      );

      const paymentChoiceBox = await waitFor(() => result.getByTestId('debtPositionDetailForm'));
      expect(paymentChoiceBox).toBeInTheDocument();

      const recipient = notificationWithEmptyFiles.recipients[0];
      const recipientKey = `${recipient.recipientType}-${recipient.taxId}`;

      // loop recipients and upload files
      for (const recipient of notificationWithEmptyFiles.recipients) {
        if (!recipient.payments) continue;
        for (const [index, payment] of recipient.payments.entries()) {
          if (!isNil(payment.pagoPa)) {
            const pagoPaPaymentBox = result.getByTestId(
              `recipients.${recipientKey}.pagoPa.${index}`
            );
            const fileInput = within(pagoPaPaymentBox).getByTestId('fileInput');
            const input = fileInput?.querySelector('input');
            const mockFile = new File(['mocked content'], 'mocked-file.pdf', {
              type: 'application/pdf',
            });
            fireEvent.change(input!, { target: { files: [mockFile] } });
            await waitFor(() => {
              expect(pagoPaPaymentBox).toHaveTextContent(mockFile.name);
            });
          }
        }
      }

      // loop recipients and check errors
      for (const recipient of notificationWithEmptyFiles.recipients) {
        if (!recipient.payments) continue;
        for (const [index, payment] of recipient.payments.entries()) {
          if (!isNil(payment.pagoPa)) {
            const pagoPaPaymentBox = result.getByTestId(
              `recipients.${recipientKey}.pagoPa.${index}`
            );
            await waitFor(() => {
              const fileUploadError = pagoPaPaymentBox.querySelector('[id="file-upload-error"]');
              expect(fileUploadError).toHaveTextContent('identical-sha256-error');
            });
          }
        }
      }
    });
  });
});
