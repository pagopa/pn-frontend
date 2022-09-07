import { Fragment } from 'react';
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
          onFileUploaded(id, file as Uint8Array, sha256, name, size)
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
  paymentDocumentsData?: { [key: string]: PaymentObject };
};

const PaymentMethods = ({
  notification,
  onConfirm,
  isCompleted,
  onPreviousStep,
  paymentDocumentsData,
}: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche', 'common']);

  const paymentDocumentsExists = paymentDocumentsData;
  const emptyValues = notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
    /* eslint-disable-next-line functional/immutable-data */
    obj[r.taxId] = {
      pagoPaForm: {
        id: `${r.taxId}-pagoPaDoc`,
        idx: 0,
        name: t('new-notification.steps.payment-methods.pagopa-notice'),
        file: {
          uint8Array: undefined,
          sha256: { hashBase64: '', hashHex: '' },
          contentType: 'application/pdf',
          name: '',
          size: 0,
        },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      f24flatRate: {
        id: `${r.taxId}-f24flatRateDoc`,
        idx: 0,
        name: t('new-notification.steps.payment-methods.pagopa-notice-f24-flatrate'),
        file: {
          uint8Array: undefined,
          sha256: { hashBase64: '', hashHex: '' },
          contentType: 'application/pdf',
          name: '',
          size: 0,
        },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      f24standard: {
        id: `${r.taxId}-f24standardDoc`,
        idx: 0,
        name: 'new-notification.steps.payment-methods.pagopa-notice-f24',
        file: {
          uint8Array: undefined,
          sha256: { hashBase64: '', hashHex: '' },
          contentType: 'application/pdf',
          name: '',
          size: 0,
        },
        ref: {
          key: '',
          versionToken: '',
        },
      },
    };
    return obj;
  }, {});

  const initialValues = paymentDocumentsExists
    ? {
        ...paymentDocumentsData,
      }
    : {
        ...emptyValues,
      };

  const formatPaymentDocuments = () =>
    notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
      const formikPagoPaForm = formik.values[r.taxId].pagoPaForm;
      const formikF24flatRate = formik.values[r.taxId].f24flatRate;
      const formikF24standard = formik.values[r.taxId].f24standard;
      // eslint-disable-next-line functional/immutable-data
      obj[r.taxId] = {
        pagoPaForm: {
          id: `${r.taxId}-pagoPaDoc`,
          idx: 0,
          name: t('new-notification.steps.payment-methods.pagopa-notice'),
          file: {
            contentType: formikPagoPaForm.file.contentType,
            uint8Array: formikPagoPaForm.file.uint8Array,
            size: formikPagoPaForm.file.size,
            name: formikPagoPaForm.file.name,
            sha256: {
              hashBase64: formikPagoPaForm.file.sha256.hashBase64,
              hashHex: formikPagoPaForm.file.sha256.hashHex,
            },
          },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        f24flatRate: {
          id: `${r.taxId}-f24flatRateDoc`,
          idx: 0,
          name: t('new-notification.steps.payment-methods.pagopa-notice-f24-flatrate'),
          file: {
            contentType: formikF24flatRate.file.contentType,
            uint8Array: formikF24flatRate.file.uint8Array,
            size: formikF24flatRate.file.size,
            name: formikF24flatRate.file.name,
            sha256: {
              hashBase64: formikF24flatRate.file.sha256.hashBase64,
              hashHex: formikF24flatRate.file.sha256.hashHex,
            },
          },
          ref: {
            key: '',
            versionToken: '',
          },
        },
        f24standard: {
          id: `${r.taxId}-f24standardDoc`,
          idx: 0,
          name: t('new-notification.steps.payment-methods.pagopa-notice-f24'),
          file: {
            contentType: formikF24standard.file.contentType,
            uint8Array: formikF24standard.file.uint8Array,
            size: formikF24standard.file.size,
            name: formikF24standard.file.name,
            sha256: {
              hashBase64: formikF24standard.file.sha256.hashBase64,
              hashHex: formikF24standard.file.sha256.hashHex,
            },
          },
          ref: {
            key: '',
            versionToken: '',
          },
        },
      };
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
    fileUploaded?: any
  ) => {
    await formik.setFieldTouched(id, true, false);
    await formik.setFieldValue(id, {
      size: fileUploaded.size,
      uint8Array: file,
      sha256,
      name: fileUploaded.name,
    });
  };

  const removeFileHandler = async (id: string) => {
    await formik.setFieldValue(id, '');
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        noPaper
        isContinueDisabled={!formik.isValid}
        submitLabel={t('button.send', { ns: 'common' })}
        previousStepLabel={t('new-notification.steps.payment-methods.back-to-attachments')}
        previousStepOnClick={() => handlePreviousStep()}
      >
        {notification.recipients.map((recipient) => (
          <Paper
            key={recipient.taxId}
            sx={{ padding: '24px', marginTop: '40px' }}
            className="paperContainer"
          >
            <Typography variant="h6">
              {t('new-notification.steps.payment-methods.payment-models')} {recipient.firstName} {recipient.lastName}
            </Typography>
            <PaymentBox
              id={`${recipient.taxId}.pagoPaForm.file`}
              title={`${t('new-notification.steps.payment-methods.attach-pagopa-notice')}*`}
              onFileUploaded={fileUploadedHandler}
              onRemoveFile={removeFileHandler}
              fileUploaded={formik.values[recipient.taxId].pagoPaForm}
            />
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE && (
              <PaymentBox
                id={`${recipient.taxId}.f24flatRate.file`}
                title={t('new-notification.steps.payment-methods.attach-f24-flatrate')}
                onFileUploaded={fileUploadedHandler}
                onRemoveFile={removeFileHandler}
                fileUploaded={formik.values[recipient.taxId].f24flatRate}
              />
            )}
            {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24 && (
              <PaymentBox
                id={`${recipient.taxId}.f24standard.file`}
                title={t('new-notification.steps.payment-methods.attach-f24')}
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
