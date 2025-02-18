import { useFormik } from 'formik';
import _ from 'lodash';
import { ForwardedRef, Fragment, forwardRef, useImperativeHandle } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Link, Paper, Typography } from '@mui/material';
import { FileUpload, SectionHeading, useIsMobile } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  PaymentModel,
  PaymentObject,
} from '../../models/NewNotification';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../redux/newNotification/actions';
import { setIsCompleted, setPayments } from '../../redux/newNotification/reducers';
import { RootState } from '../../redux/store';
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
  fileUploaded?: NewNotificationPagoPaPayment | NewNotificationF24Payment;
};

const PaymentBox: React.FC<PaymentBoxProps> = ({
  id,
  title,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
}) => {
  const { t } = useTranslation(['notifiche']);
  const isMobile = useIsMobile('md');

  return (
    <Fragment>
      <Typography fontWeight={600} sx={{ marginTop: '30px' }} data-testid="paymentBox">
        {title}
      </Typography>
      <FileUpload
        uploadText={
          isMobile ? t('new-notification.drag-doc-mobile') : t('new-notification.drag-doc-pc')
        }
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
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const posDeb = 'pagopa';
  const newPagopaPaymentDocument = (id: string): NewNotificationPagoPaPayment => ({
    id,
    idx: 0,
    contentType: 'application/pdf',
    file: emptyFileData,
    creditorTaxId: organization.fiscal_code,
    noticeCode: '',
    applyCost: false,
    ref: {
      key: '',
      versionToken: '',
    },
  });
  const newF24PaymentDocument = (id: string, name: string): NewNotificationF24Payment => ({
    id,
    idx: 0,
    contentType: 'application/pdf',
    file: emptyFileData,
    name,
    applyCost: false,
    ref: {
      key: '',
      versionToken: '',
    },
  });
  const initialValues = notification.recipients.map((recipient) => {
    const recipientPayments =
      !_.isNil(recipient.payments) && !_.isEmpty(recipient.payments) ? recipient.payments : [];

    const hasPagoPa = recipientPayments?.some((p) => p.pagoPa);
    const hasF24 = recipientPayments?.some((p) => p.f24);

    // eslint-disable-next-line functional/no-let, prefer-const
    let payments: Array<NewNotificationPayment> = recipientPayments;

    switch (posDeb) {
      case 'pagopa':
        if (!hasPagoPa) {
          // eslint-disable-next-line functional/immutable-data
          payments.push({
            pagoPa: newPagopaPaymentDocument(`${recipient.taxId}-pagoPaDoc`),
          });
        }
        break;
      case 'f24':
        if (!hasF24) {
          // eslint-disable-next-line functional/immutable-data
          payments.push({
            f24: newF24PaymentDocument(`${recipient.taxId}-f24standardDoc`, t('pagopa-notice-f24')),
          });
        }
        break;
      case 'f24 + pagopa':
        if (!hasF24 && !hasPagoPa) {
          // eslint-disable-next-line functional/immutable-data
          payments.push({
            pagoPa: newPagopaPaymentDocument(`${recipient.taxId}-pagoPaDoc`),
            f24: newF24PaymentDocument(`${recipient.taxId}-f24standardDoc`, t('pagopa-notice-f24')),
          });
          return;
        }
        if (!hasF24) {
          // eslint-disable-next-line functional/immutable-data
          payments.push({
            f24: newF24PaymentDocument(`${recipient.taxId}-f24standardDoc`, t('pagopa-notice-f24')),
          });
        }
        if (!hasPagoPa) {
          // eslint-disable-next-line functional/immutable-data
          payments.push({
            pagoPa: newPagopaPaymentDocument(`${recipient.taxId}-pagoPaDoc`),
          });
        }
        break;
      default:
        break;
    }

    console.log(initialValues);
    return {
      [recipient.taxId]: payments,
    };
  });

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      dispatch(setPayments({ recipients: notification.recipients }));
      onPreviousStep();
    }
  };

  const updateRefAfterUpload = async (paymentPayload: { [key: string]: PaymentObject }) => {
    // set ref
    for (const [taxId, payment] of Object.entries(paymentPayload)) {
      if (payment.pagoPa) {
        await formik.setFieldValue(`${taxId}.pagoPaForm.ref`, payment.pagoPa.ref, false);
      }
      if (payment.f24) {
        await formik.setFieldValue(`${taxId}.f24standard.ref`, payment.f24.ref, false);
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
        // dispatch(setPayments({ paymentDocuments: {} }));
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
          uploadNotificationPaymentDocument(notification.recipients)
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
    paymentType: 'pagoPa' | 'f24',
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldValue(
      id,
      {
        ...formik.values.find((v) => v && v[taxId])?.[paymentType],
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

  const removeFileHandler = async (id: string, taxId: string, paymentType: 'pagoPa' | 'f24') => {
    await formik.setFieldValue(id, {
      ...formik.values.find((v) => v && v[taxId])?.[paymentType],
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(setPayments({ recipients: notification.recipients }));
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="paymentMethodForm">
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
              {recipient.payments &&
                recipient.payments.map((_payment, index) =>
                  notification.paymentMode === PaymentModel.PAGO_PA_NOTICE ? (
                    <PaymentBox
                      key={`${recipient.taxId}-payment-${index}`}
                      id={`${recipient.taxId}.pagoPa`}
                      title={`${t('attach-pagopa-notice')}`}
                      onFileUploaded={(id, file, sha256) =>
                        fileUploadedHandler(recipient.taxId, 'pagoPa', id, file, sha256)
                      }
                      onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'pagoPa')}
                      fileUploaded={formik.values.find((v) => v && v[recipient.taxId])?.pagoPa.}
                    />
                  ) : (
                    <PaymentBox
                      id={`${recipient.taxId}.f24`}
                      title={`${t('attach-f24')}`}
                      onFileUploaded={(id, file, sha256) =>
                        fileUploadedHandler(recipient.taxId, 'f24', id, file, sha256)
                      }
                      onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'f24')}
                      fileUploaded={formik.values[recipient.taxId]?.f24}
                    />
                  )
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
