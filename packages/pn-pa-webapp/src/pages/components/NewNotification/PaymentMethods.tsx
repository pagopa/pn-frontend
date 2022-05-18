import { useFormik } from 'formik';
import { Fragment } from 'react';
import * as yup from 'yup';
import _ from 'lodash';
import { Paper, Typography } from '@mui/material';
import { FileUpload } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, UploadPayementParams, PaymentModel } from '../../../models/newNotification';
import { useAppDispatch } from '../../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../../redux/newNotification/actions';
import NewNotificationCard from './NewNotificationCard';

type PaymentBoxProps = {
  id: string;
  title: string;
  onFileUploaded: (
    id: string,
    fileBase64?: string,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
};

const PaymentBox = ({ id, title, onFileUploaded, onRemoveFile }: PaymentBoxProps) => (
  <Fragment>
    <Typography fontWeight={600} sx={{ marginTop: '30px' }} data-testid="paymentBox">
      {title}
    </Typography>
    <FileUpload
      uploadText="Trascina qui il documento"
      accept="application/pdf"
      onFileUploaded={(_file, fileBase64, sha256) => onFileUploaded(id, fileBase64, sha256)}
      onRemoveFile={() => onRemoveFile(id)}
      sx={{ marginTop: '10px' }}
      calcBase64
      calcSha256
    />
  </Fragment>
);

type PaymentDocument = {
  name: string;
  file: {
    base64: string;
    sha256: { hashBase64: string; hashHex: string };
  };
};

type PaymentObject = {
  pagoPaForm: PaymentDocument;
  f24flatRate: PaymentDocument;
  f24standard: PaymentDocument;
};

type Props = {
  notification: NewNotificationFe;
  onConfirm: () => void;
};

const PaymentMethods = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();

  const paymentDocumentSchema = yup.object({
    name: yup.string().required(),
    file: yup.object({
      base64: yup.string().required(),
      sha256: yup
        .object({
          hashBase64: yup.string().required(),
          hashHex: yup.string().required(),
        })
        .required(),
    })
  });

  const validationSchema = yup.lazy((obj) =>
    yup.object(
      _.mapValues(obj, () =>
        yup.object({
          pagoPaForm: paymentDocumentSchema.required(),
        })
      )
    )
  );

  const formik = useFormik({
    initialValues: notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
      /* eslint-disable-next-line functional/immutable-data */
      obj[r.taxId] = {
        pagoPaForm: {
          name: 'Avviso pagoPA',
          file: { base64: '', sha256: { hashBase64: '', hashHex: '' } },
        },
        f24flatRate: {
          name: 'F24 forfettario',
          file: { base64: '', sha256: { hashBase64: '', hashHex: '' } },
        },
        f24standard: { name: 'F24', file: { base64: '', sha256: { hashBase64: '', hashHex: '' } } },
      };
      return obj;
    }, {}),
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      const valuesToSend: UploadPayementParams = {};
      const getSingleValueToSend = (value: PaymentDocument) => ({
        key: value.name,
        fileBase64: value.file.base64,
        sha256: value.file.sha256.hashBase64,
        contentType: 'application/pdf',
      });
      for (const [key, value] of Object.entries(values)) {
        /* eslint-disable-next-line functional/immutable-data */
        valuesToSend[key] = {
          pagoPaForm: getSingleValueToSend(value.pagoPaForm),
          f24flatRate: getSingleValueToSend(value.f24flatRate),
          f24standard: getSingleValueToSend(value.f24standard),
        };
      }
      dispatch(uploadNotificationPaymentDocument(valuesToSend))
        .unwrap()
        .then(() => {
          onConfirm();
        })
        .catch(() => {});
    },
  });

  const fileUploadedHandler = async (
    id: string,
    fileBase64?: string,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldTouched(id, true, false);
    await formik.setFieldValue(id, { base64: fileBase64, sha256 });
  };

  const removeFileHandler = async (id: string) => {
    await formik.setFieldValue(id, '');
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard noPaper isContinueDisabled={!formik.isValid}>
        {notification.recipients.map((recipient) => (
          <Paper
            key={recipient.taxId}
            sx={{ padding: '24px', marginTop: '40px' }}
            className="paperContainer"
          >
            <Typography variant="h6">Modelli di pagamento per {recipient.denomination}</Typography>
            <PaymentBox
              id={`${recipient.taxId}.pagoPaForm.file`}
              title="Allega Avviso pagoPA*"
              onFileUploaded={fileUploadedHandler}
              onRemoveFile={removeFileHandler}
            />
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE && (
              <PaymentBox
                id={`${recipient.taxId}.f24flatRate.file`}
                title="Allega Modello F24 forfettario"
                onFileUploaded={fileUploadedHandler}
                onRemoveFile={removeFileHandler}
              />
            )}
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24 && (
              <PaymentBox
                id={`${recipient.taxId}.f24standard.file`}
                title="Allega Modello F24"
                onFileUploaded={fileUploadedHandler}
                onRemoveFile={removeFileHandler}
              />
            )}
          </Paper>
        ))}
      </NewNotificationCard>
    </form>
  );
};

export default PaymentMethods;
