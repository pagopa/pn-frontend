import { Fragment, useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Paper, Typography } from '@mui/material';
import { FileUpload } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDocument,
  PaymentModel,
  PaymentObject,
} from '../../../models/NewNotification';
import { useAppDispatch } from '../../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../../redux/newNotification/actions';
import { setPaymentDocuments } from '../../../redux/newNotification/reducers';
import NewNotificationCard from './NewNotificationCard';

type PaymentBoxProps = {
  id: string;
  title: string;
  onFileUploaded: (
    id: string,
    file?: Uint8Array,
    sha256?: { hashBase64: string; hashHex: string },
    name?: string,
    size?: number
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded?: NewNotificationDocument;
};

const PaymentBox = ({ id, title, onFileUploaded, onRemoveFile, fileUploaded }: PaymentBoxProps) => {
  const { t } = useTranslation(['notifiche']);

  return (
    <Fragment>
      <Typography fontWeight={600} sx={{ marginTop: '30px' }} data-testid="paymentBox">
        {title}
      </Typography>
      <FileUpload
        uploadText={t('new-notification.drag-doc')}
        accept="application/pdf"
        onFileUploaded={(file, sha256, name, size) =>
          onFileUploaded(`${id}.file`, file as Uint8Array, sha256, name, size)
        }
        onRemoveFile={() => onRemoveFile(id)}
        sx={{ marginTop: '10px' }}
        fileFormat="uint8Array"
        calcSha256
        fileUploaded={fileUploaded}
      />
    </Fragment>
  );
};

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
  onPreviousStep?: () => void;
  isCompleted: boolean;
};

const newPaymentDocument = (id: string, name: string): NewNotificationDocument => ({
  id,
  idx: 0,
  name,
  contentType: 'application/pdf',
  file: {
    uint8Array: undefined,
    sha256: { hashBase64: '', hashHex: '' },
    name: '',
    size: 0,
  },
  ref: {
    key: '',
    versionToken: '',
  },
});

