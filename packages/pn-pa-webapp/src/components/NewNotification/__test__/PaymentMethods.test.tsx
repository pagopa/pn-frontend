import { Formik, useFormik } from 'formik';
import { expect, vi } from 'vitest';

import {
  newNotification,
  newNotificationF24,
  newNotificationPagoPa,
} from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import {
  NewNotificationRecipient,
  PagoPaIntegrationMode,
  PaymentMethodsFormValues,
} from '../../../models/NewNotification';
import { newF24Payment, newPagopaPayment } from '../../../utility/notification.utility';
import PaymentMethods from '../PaymentMethods';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const getRecipientKey = (recipient: NewNotificationRecipient) =>
  `${recipient.recipientType}-${recipient.taxId}`;

const formikValues: PaymentMethodsFormValues = {
  notificationFeePolicy: newNotification.notificationFeePolicy,
  paFee: newNotification.paFee,
  pagoPaIntMode: PagoPaIntegrationMode.ASYNC,
  vat: newNotification.vat,
  recipients: {
    [getRecipientKey(newNotification.recipients[0])]: {
      pagoPa: [newNotificationPagoPa(0)],
      f24: [],
    },
    [getRecipientKey(newNotification.recipients[1])]: {
      pagoPa: [newNotificationPagoPa(1)],
      f24: [newNotificationF24(1)],
    },
    [getRecipientKey(newNotification.recipients[2])]: {
      pagoPa: [],
      f24: [newNotificationF24(2)],
    },
  },
};

const pagoPaRecipient = newNotification.recipients.find((r) =>
  r.payments?.some((p) => p.pagoPa)
) as NewNotificationRecipient;

const f24Recipient = newNotification.recipients.find((r) =>
  r.payments?.some((p) => p.f24)
) as NewNotificationRecipient;

const pagoPaRecipientKey = getRecipientKey(pagoPaRecipient);

const f24RecipientKey = getRecipientKey(f24Recipient);

