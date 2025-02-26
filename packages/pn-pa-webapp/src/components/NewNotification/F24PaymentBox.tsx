import { FieldMetaProps } from 'formik';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationF24Payment, NotificationFeePolicy } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  f24Payment: NewNotificationF24Payment;
  notificationFeePolicy: NotificationFeePolicy;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showDeleteButton: boolean;
  onDeletePayment: () => void;
  fieldMeta: (name: string) => FieldMetaProps<any>;
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
}) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const isMobile = useIsMobile('md');

  const { name, applyCost, file } = f24Payment;

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
        sx={{ marginTop: '10px' }}
        calcSha256
        fileUploaded={{ file }}
        showHashCode={false}
      />

      <TextField
        id="name"
        label={t('new-notification.steps.payment-methods.f24.document-name')}
        fullWidth
        name="name"
        value={name}
        onChange={handleChange}
        error={!!getError('name')}
        helperText={getError('name')}
        size="small"
        margin="normal"
      />

      {(notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE || showDeleteButton) && (
        <Stack direction={isMobile ? 'column' : 'row'}>
          {notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE && (
            <FormControlLabel
              control={
                <Switch
                  id="applyCost"
                  name="applyCost"
                  value={applyCost}
                  onChange={(e) => handleChange(e)}
                />
              }
              label={t('new-notification.steps.payment-methods.pagopa.apply-cost')}
              componentsProps={{ typography: { fontSize: '16px' } }}
            />
          )}

          {showDeleteButton && (
            <ButtonNaked
              color="primary"
              startIcon={<DeleteIcon />}
              onClick={onDeletePayment}
              sx={{ justifyContent: 'end' }}
            >
              {t('button.delete', { ns: 'common' })}
            </ButtonNaked>
          )}
        </Stack>
      )}
    </Fragment>
  );
};

export default F24PaymentBox;
