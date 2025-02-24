import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, TextField } from '@mui/material';
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
  senderTaxId: string;
  noticeCode?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PagoPaPaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
  senderTaxId,
  noticeCode,
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
        calcSha256
        fileUploaded={fileUploaded}
        showHashCode={false}
      />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <TextField
          id="noticeCode"
          label="Codice avviso"
          fullWidth
          name="noticeCode"
          value={noticeCode}
          onChange={handleChange}
          // error={Boolean(formik.errors.senderDenomination)}
          // helperText={formik.errors.senderDenomination}
          size="small"
          margin="normal"
        />
        <TextField
          id="creditorTaxId"
          label="Codice fiscale ente creditore*"
          fullWidth
          name="creditorTaxId"
          value={senderTaxId}
          onChange={handleChange}
          // error={Boolean(formik.errors.senderDenomination)}
          // helperText={formik.errors.senderDenomination}
          size="small"
          margin="normal"
        />
      </Stack>
    </Fragment>
  );
};

export default PagoPaPaymentBox;
