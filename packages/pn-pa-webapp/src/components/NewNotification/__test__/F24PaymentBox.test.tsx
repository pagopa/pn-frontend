import { Formik } from 'formik';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { newNotificationF24 } from '../../../__mocks__/NewNotification.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { NotificationFeePolicy } from '../../../models/NewNotification';
import F24PaymentBox from '../F24PaymentBox';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('F24PaymentBox', () => {
  const defaultProps = {
    id: 'payment-0',
    onFileUploaded: vi.fn(),
    onRemoveFile: vi.fn(),
    f24Payment: newNotificationF24(0),
    notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
    handleChange: vi.fn(),
    showDeleteButton: false,
    onDeletePayment: vi.fn(),
    fieldMeta: () => ({
      touched: false,
      error: undefined,
      value: undefined,
      initialTouched: false,
    }),
    hasFieldError: () => true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders the component correctly with basic props', () => {
    const { getByTestId, queryByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <F24PaymentBox {...defaultProps} />}
      </Formik>
    );

    // expect(getByTestId('pagopa-file-upload-input')).toBeInTheDocument();
    expect(getByTestId('f24-name')).toBeInTheDocument();
    expect(queryByTestId('f24-delete-button')).not.toBeInTheDocument();
    expect(queryByTestId('f24-apply-cost')).not.toBeInTheDocument();
  });

  it('should shows apply cost switch when notificationFeePolicy is DELIVERY_MODE', () => {
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <F24PaymentBox
            {...defaultProps}
            notificationFeePolicy={NotificationFeePolicy.DELIVERY_MODE}
          />
        )}
      </Formik>
    );

    expect(getByTestId('f24-apply-cost')).toBeInTheDocument();
  });

  it('should shows and click delete button when showDeleteButton is true', () => {
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <F24PaymentBox {...defaultProps} showDeleteButton={true} />}
      </Formik>
    );

    const deleteButton = getByTestId('f24-delete-button');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(defaultProps.onDeletePayment).toHaveBeenCalledTimes(1);
  });

  it('should shows warning alert when both showDeleteButton and DELIVERY_MODE are true', () => {
    const { rerender, getByTestId, queryByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <F24PaymentBox
            {...defaultProps}
            showDeleteButton={true}
            notificationFeePolicy={NotificationFeePolicy.DELIVERY_MODE}
          />
        )}
      </Formik>
    );

    expect(getByTestId('f24-installment-alert')).toBeInTheDocument();

    rerender(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <F24PaymentBox
            {...defaultProps}
            showDeleteButton={true}
            notificationFeePolicy={NotificationFeePolicy.FLAT_RATE}
          />
        )}
      </Formik>
    );

    expect(queryByTestId('f24-installment-alert')).not.toBeInTheDocument();
  });

  it('should calls onFileUploaded when a file is uploaded', async () => {
    const paymentWithoutFile = {
      ...defaultProps.f24Payment,
      file: {
        data: undefined,
        sha256: {
          hashBase64: '',
          hashHex: '',
        },
      },
    };

    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <F24PaymentBox {...defaultProps} f24Payment={paymentWithoutFile} />}
      </Formik>
    );
    const uploadButton = getByTestId('loadFromPc');
    expect(uploadButton).toBeInTheDocument();
    const fileInput = getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    const mockFile = new File(['mocked content'], 'mocked-file.json', {
      type: 'application/json',
    });
    fireEvent.change(input!, { target: { files: [mockFile] } });
    await waitFor(() => {
      expect(defaultProps.onFileUploaded).toHaveBeenCalledTimes(1);
    });
    expect(defaultProps.onFileUploaded).toHaveBeenCalledWith(mockFile, {
      hashBase64: 'mocked-hashBase64',
      hashHex: 'mocked-hashHex',
    });
  });

  it('should calls onRemoveFile when file is removed', () => {
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <F24PaymentBox {...defaultProps} />}
      </Formik>
    );

    fireEvent.click(getByTestId('removeDocument'));
    expect(defaultProps.onRemoveFile).toHaveBeenCalledTimes(1);
  });

  it('should displays error messages when fields have errors and are touched', () => {
    const fieldMetaWithErrors = (name: string) => {
      if (name === 'payment-0.name') {
        return {
          touched: true,
          error: 'Name is required',
          initialTouched: false,
          value: undefined,
        };
      }
      return {
        touched: false,
        error: undefined,
        initialTouched: false,
        value: undefined,
      };
    };

    const { getByText } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <F24PaymentBox {...defaultProps} fieldMeta={fieldMetaWithErrors} />}
      </Formik>
    );

    expect(getByText('Name is required')).toBeInTheDocument();
  });
});