describe('PaymentMethods Component', () => {
  const mockSetFieldValue = vi.fn();

  const renderComponent = (overrideValues?: Partial<PaymentMethodsFormValues>) => {
    return render(
      <Formik initialValues={{ ...formikValues, ...overrideValues }} onSubmit={() => {}}>
        {(formik) => {
          formik.setFieldValue = mockSetFieldValue;

          return (
            <PaymentMethods
              formik={formik as ReturnType<typeof useFormik<PaymentMethodsFormValues>>}
              notification={newNotification}
              hasFieldError={vi.fn()}
            />
          );
        }}
      </Formik>,
      {
        preloadedState: {
          userState: {
            user: {
              organization: {
                fiscal_code: 'mock-fiscal-code',
              },
            },
          },
        },
      }
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders PaymentMethods', () => {
    const { getAllByTestId, getByTestId, queryAllByTestId } = renderComponent();

    // First recipient - debt position PAGOPA
    const firstRecipientPaymentBox = getByTestId(`${newNotification.recipients[0].taxId}-payments`);
    expect(firstRecipientPaymentBox).toBeInTheDocument();

    const pagoPaBoxes1 = getAllByTestId(
      `${newNotification.recipients[0].taxId}-pagopa-payment-box`
    );
    expect(pagoPaBoxes1).toHaveLength(1);

    const f24Boxes1 = queryAllByTestId(`${newNotification.recipients[0].taxId}-f24-payment-box`);
    expect(f24Boxes1).toHaveLength(0);

    // Second recipient - Debt position PAGOPA_F24
    const secondRecipientPaymentBox = getByTestId(
      `${newNotification.recipients[1].taxId}-payments`
    );
    expect(secondRecipientPaymentBox).toBeInTheDocument();

    const pagoPaBoxes2 = getAllByTestId(
      `${newNotification.recipients[1].taxId}-pagopa-payment-box`
    );
    expect(pagoPaBoxes2).toHaveLength(1);

    const f24Boxes2 = getAllByTestId(`${newNotification.recipients[1].taxId}-f24-payment-box`);
    expect(f24Boxes2).toHaveLength(1);
  });

  it('should add new PagoPa payment when add button is clicked', () => {
    const { getByTestId } = renderComponent();

    const paymentBox = getByTestId(`${pagoPaRecipient.taxId}-payments`);
    expect(paymentBox).toBeInTheDocument();

    const recipientPagoPaPayment = within(paymentBox).getAllByTestId(
      `${pagoPaRecipient.taxId}-pagopa-payment-box`
    );
    expect(recipientPagoPaPayment).toHaveLength(1);

    const addPagoPaButton = within(paymentBox).getByTestId('add-new-pagopa');
    fireEvent.click(addPagoPaButton);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${pagoPaRecipientKey}.pagoPa`, [
      ...formikValues.recipients[pagoPaRecipientKey].pagoPa,
      newPagopaPayment(
        pagoPaRecipientKey,
        formikValues.recipients[pagoPaRecipientKey].pagoPa.length,
        'mock-fiscal-code'
      ),
    ]);
  });

  it('should add new F24 payment when add button is clicked', () => {
    const { getByTestId } = renderComponent();

    const paymentBox = getByTestId(`${f24Recipient.taxId}-payments`);
    expect(paymentBox).toBeInTheDocument();

    const addF24Button = within(paymentBox).getByTestId('add-new-f24');
    fireEvent.click(addF24Button);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);

    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${f24RecipientKey}.f24`, [
      ...formikValues.recipients[f24RecipientKey].f24,
      newF24Payment(f24RecipientKey, formikValues.recipients[f24RecipientKey].f24.length),
    ]);
  });

  it('should remove a PagoPa payment when delete button is clicked', () => {
    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [pagoPaRecipientKey]: {
          pagoPa: [newNotificationPagoPa(0), { ...newNotificationPagoPa(1), idx: 1 }],
          f24: [],
        },
      },
    });

    const paymentBox = getByTestId(`${pagoPaRecipient.taxId}-payments`);
    const deleteButtons = within(paymentBox).getAllByTestId('pagopa-delete-button');
    expect(deleteButtons).toHaveLength(1);
    fireEvent.click(deleteButtons[0]);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${pagoPaRecipientKey}.pagoPa`, [
      newNotificationPagoPa(0),
    ]);
  });

  it('should remove F24 payment when delete button is clicked', () => {
    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [f24RecipientKey]: {
          pagoPa: [newNotificationPagoPa(0)],
          f24: [newNotificationF24(0), { ...newNotificationF24(1), idx: 1 }],
        },
      },
    });

    const paymentBox = getByTestId(`${f24Recipient.taxId}-payments`);
    const deleteButtons = within(paymentBox).getAllByTestId('f24-delete-button');
    expect(deleteButtons).toHaveLength(1);
    fireEvent.click(deleteButtons[0]);

    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${f24RecipientKey}.f24`, [
      newNotificationF24(0),
    ]);
  });

  it('should handle file upload for PagoPa payment', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockSha256 = { hashBase64: 'mocked-hashBase64', hashHex: 'mocked-hashHex' };

    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [pagoPaRecipientKey]: {
          pagoPa: [newPagopaPayment('1', 1, 'mock-fiscal-code')],
          f24: [],
        },
      },
    });

    const paymentBox = getByTestId(`${pagoPaRecipient.taxId}-payments`);
    expect(paymentBox).toBeInTheDocument();

    const uploadButton = within(paymentBox).getByTestId('loadFromPc');
    expect(uploadButton).toBeInTheDocument();
    const fileInput = within(paymentBox).getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        `recipients.${pagoPaRecipientKey}.pagoPa.0`,
        {
          ...newPagopaPayment('1', 1, 'mock-fiscal-code'),
          file: { data: mockFile, sha256: mockSha256 },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        true
      );
    });
  });

  it('should handle file upload for F24 payment', async () => {
    const mockFile = new File(['test'], 'test.json', { type: 'application/json' });
    const mockSha256 = { hashBase64: 'mocked-hashBase64', hashHex: 'mocked-hashHex' };

    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [f24RecipientKey]: {
          pagoPa: [],
          f24: [newF24Payment('1', 1)],
        },
      },
    });

    const paymentBox = getByTestId(`${f24Recipient.taxId}-payments`);
    expect(paymentBox).toBeInTheDocument();

    const uploadButton = within(paymentBox).getByTestId('loadFromPc');
    expect(uploadButton).toBeInTheDocument();
    const fileInput = within(paymentBox).getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        `recipients.${f24RecipientKey}.f24.0`,
        {
          ...newF24Payment('1', 1),
          file: { data: mockFile, sha256: mockSha256 },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        true
      );
    });
  });

  it('should remove file for PagoPa payment', () => {
    const { getByTestId } = renderComponent();

    const paymentBox = getByTestId(`${pagoPaRecipient.taxId}-payments`);

    const pagoPaPayment = within(paymentBox).getByTestId(
      `${pagoPaRecipient.taxId}-pagopa-payment-box`
    );
    const removeFile = within(pagoPaPayment).getByTestId('removeDocument');
    fireEvent.click(removeFile);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${pagoPaRecipientKey}.pagoPa.0`, {
      ...formikValues.recipients[pagoPaRecipientKey].pagoPa[0],
      file: {
        data: undefined,
        sha256: { hashBase64: '', hashHex: '' },
      },
      ref: {
        key: '',
        versionToken: '',
      },
    });
  });

  it('should remove file for F24 payment', () => {
    const { getByTestId } = renderComponent();

    const paymentBox = getByTestId(`${f24Recipient.taxId}-payments`);

    const f24Payment = within(paymentBox).getByTestId(`${f24Recipient.taxId}-f24-payment-box`);
    const removeFile = within(f24Payment).getByTestId('removeDocument');
    fireEvent.click(removeFile);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${f24RecipientKey}.f24.0`, {
      ...formikValues.recipients[f24RecipientKey].f24[0],
      file: {
        data: undefined,
        sha256: { hashBase64: '', hashHex: '' },
      },
      ref: {
        key: '',
        versionToken: '',
      },
    });
  });
});
