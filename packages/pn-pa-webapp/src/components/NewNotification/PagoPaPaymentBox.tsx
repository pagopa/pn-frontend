import { FieldMetaProps } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationPagoPaPayment, NotificationFeePolicy } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  pagoPaPayment: NewNotificationPagoPaPayment;
  notificationFeePolicy: NotificationFeePolicy;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showDeleteButton: boolean;
  onDeletePayment: () => void;
  fieldMeta: (name: string) => FieldMetaProps<any>;
};

const PagoPaPaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  onFileUploaded,
  onRemoveFile,
  pagoPaPayment,
  notificationFeePolicy,
  handleChange,
  showDeleteButton,
  onDeletePayment,
  fieldMeta,
}) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const isMobile = useIsMobile('md');

  const { noticeCode, creditorTaxId, applyCost, file } = pagoPaPayment;

  const getError = (fieldId: string) => {
    if (fieldMeta(`${id}.${fieldId}`).touched) {
      return fieldMeta(`${id}.${fieldId}`).error;
    }

    return null;
  };

  return (
    <Fragment>
      <FileUpload
        data-testid="fileUploadInput"
        uploadText={
          isMobile ? t('new-notification.drag-doc-mobile') : t('new-notification.drag-doc-pc')
        }
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(id, file, sha256)}
        onRemoveFile={() => onRemoveFile(id)}
        calcSha256
        fileUploaded={{ file }}
        showHashCode={false}
      />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <TextField
          id="noticeCode"
          label={t(
            'new-notification.steps.debt-position-detail.payment-methods.pagopa.notice-code'
          )}
          fullWidth
          name="noticeCode"
          value={noticeCode}
          onChange={handleChange}
          error={!!getError('noticeCode')}
          helperText={getError('noticeCode')}
          size="small"
          margin="normal"
          required
        />
        <TextField
          id="creditorTaxId"
          label={t(
            'new-notification.steps.debt-position-detail.payment-methods.pagopa.creditor-taxid'
          )}
          fullWidth
          name="creditorTaxId"
          value={creditorTaxId}
          onChange={handleChange}
          error={!!getError('creditorTaxId')}
          helperText={getError('creditorTaxId')}
          size="small"
          margin="normal"
          required
        />
      </Stack>

      {(notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE || showDeleteButton) && (
        <Stack direction={isMobile ? 'column' : 'row'}>
          {notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
            <FormControlLabel
              control={
                <Switch
                  id="applyCost"
                  name="applyCost"
                  value={applyCost}
                  checked={applyCost}
                  onChange={(e) => handleChange(e)}
                />
              }
              label={t(
                'new-notification.steps.debt-position-detail.payment-methods.pagopa.apply-cost'
              )}
              componentsProps={{ typography: { fontSize: '16px' } }}
            />
          )}

          {showDeleteButton && (
            <ButtonNaked
              color="primary"
              startIcon={<DeleteIcon />}
              onClick={onDeletePayment}
              sx={{
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                ml: { xs: 'none', md: 'auto' },
              }}
            >
              {t('button.delete', { ns: 'common' })}
            </ButtonNaked>
          )}
        </Stack>
      )}

      {showDeleteButton && notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
        <Alert severity="warning">
          {t('new-notification.steps.debt-position-detail.payment-methods.apply-cost-installment')}
        </Alert>
      )}
    </Fragment>
  );
};

export default PagoPaPaymentBox;
