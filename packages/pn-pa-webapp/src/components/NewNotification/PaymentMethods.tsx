import { FormikProps } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { SectionHeading } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  NewNotification,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
} from '../../models/NewNotification';
import F24PaymentBox from './F24PaymentBox';
import PagoPaPaymentBox from './PagoPaPaymentBox';

type FormValues = {
  notificationFeePolicy: NotificationFeePolicy;
  paFee: number | undefined;
  vat: number | undefined;
  pagoPaIntMode: PagoPaIntegrationMode | undefined;
  recipients: {
    [taxId: string]: {
      pagoPa: Array<NewNotificationPagoPaPayment>;
      f24: Array<NewNotificationF24Payment>;
    };
  };
};

type Props = {
  notification: NewNotification;
  formik: FormikProps<FormValues>;
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
    keyPrefix: 'new-notification.steps.payment-methods',
  });

  const fileUploadedHandler = async (
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    const payment = formik.values.recipients[taxId][paymentType][index];

    formik.setFieldValue(
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
    formik.setFieldTouched(`recipients.${taxId}.${paymentType}.${index}.file`, true, true);
  };

  const removeFileHandler = async (taxId: string, paymentType: 'pagoPa' | 'f24', index: number) => {
    const payment = formik.values.recipients[taxId][paymentType][index];

    formik.setFieldValue(`recipients.${taxId}.${paymentType}.${index}`, {
      ...payment,
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    paymentIndex: number
  ) => {
    formik.setFieldValue(
      `recipients.${taxId}.${paymentType}.${paymentIndex}.${event.target.name}`,
      event.target.value
    );
  };

  const handleAddNewPagoPa = (taxId: string) => {
    const newPayment = newPagopaPayment(taxId, formik.values.recipients[taxId].pagoPa.length);
    formik.setFieldValue(`recipients.${taxId}.pagoPa`, [
      ...formik.values.recipients[taxId].pagoPa,
      newPayment,
    ]);
  };

  const handleAddNewF24 = (taxId: string) => {
    const newPayment = newF24Payment(taxId, formik.values.recipients[taxId].f24.length);
    formik.setFieldValue(`recipients.${taxId}.f24`, [
      ...formik.values.recipients[taxId].f24,
      newPayment,
    ]);
  };

  const handleRemovePagoPa = (taxId: string, index: number) => {
    const pagoPaPayments = formik.values.recipients[taxId].pagoPa.filter((_, i) => i !== index);
    formik.setFieldValue(`recipients.${taxId}.pagoPa`, pagoPaPayments);
  };

  const handleRemoveF24 = (taxId: string, index: number) => {
    const f24Payments = formik.values.recipients[taxId].f24.filter((_, i) => i !== index);
    formik.setFieldValue(`recipients.${taxId}.f24`, f24Payments);
  };

  return (
    <Fragment>
      {notification.recipients.map((recipient) => (
        <Paper
          key={recipient.taxId}
          sx={{ padding: '24px', marginTop: '40px' }}
          elevation={0}
          data-testid="paymentForRecipient"
        >
          <SectionHeading>
            {t('payment-models')} {recipient.firstName} {recipient.lastName}
          </SectionHeading>

          {formik.values.recipients[recipient.taxId].pagoPa.length > 0 && (
            <Stack
              spacing={3}
              mt={3}
              p={3}
              border={1}
              borderColor="divider"
              borderRadius={1}
              divider={<Divider />}
            >
              <Typography fontSize="16px" fontWeight={600} data-testid="pagoPaPaymentBox">
                {`${t('attach-pagopa-notice')}`}
              </Typography>
              {formik.values.recipients[recipient.taxId].pagoPa.map((pagoPaPayment, index) => (
                <>
                  <PagoPaPaymentBox
                    id={`${recipient.taxId}.${index}.pagoPa`}
                    key={`${recipient.taxId}-pagoPa-${pagoPaPayment.idx}`}
                    onFileUploaded={(_, file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'pagoPa', index, file, sha256)
                    }
                    onRemoveFile={() => removeFileHandler(recipient.taxId, 'pagoPa', index)}
                    fileUploaded={pagoPaPayment}
                    senderTaxId={pagoPaPayment.creditorTaxId ?? ''}
                    noticeCode={pagoPaPayment.noticeCode}
                    handleChange={(event) => handleChange(event, recipient.taxId, 'pagoPa', index)}
                  />
                  {index > 0 && (
                    <ButtonNaked
                      color="primary"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemovePagoPa(recipient.taxId, index)}
                      sx={{ justifyContent: 'end' }}
                    >
                      {t('remove-payment')}
                    </ButtonNaked>
                  )}
                </>
              ))}

              <ButtonNaked
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewPagoPa(recipient.taxId)}
                sx={{ justifyContent: 'start' }}
              >
                {t('add-new-pagopa-notice')}
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
                {t('attach-f24')}
              </Typography>
              {formik.values.recipients[recipient.taxId].f24.map((f24Payment, index) => (
                <>
                  <F24PaymentBox
                    id={`${recipient.taxId}.${index}.f24`}
                    key={`${recipient.taxId}-f24-${f24Payment?.idx}`}
                    onFileUploaded={(_, file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'f24', index, file, sha256)
                    }
                    onRemoveFile={() => removeFileHandler(recipient.taxId, 'f24', index)}
                    fileUploaded={f24Payment}
                    name={f24Payment?.name ?? ''}
                    handleChange={(event) => handleChange(event, recipient.taxId, 'f24', index)}
                  />
                  {index > 0 && (
                    <ButtonNaked
                      color="primary"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveF24(recipient.taxId, index)}
                      sx={{ justifyContent: 'end' }}
                    >
                      {t('remove-payment')}
                    </ButtonNaked>
                  )}
                </>
              ))}

              <ButtonNaked
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewF24(recipient.taxId)}
                sx={{ justifyContent: 'start' }}
              >
                {t('add-new-f24')}
              </ButtonNaked>
            </Stack>
          )}
        </Paper>
      ))}
    </Fragment>
  );
};

export default PaymentMethods;
