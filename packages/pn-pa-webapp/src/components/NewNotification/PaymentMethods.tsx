import { useFormik } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  NewNotification,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  PaymentMethodsFormValues,
  PaymentModel,
} from '../../models/NewNotification';
import F24PaymentBox from './F24PaymentBox';
import PagoPaPaymentBox from './PagoPaPaymentBox';

type Props = {
  notification: NewNotification;
  formik: ReturnType<typeof useFormik<PaymentMethodsFormValues>>;
  newPagopaPayment: (id: string, idx: number) => NewNotificationPagoPaPayment;
  newF24Payment: (id: string, idx: number) => NewNotificationF24Payment;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const PaymentMethods: React.FC<Props> = ({
  notification,
  formik,
  newPagopaPayment,
  newF24Payment,
}) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail.payment-methods',
  });

  const fileUploadedHandler = async (
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    const payment = formik.values.recipients[taxId][paymentType][index];

    await formik.setFieldValue(
      `recipients.${taxId}.${paymentType}.${index}`,
      {
        ...payment,
        file: { data: file, sha256 },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      false
    );
    await formik.setFieldTouched(`recipients.${taxId}.${paymentType}.${index}.file`, true, true);
  };

  const removeFileHandler = async (taxId: string, paymentType: 'pagoPa' | 'f24', index: number) => {
    const payment = formik.values.recipients[taxId][paymentType][index];

    await formik.setFieldValue(`recipients.${taxId}.${paymentType}.${index}`, {
      ...payment,
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    paymentIndex: number
  ) => {
    const value = event.target.name === 'applyCost' ? event.target.checked : event.target.value;

    await formik.setFieldValue(
      `recipients.${taxId}.${paymentType}.${paymentIndex}.${event.target.name}`,
      value
    );
    await formik.setFieldTouched(
      `recipients.${taxId}.${paymentType}.${paymentIndex}.${event.target.name}`,
      true,
      true
    );
  };

  const handleAddNewPagoPa = async (taxId: string) => {
    const newPayment = newPagopaPayment(taxId, formik.values.recipients[taxId].pagoPa.length);
    await formik.setFieldValue(`recipients.${taxId}.pagoPa`, [
      ...formik.values.recipients[taxId].pagoPa,
      newPayment,
    ]);
  };

  const handleAddNewF24 = async (taxId: string) => {
    const newPayment = newF24Payment(taxId, formik.values.recipients[taxId].f24.length);
    await formik.setFieldValue(`recipients.${taxId}.f24`, [
      ...formik.values.recipients[taxId].f24,
      newPayment,
    ]);
  };

  const handleRemovePagoPa = async (taxId: string, index: number) => {
    const pagoPaPayments = formik.values.recipients[taxId].pagoPa.filter((_, i) => i !== index);
    await formik.setFieldValue(`recipients.${taxId}.pagoPa`, pagoPaPayments);
  };

  const handleRemoveF24 = async (taxId: string, index: number) => {
    const f24Payments = formik.values.recipients[taxId].f24.filter((_, i) => i !== index);
    await formik.setFieldValue(`recipients.${taxId}.f24`, f24Payments);
  };

  return (
    <Fragment>
      {notification.recipients.map((recipient) => {
        if (recipient.debtPosition === PaymentModel.NOTHING) {
          return <></>;
        }
        return (
          <Paper
            key={recipient.taxId}
            sx={{ padding: '24px', marginTop: '40px' }}
            elevation={0}
            data-testid="paymentForRecipient"
          >
            <Typography variant="h6" fontWeight={700}>
              {t('payment-models')} {recipient.firstName} {recipient.lastName}
            </Typography>

            {formik.values.recipients[recipient.taxId].pagoPa.length > 0 && (
              <Stack
                spacing={3}
                mt={3}
                p={3}
                border={1}
                borderColor="divider"
                borderRadius={1}
                divider={<Divider aria-hidden="true" />}
              >
                <Typography fontSize="16px" fontWeight={600} data-testid="pagoPaPaymentBox">
                  {`${t('pagopa.attach-pagopa-notice')}`}
                </Typography>
                {formik.values.recipients[recipient.taxId].pagoPa.map((pagoPaPayment, index) => (
                  <PagoPaPaymentBox
                    id={`recipients.${recipient.taxId}.pagoPa.${index}`}
                    key={`${recipient.taxId}-pagoPa-${pagoPaPayment.idx}`}
                    onFileUploaded={(file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'pagoPa', index, file, sha256)
                    }
                    onRemoveFile={() => removeFileHandler(recipient.taxId, 'pagoPa', index)}
                    pagoPaPayment={pagoPaPayment}
                    notificationFeePolicy={formik.values.notificationFeePolicy}
                    handleChange={(event) => handleChange(event, recipient.taxId, 'pagoPa', index)}
                    showDeleteButton={index > 0}
                    onDeletePayment={() => handleRemovePagoPa(recipient.taxId, index)}
                    fieldMeta={(fieldName) => formik.getFieldMeta(fieldName)}
                  />
                ))}

                <ButtonNaked
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddNewPagoPa(recipient.taxId)}
                  sx={{ justifyContent: 'start' }}
                >
                  {t('pagopa.add-new-pagopa-notice')}
                </ButtonNaked>
              </Stack>
            )}

            {formik.values.recipients[recipient.taxId].f24.length > 0 && (
              <Stack
                spacing={3}
                mt={3}
                p={3}
                border={1}
                borderColor="divider"
                borderRadius={1}
                divider={<Divider />}
              >
                <Typography fontSize="16px" fontWeight={600} data-testid="f24PaymentBox">
                  {t('f24.attach-f24')}
                </Typography>
                {formik.values.recipients[recipient.taxId].f24.map((f24Payment, index) => (
                  <F24PaymentBox
                    id={`recipients.${recipient.taxId}.f24.${index}`}
                    key={`${recipient.taxId}-f24-${f24Payment?.idx}`}
                    onFileUploaded={(file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'f24', index, file, sha256)
                    }
                    onRemoveFile={() => removeFileHandler(recipient.taxId, 'f24', index)}
                    f24Payment={f24Payment}
                    notificationFeePolicy={formik.values.notificationFeePolicy}
                    handleChange={(event) => handleChange(event, recipient.taxId, 'f24', index)}
                    showDeleteButton={index > 0}
                    onDeletePayment={() => handleRemoveF24(recipient.taxId, index)}
                    fieldMeta={(fieldName) => formik.getFieldMeta(fieldName)}
                  />
                ))}

                <ButtonNaked
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddNewF24(recipient.taxId)}
                  sx={{ justifyContent: 'start' }}
                >
                  {t('f24.add-new-f24')}
                </ButtonNaked>
              </Stack>
            )}
          </Paper>
        );
      })}
    </Fragment>
  );
};

export default PaymentMethods;
