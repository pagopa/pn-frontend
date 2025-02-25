import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationF24Payment } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  f24Payment: NewNotificationF24Payment;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showDeleteButton: boolean;
  onDeletePayment: () => void;
};

const F24PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  onFileUploaded,
  onRemoveFile,
  f24Payment,
  handleChange,
  showDeleteButton,
  onDeletePayment,
}) => {
  const { t } = useTranslation(['notifiche', 'common']);
  const isMobile = useIsMobile('md');

  const { name, file } = f24Payment;

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
        label="Titolo documento*"
        fullWidth
        name="name"
        value={name}
        onChange={handleChange}
        // error={Boolean(formik.errors.senderDenomination)}
        // helperText={formik.errors.senderDenomination}
        size="small"
        margin="normal"
      />

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
    </Fragment>
  );
};

export default F24PaymentBox;
