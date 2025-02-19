import { useFormik } from 'formik';
import _ from 'lodash';
import { ForwardedRef, Fragment, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Typography } from '@mui/material';
import { FileUpload, SectionHeading, useIsMobile } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationDocumentFile,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  NewNotificationRecipient,
  PaymentObject,
} from '../../models/NewNotification';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../redux/newNotification/actions';
import { setPayments } from '../../redux/newNotification/reducers';
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
  fileUploaded: { file: NewNotificationDocumentFile };
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

  const newPagopaPayment = (id: string, idx: number): NewNotificationPagoPaPayment => ({
    id,
    idx,
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
  const newF24Payment = (id: string, idx: number): NewNotificationF24Payment => ({
    id,
    idx,
    contentType: 'application/json',
    file: emptyFileData,
    name: '',
    applyCost: false,
    ref: {
      key: '',
      versionToken: '',
    },
  });
  const initialValues = useMemo(
    () =>
      notification.recipients.reduce(
        (acc: { [taxId: string]: Array<NewNotificationPayment> }, recipient) => {
          const recipientPayments = !_.isNil(recipient.payments) ? recipient.payments : [];

          const hasPagoPa = recipientPayments.some((p) => p.pagoPa);
          const hasF24 = recipientPayments.some((p) => p.f24);

          // eslint-disable-next-line prefer-const, functional/no-let
          let payments: Array<NewNotificationPayment> = [...recipientPayments];
          // eslint-disable-next-line prefer-const, functional/no-let
          let posDeb = 'f24pagopa';

          /* eslint-disable functional/immutable-data */
          if ((posDeb === 'pagopa' || posDeb === 'f24pagopa') && !hasPagoPa) {
            const lastPaymentIdx = payments[payments.length - 1]?.pagoPa?.idx ?? -1;
            const newPaymentIdx = lastPaymentIdx + 1;

            payments.push({
              pagoPa: newPagopaPayment(`${recipient.taxId}-${newPaymentIdx}-pagoPa`, newPaymentIdx),
            });
          }
          if ((posDeb === 'f24' || posDeb === 'f24pagopa') && !hasF24) {
            const lastPaymentIdx = payments[payments.length - 1]?.f24?.idx ?? -1;
            const newPaymentIdx = lastPaymentIdx + 1;
            payments.push({
              f24: newF24Payment(`${recipient.taxId}-${newPaymentIdx}-f24`, newPaymentIdx),
            });
          }
          /* eslint-enable functional/immutable-data */

          return { ...acc, [recipient.taxId]: payments };
        },
        {}
      ),
    []
  );

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      dispatch(setPayments({ recipients: formatPayments() }));
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

  const formatPayments = (): Array<NewNotificationRecipient> => {
    const recipients = _.cloneDeep(notification.recipients);
    return recipients.map((recipient) => {
      // eslint-disable-next-line functional/immutable-data
      recipient.payments = formik.values[recipient.taxId].filter(
        (payment) => payment.pagoPa?.file?.data || payment.f24?.file.data
      );
      return recipient;
    });
  };
  // notification.recipients.reduce((obj: { [key: string]: PaymentObject }, r) => {
  //   const formikPagoPa = formik.values[r.taxId].pagoPa;
  //   const formikF24 = formik.values[r.taxId].f24;
  //   // I avoid including empty file object into the result
  //   // hence I check for any file object that it actually points to a file
  //   // (this is the condition XXX.file.data)
  //   // and then I don't add the payment info for a recipient if it doesn't include any actual file pointer
  //   // (this is the Object.keys(paymentsForThisRecipient).length > 0 condition below)
  //   // ---------------------------------------------
  //   // Carlos Lombardi, 2023.01.10
  //   const paymentsForThisRecipient: any = {};
  //   if (formikPagoPa.file.data) {
  //     // eslint-disable-next-line functional/immutable-data
  //     paymentsForThisRecipient.pagoPaForm = {
  //       ...newPaymentDocument(`${r.taxId}-pagoPaDoc`, t('pagopa-notice')),
  //       file: {
  //         data: formikPagoPa.file.data,
  //         sha256: {
  //           hashBase64: formikPagoPa.file.sha256.hashBase64,
  //           hashHex: formikPagoPa.file.sha256.hashHex,
  //         },
  //       },
  //       ref: {
  //         key: formikPagoPa.ref.key,
  //         versionToken: formikPagoPa.ref.versionToken,
  //       },
  //     };
  //   }
  //   if (formikF24?.file.data) {
  //     // eslint-disable-next-line functional/immutable-data
  //     paymentsForThisRecipient.f24standard = {
  //       ...newPaymentDocument(`${r.taxId}-f24standardDoc`, t('f24')),
  //       file: {
  //         data: formikF24.file.data,
  //         sha256: {
  //           hashBase64: formikF24.file.sha256.hashBase64,
  //           hashHex: formikF24.file.sha256.hashHex,
  //         },
  //       },
  //       ref: {
  //         key: formikF24.ref.key,
  //         versionToken: formikF24.ref.versionToken,
  //       },
  //     };
  //   }
  //   if (Object.keys(paymentsForThisRecipient).length > 0) {
  //     // eslint-disable-next-line functional/immutable-data
  //     obj[r.taxId] = paymentsForThisRecipient;
  //   }
  //   return obj;
  // }, {});

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    onSubmit: async () => {
      if (isCompleted) {
        onConfirm();
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
        const paymentData = await dispatch(uploadNotificationPaymentDocument(formatPayments()));
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
    index: number,
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldValue(
      id,
      {
        ...formik.values[taxId][index][paymentType],
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

  console.log(formik.values);

  const removeFileHandler = async (
    id: string,
    taxId: string,
    paymentType: 'pagoPa' | 'f24',
    index: number
  ) => {
    await formik.setFieldValue(id, {
      ...formik.values[taxId][index][paymentType],
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
    });
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(setPayments({ recipients: formatPayments() }));
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
        {notification.recipients.map((recipient) => (
          <Paper key={recipient.taxId} sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
            <SectionHeading>
              {t('payment-models')} {recipient.firstName} {recipient.lastName}
            </SectionHeading>
            {formik.values[recipient.taxId] &&
              formik.values[recipient.taxId].map((payment, index) => {
                if (payment.pagoPa) {
                  return (
                    <PaymentBox
                      key={`${recipient.taxId}-pagoPa-${payment.pagoPa.idx}`}
                      id={`${recipient.taxId}.${index}.pagoPa`}
                      title={`${t('attach-pagopa-notice')}`}
                      onFileUploaded={(id, file, sha256) =>
                        fileUploadedHandler(recipient.taxId, 'pagoPa', index, id, file, sha256)
                      }
                      onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'pagoPa', index)}
                      fileUploaded={payment.pagoPa}
                    />
                  );
                }
                if (payment.f24) {
                  return (
                    <PaymentBox
                      key={`${recipient.taxId}-f24-${payment.f24.idx}`}
                      id={`${recipient.taxId}.${index}.f24`}
                      title={`${t('attach-f24')}`}
                      onFileUploaded={(id, file, sha256) =>
                        fileUploadedHandler(recipient.taxId, 'f24', index, id, file, sha256)
                      }
                      onRemoveFile={(id) => removeFileHandler(id, recipient.taxId, 'f24', index)}
                      fileUploaded={payment.f24}
                    />
                  );
                }
                return <></>;
              })}
          </Paper>
        ))}
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <PaymentMethods {...props} forwardedRef={ref} />
));
