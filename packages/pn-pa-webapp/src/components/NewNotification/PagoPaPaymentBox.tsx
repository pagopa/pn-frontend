import { FieldMetaProps } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, FormControlLabel, FormHelperText, Stack, Switch, TextField } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationPagoPaPayment, NotificationFeePolicy } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (file?: File, sha256?: { hashBase64: string; hashHex: string }) => void;
  onRemoveFile: () => void;
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

  const getError = (fieldId: string, shouldBeTouched = true) => {
    if (!shouldBeTouched) {
      return fieldMeta(`${id}.${fieldId}`).error;
    }

    if (fieldMeta(`${id}.${fieldId}`).touched) {
      return fieldMeta(`${id}.${fieldId}`).error;
    }

    return null;
  };

  return (
    <Fragment>
      <FileUpload
        data-testid="pagopa-file-upload-input"
        uploadText={
          isMobile ? t('new-notification.drag-doc-mobile') : t('new-notification.drag-doc-pc')
        }
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(file, sha256)}
        onRemoveFile={() => onRemoveFile()}
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
          data-testid="pagopa-notice-code"
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
          data-testid="pagopa-creditor-tax-id"
        />
      </Stack>

      {(notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE || showDeleteButton) && (
        <Stack direction={isMobile ? 'column' : 'row'}>
          {notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
            <Stack>
              <FormControlLabel
                control={
                  <Switch
                    id="applyCost"
                    name="applyCost"
                    value={applyCost}
                    checked={applyCost}
                    onChange={(e) => handleChange(e)}
                    data-testid="pagopa-apply-cost"
                  />
                }
                label={t(
                  'new-notification.steps.debt-position-detail.payment-methods.pagopa.apply-cost'
                )}
                componentsProps={{ typography: { fontSize: '16px' } }}
              />
              {getError('applyCost', false) && (
                <FormHelperText error>{getError('applyCost', false)}</FormHelperText>
              )}
            </Stack>
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
              data-testid="pagopa-delete-button"
            >
              {t('button.delete', { ns: 'common' })}
            </ButtonNaked>
          )}
        </Stack>
      )}

      {showDeleteButton && notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
        <Alert severity="warning" data-testid="pagopa-installment-alert">
          {t('new-notification.steps.debt-position-detail.payment-methods.apply-cost-installment')}
        </Alert>
      )}
    </Fragment>
  );
};

export default PagoPaPaymentBox;
