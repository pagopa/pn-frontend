import { FormikProps } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack, TextField, Typography } from '@mui/material';
import { FileUpload, SectionHeading, useIsMobile } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDocumentFile,
  NewNotificationPayment,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
} from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  title: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded: { file: NewNotificationDocumentFile };
  senderTaxId: string;
  noticeCode?: string;
};

const PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  title,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
  senderTaxId,
  noticeCode,
}) => {
  const { t } = useTranslation(['notifiche']);
  const isMobile = useIsMobile('md');

  return (
    <Fragment>
      <Typography fontWeight={600} sx={{ marginTop: '30px' }} data-testid="paymentBox">
        {title}
      </Typography>
      <FileUpload
        data-testid="fileUploadInput"
        uploadText={
          isMobile ? t('new-notification.drag-doc-mobile') : t('new-notification.drag-doc-pc')
        }
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(id, file, sha256)}
        onRemoveFile={() => onRemoveFile(id)}
        sx={{ marginTop: '10px' }}
        calcSha256
        fileUploaded={fileUploaded}
        showHashCode={false}
      />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ marginTop: '10px' }}>
        <TextField
          id="noticeCode"
          label="Codice avviso"
          fullWidth
          name="noticeCode"
          value={noticeCode}
          // onChange={handleChangeTouched}
          // error={Boolean(formik.errors.senderDenomination)}
          // helperText={formik.errors.senderDenomination}
          size="small"
          margin="normal"
        />
        <TextField
          label="Codice fiscale ente creditore*"
          fullWidth
          name="creditorTaxId"
          value={senderTaxId}
          // onChange={handleChangeTouched}
          // error={Boolean(formik.errors.senderDenomination)}
          // helperText={formik.errors.senderDenomination}
          size="small"
          margin="normal"
        />
      </Stack>
    </Fragment>
  );
};

type FormValues = {
  notificationFeePolicy: NotificationFeePolicy;
  paFee: number | undefined;
  vat: number | undefined;
  pagoPaIntMode: PagoPaIntegrationMode | undefined;
  recipients: {
    [x: string]: Array<NewNotificationPayment>;
  };
};

type Props = {
  notification: NewNotification;
  formik: FormikProps<FormValues>;
};
const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const PaymentMethods: React.FC<Props> = ({ notification, formik }) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.payment-methods',
  });

  const fileUploadedHandler = async (
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number,
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    formik.setFieldValue(
      id,
      {
        ...formik.values.recipients[taxId][index][paymentType],
        file: { data: file, sha256 },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      false
    );
    formik.setFieldTouched(`${id}.file`, true, true);
  };

  const removeFileHandler = async (
    id: string,
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number
  ) => {
    formik.setFieldValue(id, {
      ...formik.values.recipients[taxId][index][paymentType],
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  // useImperativeHandle(forwardedRef, () => ({
  //   confirm() {
  //     dispatch(setPayments({ recipients: formatPayments() }));
  //   },
  // }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="paymentMethodForm">
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
          {formik.values.recipients[recipient.taxId] &&
            formik.values.recipients[recipient.taxId].map((payment, index) => {
              if (payment.pagoPa) {
                return (
                  <PaymentBox
                    key={`${recipient.taxId}-pagoPa-${payment.pagoPa.idx}`}
                    id={`${recipient.taxId}.${index}.pagoPa`}
                    title={`${t('attach-pagopa-notice')}`}
                    onFileUploaded={(id, file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'pagoPa', index, id, file, sha256)
                    }
                    onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'pagoPa', index)}
                    fileUploaded={payment.pagoPa}
                    senderTaxId={payment.pagoPa.creditorTaxId}
                    noticeCode={payment.pagoPa.noticeCode}
                  />
                );
              }
              if (payment.f24) {
                return (
                  <PaymentBox
                    key={`${recipient.taxId}-f24-${payment.f24.idx}`}
                    id={`${recipient.taxId}.${index}.f24`}
                    title={`${t('attach-f24')}`}
                    onFileUploaded={(id, file, sha256) =>
                      fileUploadedHandler(recipient.taxId, 'f24', index, id, file, sha256)
                    }
                    onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'f24', index)}
                    fileUploaded={payment.f24}
                    senderTaxId={notification.senderTaxId}
                  />
                );
              }
              return <></>;
            })}
        </Paper>
      ))}
    </form>
  );
};

export default PaymentMethods;
