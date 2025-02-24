import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';

import { NewNotificationDocumentFile } from '../../models/NewNotification';

type PaymentBoxProps = {
  id: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded: { file: NewNotificationDocumentFile };
  name: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const F24PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
  name,
  handleChange,
}) => {
  const { t } = useTranslation(['notifiche']);
  const isMobile = useIsMobile('md');

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
        fileUploaded={fileUploaded}
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
    </Fragment>
  );
};

export default F24PaymentBox;