const PaymentMethods = ({ notification, onConfirm, isCompleted, onPreviousStep }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.payment-methods',
  });
  const { t: tc } = useTranslation(['common']);

  const paymentDocumentsExists = !_.isNil(notification.payment) && !_.isEmpty(notification.payment);
  const initialValues = useMemo(() => notification.recipients.reduce(
    (obj: { [key: string]: PaymentObject }, r) => {
      /* eslint-disable functional/immutable-data */
      const recipientPayment = paymentDocumentsExists ? (notification.payment as {[key: string]: PaymentObject})[r.taxId] : undefined;
      const pagoPaForm = recipientPayment?.pagoPaForm;
      const f24flatRate = recipientPayment?.f24flatRate;
      const f24standard = recipientPayment?.f24standard;
      obj[r.taxId] = {
        pagoPaForm: pagoPaForm
          ? pagoPaForm
          : newPaymentDocument(`${r.taxId}-pagoPaDoc`, t('pagopa-notice')),
      };
      if (notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE) {
        obj[r.taxId].f24flatRate = f24flatRate
          ? f24flatRate
          : newPaymentDocument(`${r.taxId}-f24flatRateDoc`, t('pagopa-notice-f24-flatrate'));
      }
      if (notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24) {
        obj[r.taxId].f24standard = f24standard
          ? f24standard
          : newPaymentDocument(`${r.taxId}-f24standardDoc`, t('pagopa-notice-f24'));
      }
      /* eslint-enable functional/immutable-data */
      return obj;
    },
    {}
  ), []);

  const formatPaymentDocuments = () =>
    notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
      const formikPagoPaForm = formik.values[r.taxId].pagoPaForm;
      const formikF24flatRate = formik.values[r.taxId].f24flatRate;
      const formikF24standard = formik.values[r.taxId].f24standard;
      /* eslint-disable functional/immutable-data */
      obj[r.taxId] = {
        pagoPaForm: {
          ...newPaymentDocument(`${r.taxId}-pagoPaDoc`, t('pagopa-notice')),
          file: {
            uint8Array: formikPagoPaForm.file.uint8Array,
            size: formikPagoPaForm.file.size,
            name: formikPagoPaForm.file.name,
            sha256: {
              hashBase64: formikPagoPaForm.file.sha256.hashBase64,
              hashHex: formikPagoPaForm.file.sha256.hashHex,
            },
          },
        },
      };
      if (formikF24flatRate) {
        obj[r.taxId].f24flatRate = {
          ...newPaymentDocument(`${r.taxId}-f24flatRateDoc`, t('pagopa-notice-f24-flatrate')),
          file: {
            uint8Array: formikF24flatRate.file.uint8Array,
            size: formikF24flatRate.file.size,
            name: formikF24flatRate.file.name,
            sha256: {
              hashBase64: formikF24flatRate.file.sha256.hashBase64,
              hashHex: formikF24flatRate.file.sha256.hashHex,
            },
          },
        };
      }
      if (formikF24standard) {
        obj[r.taxId].f24standard = {
          ...newPaymentDocument(`${r.taxId}-f24standardDoc`, t('pagopa-notice-f24')),
          file: {
            uint8Array: formikF24standard.file.uint8Array,
            size: formikF24standard.file.size,
            name: formikF24standard.file.name,
            sha256: {
              hashBase64: formikF24standard.file.sha256.hashBase64,
              hashHex: formikF24standard.file.sha256.hashHex,
            },
          },
        };
      }
      /* eslint-enable functional/immutable-data */
      return obj;
    }, {});

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      dispatch(setPaymentDocuments({ paymentDocuments: formatPaymentDocuments() }));
      onPreviousStep();
    }
  };

  const paymentDocumentSchema = yup.object({
    name: yup.string().required(),
    file: yup.object({
      size: yup.number().required(),
      name: yup.string().required(),
      uint8Array: yup
        .mixed()
        .test((input) => input instanceof Uint8Array)
        .required(),
      sha256: yup
        .object({
          hashBase64: yup.string().required(),
          hashHex: yup.string().required(),
        })
        .required(),
    }),
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
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (isCompleted) {
        onConfirm();
        return;
      }
      await dispatch(uploadNotificationPaymentDocument(values));
    },
  });

  const fileUploadedHandler = async (
    id: string,
    file?: Uint8Array,
    sha256?: { hashBase64: string; hashHex: string },
    name?: string,
    size?: number
  ) => {
    await formik.setFieldTouched(id, true, false);
    await formik.setFieldValue(id, {
      size,
      uint8Array: file,
      sha256,
      name,
    });
  };

  const removeFileHandler = async (id: string) => {
    await formik.setFieldValue(`${id}.ref`, {
      key: '',
      versionToken: '',
    });
    await formik.setFieldValue(`${id}.file`, '');
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        noPaper
        isContinueDisabled={!formik.isValid}
        submitLabel={tc('button.send')}
        previousStepLabel={t('back-to-attachments')}
        previousStepOnClick={() => handlePreviousStep()}
      >
        {notification.recipients.map((recipient) => (
          <Paper
            key={recipient.taxId}
            sx={{ padding: '24px', marginTop: '40px' }}
            className="paperContainer"
          >
            <Typography variant="h6">
              {t('payment-models')} {recipient.firstName} {recipient.lastName}
            </Typography>
            <PaymentBox
              id={`${recipient.taxId}.pagoPaForm`}
              title={`${t('attach-pagopa-notice')}*`}
              onFileUploaded={fileUploadedHandler}
              onRemoveFile={removeFileHandler}
              fileUploaded={formik.values[recipient.taxId].pagoPaForm}
            />
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE && (
              <PaymentBox
                id={`${recipient.taxId}.f24flatRate`}
                title={t('attach-f24-flatrate')}
                onFileUploaded={fileUploadedHandler}
                onRemoveFile={removeFileHandler}
                fileUploaded={formik.values[recipient.taxId].f24flatRate}
              />
            )}
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24 && (
              <PaymentBox
                id={`${recipient.taxId}.f24standard`}
                title={t('attach-f24')}
                onFileUploaded={fileUploadedHandler}
                onRemoveFile={removeFileHandler}
                fileUploaded={formik.values[recipient.taxId].f24standard}
              />
            )}
          </Paper>
        ))}
      </NewNotificationCard>
    </form>
  );
};

export default PaymentMethods;
