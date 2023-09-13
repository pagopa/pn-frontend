import { useFormik } from 'formik';
import _ from 'lodash';
import { ForwardedRef, Fragment, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Link, Paper, Typography } from '@mui/material';
import { FileUpload, SectionHeading } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDocument,
  PaymentModel,
  PaymentObject,
} from '../../../models/NewNotification';
import { useAppDispatch } from '../../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../../redux/newNotification/actions';
import { setIsCompleted, setPaymentDocuments } from '../../../redux/newNotification/reducers';
import NewNotificationCard from './NewNotificationCard';

type PaymentBoxProps = {
  id: string;
  title: string;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded?: NewNotificationDocument;
};

const PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  title,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
}) => {
  const { t } = useTranslation(['notifiche']);

  return (
    <Fragment>
      <Typography fontWeight={600} sx={{ marginTop: '30px' }} data-testid="paymentBox">
        {title}
      </Typography>
      <FileUpload
        uploadText={t('new-notification.drag-doc')}
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(id, file, sha256)}
        onRemoveFile={() => onRemoveFile(id)}
        sx={{ marginTop: '10px' }}
        calcSha256
        fileUploaded={fileUploaded}
      />
    </Fragment>
  );
};

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
  onPreviousStep?: (step?: number) => void;
  isCompleted: boolean;
  forwardedRef: ForwardedRef<unknown>;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const newPaymentDocument = (id: string, name: string): NewNotificationDocument => ({
  id,
  idx: 0,
  name,
  contentType: 'application/pdf',
  file: emptyFileData,
  ref: {
    key: '',
    versionToken: '',
  },
});

/**
 * @deprecated
 * Last step of the notification creation, where the user configures the payments
 * @returns
 */
