import { useFormik } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  NewNotification,
  PaymentMethodsFormValues,
  PaymentModel,
} from '../../models/NewNotification';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { newF24Payment, newPagopaPayment } from '../../utility/notification.utility';
import F24PaymentBox from './F24PaymentBox';
import PagoPaPaymentBox from './PagoPaPaymentBox';

type Props = {
  notification: NewNotification;
  formik: ReturnType<typeof useFormik<PaymentMethodsFormValues>>;
  hasFieldError: (field: string) => boolean;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const PaymentMethods: React.FC<Props> = ({ notification, formik, hasFieldError }) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail.payment-methods',
  });
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const fileUploadedHandler = async (
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    const payment = formik.values.recipients[taxId][paymentType][index];
    await formik.setFieldTouched(`recipients.${taxId}.${paymentType}.${index}.file`, true, false);
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
      true
    );
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
    const newPayment = newPagopaPayment(
      taxId,
      formik.values.recipients[taxId].pagoPa.length,
      organization.fiscal_code
    );
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

  const handleRemovePayment = async (
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number
  ) => {
    const updatedPayments = formik.values.recipients[taxId][paymentType].filter(
      (_, i) => i !== index
    );
    await formik.setFieldTouched(`recipients.${taxId}.${paymentType}.${index}`, false);
    await formik.setFieldValue(`recipients.${taxId}.${paymentType}`, updatedPayments);
  };

  return (
    <Fragment>
      {notification.recipients.map((recipient) => {
        if (recipient.debtPosition === PaymentModel.NOTHING) {
          return <></>;
        }
        const recipientKey = `${recipient.recipientType}-${recipient.taxId}`;
        return (
          <Paper
            key={recipientKey}
            sx={{ padding: '24px', marginTop: '40px' }}
            elevation={0}
            data-testid={`${recipient.taxId}-payments`}
          >
            <Typography variant="h6" fontWeight={700}>
              {t('payment-models')} {recipient.firstName} {recipient.lastName}
            </Typography>

            {formik.values.recipients[recipientKey].pagoPa.length > 0 && (
              <Box
                mt={3}
                p={3}
                border={1}
                borderColor="divider"
                borderRadius={1}
                data-testid={`${recipient.taxId}-pagopa-payment-box`}
              >
                <Typography fontSize="16px" fontWeight={600} data-testid="pagoPaPaymentBox">
                  {`${t('pagopa.attach-pagopa-notice')}`}
                </Typography>
                <Stack mt={3} divider={<Divider sx={{ my: 3 }} />}>
                  {formik.values.recipients[recipientKey].pagoPa.map((pagoPaPayment, index) => (
                    <PagoPaPaymentBox
                      id={`recipients.${recipientKey}.pagoPa.${index}`}
                      key={`${recipientKey}-pagoPa-${pagoPaPayment.idx}`}
                      onFileUploaded={(file, sha256) =>
                        fileUploadedHandler(recipientKey, 'pagoPa', index, file, sha256)
                      }
                      onRemoveFile={() => removeFileHandler(recipientKey, 'pagoPa', index)}
                      pagoPaPayment={pagoPaPayment}
                      notificationFeePolicy={formik.values.notificationFeePolicy}
                      handleChange={(event) => handleChange(event, recipientKey, 'pagoPa', index)}
                      showDeleteButton={index > 0}
                      onDeletePayment={() => handleRemovePayment(recipientKey, 'pagoPa', index)}
                      fieldMeta={(fieldName) => formik.getFieldMeta(fieldName)}
                      hasFieldError={hasFieldError}
                    />
                  ))}

                  <ButtonNaked
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddNewPagoPa(recipientKey)}
                    sx={{ justifyContent: 'start' }}
                    data-testid="add-new-pagopa"
                  >
                    {t('pagopa.add-new-pagopa-notice')}
                  </ButtonNaked>
                </Stack>
              </Box>
            )}

            {formik.values.recipients[recipientKey].f24.length > 0 && (
              <Box
                mt={3}
                p={3}
                border={1}
                borderColor="divider"
                borderRadius={1}
                data-testid={`${recipient.taxId}-f24-payment-box`}
              >
                <Typography fontSize="16px" fontWeight={600} data-testid="f24PaymentBox">
                  {t('f24.attach-f24')}
                </Typography>
                <Stack mt={3} divider={<Divider sx={{ my: 3 }} aria-hidden="true" />}>
                  {formik.values.recipients[recipientKey].f24.map((f24Payment, index) => (
                    <F24PaymentBox
                      id={`recipients.${recipientKey}.f24.${index}`}
                      key={`${recipientKey}-f24-${f24Payment?.idx}`}
                      onFileUploaded={(file, sha256) =>
                        fileUploadedHandler(recipientKey, 'f24', index, file, sha256)
                      }
                      onRemoveFile={() => removeFileHandler(recipientKey, 'f24', index)}
                      f24Payment={f24Payment}
                      notificationFeePolicy={formik.values.notificationFeePolicy}
                      handleChange={(event) => handleChange(event, recipientKey, 'f24', index)}
                      showDeleteButton={index > 0}
                      onDeletePayment={() => handleRemovePayment(recipientKey, 'f24', index)}
                      fieldMeta={(fieldName) => formik.getFieldMeta(fieldName)}
                      hasFieldError={hasFieldError}
                    />
                  ))}

                  <ButtonNaked
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddNewF24(recipientKey)}
                    sx={{ justifyContent: 'start' }}
                    data-testid="add-new-f24"
                  >
                    {t('f24.add-new-f24')}
                  </ButtonNaked>
                </Stack>
              </Box>
            )}
          </Paper>
        );
      })}
    </Fragment>
  );
};

export default PaymentMethods;
