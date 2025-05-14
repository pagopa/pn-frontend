import { FieldMetaProps } from 'formik';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  FormControlLabel,
  FormHelperText,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationF24Payment, NotificationFeePolicy } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (file?: File, sha256?: { hashBase64: string; hashHex: string }) => void;
  onRemoveFile: () => void;
  f24Payment: NewNotificationF24Payment;
  notificationFeePolicy: NotificationFeePolicy;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showDeleteButton: boolean;
  onDeletePayment: () => void;
  fieldMeta: (name: string) => FieldMetaProps<any>;
  hasFieldError: (field: string) => boolean;
};

const F24PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  onFileUploaded,
  onRemoveFile,
  f24Payment,
  notificationFeePolicy,
  handleChange,
  showDeleteButton,
  onDeletePayment,
  fieldMeta,
  hasFieldError,
}) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const isMobile = useIsMobile('md');

  const { name, applyCost, file } = f24Payment;

  const getError = (fieldId: string, shouldBeTouched = true) => {
    if (!shouldBeTouched) {
      return fieldMeta(`${id}.${fieldId}`).error;
    }

    if (hasFieldError(`${id}.${fieldId}`)) {
      return fieldMeta(`${id}.${fieldId}`).error;
    }

    return undefined;
  };

  return (
    <Box data-testid={id}>
      <FileUpload
        uploadText={
          isMobile
            ? t('new-notification.drag-doc-mobile')
            : t('new-notification.drag-doc-with-format-pc', { type: '.json' })
        }
        accept="application/json"
        onFileUploaded={(file, sha256) => onFileUploaded(file, sha256)}
        onRemoveFile={() => onRemoveFile()}
        sx={{ marginTop: '10px' }}
        calcSha256
        fileUploaded={{ file }}
        showHashCode={false}
        externalError={
          fieldMeta(`${id}.file`).touched || fieldMeta(`${id}.file.data`).value
            ? getError('file.sha256.hashBase64', false)
            : undefined
        }
      />

      <TextField
        id="name"
        label={t('new-notification.steps.debt-position-detail.payment-methods.f24.document-name')}
        fullWidth
        name="name"
        value={name}
        onChange={handleChange}
        error={!!getError('name')}
        helperText={getError('name')}
        size="small"
        margin="normal"
        required
        data-testid="f24-name"
        sx={{ mt: 3 }}
      />

      {(notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE || showDeleteButton) && (
        <Stack direction={isMobile ? 'column' : 'row'} mt={2}>
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
                    data-testid="f24-apply-cost"
                    sx={{ margin: 2 }}
                    color={getError('applyCost', false) ? 'error' : 'primary'}
                  />
                }
                label={t(
                  'new-notification.steps.debt-position-detail.payment-methods.f24.apply-cost'
                )}
                componentsProps={{ typography: { fontSize: '16px' } }}
              />
              {getError('applyCost', false) && (
                <FormHelperText data-testid="applyCost-helper-text" error>
                  {getError('applyCost', false)}
                </FormHelperText>
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
              data-testid="f24-delete-button"
            >
              {t('button.delete', { ns: 'common' })}
            </ButtonNaked>
          )}
        </Stack>
      )}

      {showDeleteButton && notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
        <Alert severity="warning" sx={{ mt: 4 }} data-testid="f24-installment-alert">
          {t('new-notification.steps.debt-position-detail.payment-methods.apply-cost-installment')}
        </Alert>
      )}
    </Box>
  );
};

export default F24PaymentBox;
