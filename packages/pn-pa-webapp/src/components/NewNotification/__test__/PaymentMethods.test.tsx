import { Formik, useFormik } from 'formik';
import { expect, vi } from 'vitest';

import {
  newNotification,
  newNotificationF24,
  newNotificationPagoPa,
} from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { PagoPaIntegrationMode, PaymentMethodsFormValues } from '../../../models/NewNotification';
import { newF24Payment, newPagopaPayment } from '../../../utility/notification.utility';
import PaymentMethods from '../PaymentMethods';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const formikValues: PaymentMethodsFormValues = {
  notificationFeePolicy: newNotification.notificationFeePolicy,
  paFee: newNotification.paFee,
  pagoPaIntMode: PagoPaIntegrationMode.ASYNC,
  vat: newNotification.vat,
  recipients: {
    [newNotification.recipients[0].taxId]: {
      pagoPa: [newNotificationPagoPa],
      f24: [],
    },
    [newNotification.recipients[1].taxId]: {
      pagoPa: [newNotificationPagoPa],
      f24: [newNotificationF24],
    },
  },
};

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
    const firstRecipient = newNotification.recipients[0];

    const firstRecipientPaymentBox = getByTestId(`${firstRecipient.taxId}-payments`);
    expect(firstRecipientPaymentBox).toBeInTheDocument();

    const recipientPagoPaPayment = within(firstRecipientPaymentBox).getAllByTestId(
      `${firstRecipient.taxId}-pagopa-payment-box`
    );
    expect(recipientPagoPaPayment).toHaveLength(1);

    const addPagoPaButton = within(firstRecipientPaymentBox).getByTestId('add-new-pagopa');
    fireEvent.click(addPagoPaButton);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${firstRecipient.taxId}.pagoPa`, [
      ...formikValues.recipients[firstRecipient.taxId].pagoPa,
      newPagopaPayment(
        firstRecipient.taxId,
        formikValues.recipients[firstRecipient.taxId].pagoPa.length,
        'mock-fiscal-code'
      ),
    ]);
  });

  it('should add new F24 payment when add button is clicked', () => {
    const { getByTestId } = renderComponent();

    const secondRecipient = newNotification.recipients[1];

    const secondRecipientPaymentBox = getByTestId(`${secondRecipient.taxId}-payments`);
    expect(secondRecipientPaymentBox).toBeInTheDocument();

    const addF24Button = within(secondRecipientPaymentBox).getByTestId('add-new-f24');
    fireEvent.click(addF24Button);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);

    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${secondRecipient.taxId}.f24`, [
      ...formikValues.recipients[secondRecipient.taxId].f24,
      newF24Payment(
        secondRecipient.taxId,
        formikValues.recipients[secondRecipient.taxId].f24.length
      ),
    ]);
  });

  it('should removea PagoPa payment when delete button is clicked', () => {
    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [newNotification.recipients[1].taxId]: {
          pagoPa: [newNotificationPagoPa, { ...newNotificationPagoPa, idx: 1 }],
          f24: [],
        },
      },
    });

    const secondRecipient = newNotification.recipients[1];
    const secondRecipientPaymentBox = getByTestId(`${secondRecipient.taxId}-payments`);
    const deleteButtons = within(secondRecipientPaymentBox).getAllByTestId('pagopa-delete-button');
    expect(deleteButtons).toHaveLength(1);
    fireEvent.click(deleteButtons[0]);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${secondRecipient.taxId}.pagoPa`, [
      newNotificationPagoPa,
    ]);
  });

  it('should remove F24 payment when delete button is clicked', () => {
    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [newNotification.recipients[1].taxId]: {
          pagoPa: [newNotificationPagoPa],
          f24: [newNotificationF24, { ...newNotificationF24, idx: 1 }],
        },
      },
    });

    const secondRecipient = newNotification.recipients[1];
    const secondRecipientPaymentBox = getByTestId(`${secondRecipient.taxId}-payments`);
    const deleteButtons = within(secondRecipientPaymentBox).getAllByTestId('f24-delete-button');
    expect(deleteButtons).toHaveLength(1);
    fireEvent.click(deleteButtons[0]);

    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${secondRecipient.taxId}.f24`, [
      newNotificationF24,
    ]);
  });

  it('should handle file upload for PagoPa payment', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockSha256 = { hashBase64: 'mocked-hashBase64', hashHex: 'mocked-hashHex' };

    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [newNotification.recipients[0].taxId]: {
          pagoPa: [newPagopaPayment('1', 1, 'mock-fiscal-code')],
          f24: [],
        },
      },
    });
    const firstRecipient = newNotification.recipients[0];

    const firstRecipientPaymentBox = getByTestId(`${firstRecipient.taxId}-payments`);
    expect(firstRecipientPaymentBox).toBeInTheDocument();

    const uploadButton = within(firstRecipientPaymentBox).getByTestId('loadFromPc');
    expect(uploadButton).toBeInTheDocument();
    const fileInput = within(firstRecipientPaymentBox).getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        `recipients.${firstRecipient.taxId}.pagoPa.0`,
        {
          ...newPagopaPayment('1', 1, 'mock-fiscal-code'),
          file: { data: mockFile, sha256: mockSha256 },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        false
      );
    });
  });

  it('should handle file upload for F24 payment', async () => {
    const mockFile = new File(['test'], 'test.json', { type: 'application/json' });
    const mockSha256 = { hashBase64: 'mocked-hashBase64', hashHex: 'mocked-hashHex' };

    const { getByTestId } = renderComponent({
      recipients: {
        ...formikValues.recipients,
        [newNotification.recipients[1].taxId]: {
          pagoPa: [],
          f24: [newF24Payment('1', 1)],
        },
      },
    });
    const secondRecipient = newNotification.recipients[1];

    const secondRecipientPaymentBox = getByTestId(`${secondRecipient.taxId}-payments`);
    expect(secondRecipientPaymentBox).toBeInTheDocument();

    const uploadButton = within(secondRecipientPaymentBox).getByTestId('loadFromPc');
    expect(uploadButton).toBeInTheDocument();
    const fileInput = within(secondRecipientPaymentBox).getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        `recipients.${secondRecipient.taxId}.f24.0`,
        {
          ...newF24Payment('1', 1),
          file: { data: mockFile, sha256: mockSha256 },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        false
      );
    });
  });

  it('should remove file for PagoPa payment', () => {
    const { getByTestId } = renderComponent();

    const firstRecipient = newNotification.recipients[0];
    const firstRecipientPaymentBox = getByTestId(`${firstRecipient.taxId}-payments`);

    const removeFile = within(firstRecipientPaymentBox).getByTestId('removeDocument');
    fireEvent.click(removeFile);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${firstRecipient.taxId}.pagoPa.0`, {
      ...formikValues.recipients[firstRecipient.taxId].pagoPa[0],
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

    const secondRecipient = newNotification.recipients[1];
    const secondRecipientPaymentBox = getByTestId(`${secondRecipient.taxId}-payments`);

    const f24Payment = within(secondRecipientPaymentBox).getByTestId(
      `${secondRecipient.taxId}-f24-payment-box`
    );
    const removeFile = within(f24Payment).getByTestId('removeDocument');
    fireEvent.click(removeFile);

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith(`recipients.${secondRecipient.taxId}.f24.0`, {
      ...formikValues.recipients[secondRecipient.taxId].f24[0],
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