const PaymentMethods: React.FC<Props> = ({
  notification,
  onConfirm,
  isCompleted,
  onPreviousStep,
  forwardedRef,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.payment-methods',
  });
  const { t: tc } = useTranslation(['common']);

  const paymentDocumentsExists = !_.isNil(notification.payment) && !_.isEmpty(notification.payment);
  const initialValues = useMemo(
    () =>
      notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
        const recipientPayment = paymentDocumentsExists
          ? (notification.payment as { [key: string]: PaymentObject })[r.taxId]
          : undefined;
        const pagoPaForm = recipientPayment?.pagoPaForm;
        const f24flatRate = recipientPayment?.f24flatRate;
        const f24standard = recipientPayment?.f24standard;
        // eslint-disable-next-line functional/immutable-data
        obj[r.taxId] = {
          pagoPaForm: pagoPaForm
            ? pagoPaForm
            : newPaymentDocument(`${r.taxId}-pagoPaDoc`, t('pagopa-notice')),
        };
        if (notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE) {
          // eslint-disable-next-line functional/immutable-data
          obj[r.taxId].f24flatRate = f24flatRate
            ? f24flatRate
            : newPaymentDocument(`${r.taxId}-f24flatRateDoc`, t('pagopa-notice-f24-flatrate'));
        }
        if (notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24) {
          // eslint-disable-next-line functional/immutable-data
          obj[r.taxId].f24standard = f24standard
            ? f24standard
            : newPaymentDocument(`${r.taxId}-f24standardDoc`, t('pagopa-notice-f24'));
        }
        return obj;
      }, {}),
    []
  );

  const formatPaymentDocuments = () =>
    notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
      const formikPagoPaForm = formik.values[r.taxId].pagoPaForm;
      const formikF24flatRate = formik.values[r.taxId].f24flatRate;
      const formikF24standard = formik.values[r.taxId].f24standard;
      // I avoid including empty file object into the result
      // hence I check for any file object that it actually points to a file
      // (this is the condition XXX.file.data)
      // and then I don't add the payment info for a recipient if it doesn't include any actual file pointer
      // (this is the Object.keys(paymentsForThisRecipient).length > 0 condition below)
      // ---------------------------------------------
      // Carlos Lombardi, 2023.01.10
      const paymentsForThisRecipient: any = {};
      if (formikPagoPaForm.file.data) {
        // eslint-disable-next-line functional/immutable-data
        paymentsForThisRecipient.pagoPaForm = {
          ...newPaymentDocument(`${r.taxId}-pagoPaDoc`, t('pagopa-notice')),
          file: {
            data: formikPagoPaForm.file.data,
            sha256: {
              hashBase64: formikPagoPaForm.file.sha256.hashBase64,
              hashHex: formikPagoPaForm.file.sha256.hashHex,
            },
          },
          ref: {
            key: formikPagoPaForm.ref.key,
            versionToken: formikPagoPaForm.ref.versionToken,
          },
        };
      }
      if (formikF24flatRate?.file.data) {
        // eslint-disable-next-line functional/immutable-data
        paymentsForThisRecipient.f24flatRate = {
          ...newPaymentDocument(`${r.taxId}-f24flatRateDoc`, t('pagopa-notice-f24-flatrate')),
          file: {
            data: formikF24flatRate.file.data,
            sha256: {
              hashBase64: formikF24flatRate.file.sha256.hashBase64,
              hashHex: formikF24flatRate.file.sha256.hashHex,
            },
          },
          ref: {
            key: formikF24flatRate.ref.key,
            versionToken: formikF24flatRate.ref.versionToken,
          },
        };
      }
      if (formikF24standard?.file.data) {
        // eslint-disable-next-line functional/immutable-data
        paymentsForThisRecipient.f24standard = {
          ...newPaymentDocument(`${r.taxId}-f24standardDoc`, t('pagopa-notice-f24')),
          file: {
            data: formikF24standard.file.data,
            sha256: {
              hashBase64: formikF24standard.file.sha256.hashBase64,
              hashHex: formikF24standard.file.sha256.hashHex,
            },
          },
          ref: {
            key: formikF24standard.ref.key,
            versionToken: formikF24standard.ref.versionToken,
          },
        };
      }
      if (Object.keys(paymentsForThisRecipient).length > 0) {
        // eslint-disable-next-line functional/immutable-data
        obj[r.taxId] = paymentsForThisRecipient;
      }
      return obj;
    }, {});

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      dispatch(setPaymentDocuments({ paymentDocuments: formatPaymentDocuments() }));
      onPreviousStep();
    }
  };

  const updateRefAfterUpload = async (paymentPayload: { [key: string]: PaymentObject }) => {
    // set ref
    for (const [taxId, payment] of Object.entries(paymentPayload)) {
      if (payment.pagoPaForm) {
        await formik.setFieldValue(`${taxId}.pagoPaForm.ref`, payment.pagoPaForm.ref, false);
      }
      if (payment.f24standard) {
        await formik.setFieldValue(`${taxId}.f24standard.ref`, payment.f24standard.ref, false);
      }
      if (payment.f24flatRate) {
        await formik.setFieldValue(`${taxId}.f24flatRate.ref`, payment.f24flatRate.ref, false);
      }
    }
  };

  const formIsEmpty = (values: any) => {
    // eslint-disable-next-line functional/no-let
    let isEmpty = true;
    notification.recipients.forEach((recipient) => {
      const currentDocument = values[recipient.taxId];
      if (currentDocument.pagoPaForm && currentDocument.pagoPaForm.file.name !== '') {
        isEmpty = false;
      }
      if (currentDocument.f24flatRate && currentDocument.f24flatRate.file.name !== '') {
        isEmpty = false;
      }
      if (currentDocument.f24standard && currentDocument.f24standard.file.name !== '') {
        isEmpty = false;
      }
    });
    return isEmpty;
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    onSubmit: async (values) => {
      const emptyForm = formIsEmpty(values);
      if (isCompleted) {
        onConfirm();
      } else if (emptyForm || notification.paymentMode === PaymentModel.NOTHING) {
        // Maybe now the form is empty, but in the previous time the user went back
        // from the payments step the form wasn't empty.
        // Just in case, we clean the payment info from the Redux store
        dispatch(setPaymentDocuments({ paymentDocuments: {} }));
        dispatch(setIsCompleted());
      } else {
        // Beware! -
        // Recall that the taxId is the key for the payment document info in the Redux storage.
        // If the user changes the taxId of a recipient and/or deletes a recipient
        // after having attached payment documents,
        // the information related to the "old" taxIds is kept in the Redux store
        // until the user returns to the payment document step.
        // Fortunately, the formatPaymentDocuments function "sanitizes" the payment document info,
        // since it includes the information related to current taxIds only.
        // If the call to formatPaymentDocuments were omitted, then we would probably risk sending
        // garbage to the API call.
        // Please take this note into consideration in case of refactoring of this part.
        // --------------------------------------
        // Carlos Lombardi, 2023.01.19
        const paymentData = await dispatch(
          uploadNotificationPaymentDocument(formatPaymentDocuments())
        );
        const paymentPayload = paymentData.payload as { [key: string]: PaymentObject };
        if (paymentPayload) {
          await updateRefAfterUpload(paymentPayload);
        }
      }
    },
  });

  const fileUploadedHandler = async (
    taxId: string,
    paymentType: 'pagoPaForm' | 'f24flatRate' | 'f24standard',
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldValue(
      id,
      {
        ...formik.values[taxId][paymentType],
        file: { data: file, sha256 },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      false
    );
    await formik.setFieldTouched(`${id}.file`, true, true);
  };

  const removeFileHandler = async (
    id: string,
    taxId: string,
    paymentType: 'pagoPaForm' | 'f24flatRate' | 'f24standard'
  ) => {
    await formik.setFieldValue(id, {
      ...formik.values[taxId][paymentType],
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(setPaymentDocuments({ paymentDocuments: formatPaymentDocuments() }));
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        noPaper
        isContinueDisabled={!formik.isValid}
        submitLabel={tc('button.send')}
        previousStepLabel={t('back-to-attachments')}
        previousStepOnClick={() => handlePreviousStep()}
      >
        {notification.paymentMode !== PaymentModel.NOTHING &&
          notification.recipients.map((recipient) => (
            <Paper key={recipient.taxId} sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
              <SectionHeading>
                {t('payment-models')} {recipient.firstName} {recipient.lastName}
              </SectionHeading>
              <PaymentBox
                id={`${recipient.taxId}.pagoPaForm`}
                title={`${t('attach-pagopa-notice')}`}
                onFileUploaded={(id, file, sha256) =>
                  fileUploadedHandler(recipient.taxId, 'pagoPaForm', id, file, sha256)
                }
                onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'pagoPaForm')}
                fileUploaded={formik.values[recipient.taxId].pagoPaForm}
              />
              {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE && (
                <PaymentBox
                  id={`${recipient.taxId}.f24flatRate`}
                  title={`${t('attach-f24-flatrate')}`}
                  onFileUploaded={(id, file, sha256) =>
                    fileUploadedHandler(recipient.taxId, 'f24flatRate', id, file, sha256)
                  }
                  onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'f24flatRate')}
                  fileUploaded={formik.values[recipient.taxId].f24flatRate}
                />
              )}
              {notification.paymentMode === PaymentModel.PAGO_PA_NOTICE_F24 && (
                <PaymentBox
                  id={`${recipient.taxId}.f24standard`}
                  title={`${t('attach-f24')}`}
                  onFileUploaded={(id, file, sha256) =>
                    fileUploadedHandler(recipient.taxId, 'f24standard', id, file, sha256)
                  }
                  onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'f24standard')}
                  fileUploaded={formik.values[recipient.taxId].f24standard}
                />
              )}
            </Paper>
          ))}
        {notification.paymentMode === PaymentModel.NOTHING && (
          <Paper sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
            <Trans
              i18nKey="nothing"
              components={[
                <Typography key="pre-link" fontWeight={400} fontSize={16} display="inline" />,
                <Link
                  key="go-to-preliminary-infos"
                  color="primary"
                  fontWeight={600}
                  fontSize={16}
                  onClick={() => onPreviousStep && onPreviousStep(0)}
                  sx={{ cursor: 'pointer' }}
                />,
                <Typography key="post-link" fontWeight={400} fontSize={16} display="inline" />,
              ]}
              t={t}
            >
              <Typography fontWeight={400} fontSize={16} display="inline">
                Se questa notifica prevede un pagamento, torna a&nbsp;
              </Typography>
              <Link
                color="primary"
                fontWeight={600}
                fontSize={16}
                onClick={() => onPreviousStep && onPreviousStep(0)}
                sx={{ cursor: 'pointer' }}
              >
                Informazioni preliminari
              </Link>
              <Typography fontWeight={400} fontSize={16} display="inline">
                &nbsp;e seleziona un modello. Poi, torna qui per caricarlo.
              </Typography>
            </Trans>
          </Paper>
        )}
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <PaymentMethods {...props} forwardedRef={ref} />
));
