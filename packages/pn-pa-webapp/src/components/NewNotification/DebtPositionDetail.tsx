import { useFormik } from 'formik';
import _ from 'lodash';
import { ForwardedRef, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Alert,
  Box,
  FormControlLabel,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

import {
  NewNotification,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
  PaymentModel,
  PaymentObject,
} from '../../models/NewNotification';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../redux/newNotification/actions';
import { setPayments } from '../../redux/newNotification/reducers';
import { RootState } from '../../redux/store';
import NewNotificationCard from './NewNotificationCard';
import PaymentMethods from './PaymentMethods';

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
  onPreviousStep: () => void;
  ref: ForwardedRef<unknown>;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const DebtPositionDetail: React.FC<Props> = ({ notification, onConfirm, onPreviousStep }) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail',
  });
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const dispatch = useAppDispatch();

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

  const formatPayments = (): Array<NewNotificationRecipient> => {
    const recipients = _.cloneDeep(notification.recipients);
    return recipients.map((recipient) => {
      const recipientData = formik.values.recipients[recipient.taxId];
      console.log(recipientData);

      const payments = [
        ...recipientData.pagoPa
          // .filter((payment) => payment?.file?.data)
          .map((payment) => ({ pagoPa: payment })),
        ...recipientData.f24
          .filter((payment) => payment?.file?.data)
          .map((payment) => ({ f24: payment })),
      ];

      // eslint-disable-next-line functional/immutable-data
      recipient.payments = payments;

      return recipient;
    });
  };

  const initialValues = useMemo(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    () => ({
      notificationFeePolicy: notification.notificationFeePolicy ?? undefined,
      paFee: notification.paFee ?? undefined,
      vat: notification.vat ?? undefined,
      pagoPaIntMode: notification.pagoPaIntMode ?? undefined,
      recipients: notification.recipients.reduce(
        (
          acc: {
            [taxId: string]: {
              pagoPa: Array<NewNotificationPagoPaPayment>;
              f24: Array<NewNotificationF24Payment>;
            };
          },
          recipient
        ) => {
          const recipientPayments = !_.isNil(recipient.payments) ? recipient.payments : [];
          const debtPosition = recipient.debtPosition;

          const hasPagoPa = recipientPayments.some((p) => p.pagoPa);
          const hasF24 = recipientPayments.some((p) => p.f24);

          // eslint-disable-next-line prefer-const, functional/no-let
          let payments: Array<NewNotificationPayment> = [...recipientPayments];

          /* eslint-disable functional/immutable-data */
          if (
            (debtPosition === PaymentModel.PAGO_PA || debtPosition === PaymentModel.PAGO_PA_F24) &&
            !hasPagoPa
          ) {
            const lastPaymentIdx = payments[payments.length - 1]?.pagoPa?.idx ?? -1;
            const newPaymentIdx = lastPaymentIdx + 1;

            payments.push({
              pagoPa: newPagopaPayment(`${recipient.taxId}-${newPaymentIdx}-pagoPa`, newPaymentIdx),
            });
          }
          if (
            (debtPosition === PaymentModel.F24 || debtPosition === PaymentModel.PAGO_PA_F24) &&
            !hasF24
          ) {
            const lastPaymentIdx = payments[payments.length - 1]?.f24?.idx ?? -1;
            const newPaymentIdx = lastPaymentIdx + 1;
            payments.push({
              f24: newF24Payment(`${recipient.taxId}-${newPaymentIdx}-f24`, newPaymentIdx),
            });
          }
          /* eslint-enable functional/immutable-data */

          const pagoPaPayments = payments
            .filter((p) => p.pagoPa)
            .map((p) => p.pagoPa as NewNotificationPagoPaPayment);
          const f24Payments = payments
            .filter((p) => p.f24)
            .map((p) => p.f24 as NewNotificationF24Payment);

          return {
            ...acc,
            [recipient.taxId]: {
              pagoPa: pagoPaPayments,
              f24: f24Payments,
            },
          };
        },
        {}
      ),
    }),
    []
  );

  const validationSchema = yup.object().shape({
    notificationFeePolicy: yup
      .string()
      .oneOf(Object.values(NotificationFeePolicy))
      .required(t('common.required-field')),
    paFee: yup
      .number()
      .optional()
      .when('notificationFeePolicy', {
        is: NotificationFeePolicy.DELIVERY_MODE,
        then: yup.number().required(t('common.required-field')),
      }),
    vat: yup
      .number()
      .optional()
      .when('notificationFeePolicy', {
        is: NotificationFeePolicy.DELIVERY_MODE,
        then: yup.number().required(t('common.required-field')),
      }),
    // Ritorna errore se: la posizione debitoria contiene è di tipo pagoPa o pagoPaF24
    // e la pagoPaIntMode è NONE
    pagoPaIntMode: yup.string().oneOf(Object.values(PagoPaIntegrationMode)),
    // pos. deb. PAGOPA: noticeCode e creditorTaxId obbligatori, file opzionale (pagoPaSchema)
    // pos. deb. F24: nome file e file obbligatori (f24Schema)
    // pos. deb. PAGOPA_F24: pagoPaSchema e f24Schema
    // recipients: yup.array().of(
    //   yup.object().shape({
    //     debtPosition: yup.string().required(t('common.required-field')),
    //   })
    // ),
  });

  const updateRefAfterUpload = async (paymentPayload: { [key: string]: PaymentObject }) => {
    // set ref
    for (const [taxId, payment] of Object.entries(paymentPayload)) {
      if (payment.pagoPa) {
        await formik.setFieldValue(
          `recipients.${taxId}.${payment.pagoPa.idx}.pagoPa.ref`,
          payment.pagoPa.ref,
          false
        );
      }
      if (payment.f24) {
        await formik.setFieldValue(
          `recipients.${taxId}.${payment.pagoPa.idx}.pagoPa.ref`,
          payment.f24.ref,
          false
        );
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async () => {
      console.log('FORMAT PAYMENTS', formatPayments());
      const paymentData = await dispatch(uploadNotificationPaymentDocument(formatPayments()));
      const paymentPayload = paymentData.payload as { [key: string]: PaymentObject };
      if (paymentPayload) {
        await updateRefAfterUpload(paymentPayload);
      }
      // Chiamare setDebtPositionDetail
      dispatch(setPayments({ recipients: formatPayments() }));
      onConfirm();
    },
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    await formik.setFieldValue(name, value);
  };

  // TODO rename SetPayments in setDebtPotisionDetail e passare info radio button
  // useImperativeHandle(forwardedRef, () => ({
  //   confirm() {
  //     dispatch(setPayments({ recipients: formatPayments() }));
  //   },
  // }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="paymentMethodForm">
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        noPaper={true}
        previousStepLabel={t('back-to-debt-position')}
        previousStepOnClick={onPreviousStep}
      >
        <Paper sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
          <Typography variant="h6" fontWeight={700}>
            {t('title')}
          </Typography>
          {/* notificationFee */}
          <Box mt={3} p={3} border={1} borderColor="divider" borderRadius={1}>
            <Stack direction="column">
              <Typography id="notificationFee" variant="body2" fontWeight={600}>
                {t('notification-fee.title')}
              </Typography>
              <Typography variant="caption">{t('notification-fee.description')}</Typography>
              <RadioGroup
                aria-labelledby="notificationFee"
                name="notificationFeePolicy"
                value={formik.values.notificationFeePolicy}
                onChange={(e) => handleChange(e)}
                sx={{ mt: 2 }}
              >
                <FormControlLabel
                  value={NotificationFeePolicy.FLAT_RATE}
                  control={<Radio />}
                  label={t('radios.flat-rate')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
                <FormControlLabel
                  value={NotificationFeePolicy.DELIVERY_MODE}
                  control={<Radio />}
                  label={t('radios.delivery-mode')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
              </RadioGroup>
            </Stack>
          </Box>
          {/* pagoPaIntMode */}
          <Box mt={3} p={3} border={1} borderColor="divider" borderRadius={1}>
            <Stack direction="column">
              <Typography variant="body2" fontWeight={600}>
                {t('pagopa-int-mode.title')}
              </Typography>
              {/* <Typography variant="caption">{t('pagopa-int-mode.description')}</Typography> */}
              <Typography variant="caption">
                <Trans
                  i18nKey={t('pagopa-int-mode.description')}
                  components={[
                    <Link
                      key="learn-more"
                      href="https://developer.pagopa.it/send/guides/knowledge-base/readme/pagamenti-e-spese-di-notifica/pagamenti-pagopa"
                      target="_blank"
                      rel="noopener noreferrer"
                    />,
                  ]}
                />
              </Typography>
              <Alert severity={'warning'} sx={{ mb: 3, mt: 2 }} data-testid="raddAlert">
                {t('alert', { ns: 'notifiche' })}
              </Alert>
              <RadioGroup
                aria-labelledby="comunication-type-label"
                name="pagoPaIntMode"
                value={formik.values.pagoPaIntMode}
                onChange={(e) => handleChange(e)}
                sx={{ mt: 2 }}
              >
                <FormControlLabel
                  value={PagoPaIntegrationMode.SYNC}
                  control={<Radio />}
                  label={t('radios.sync')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
                <FormControlLabel
                  value={PagoPaIntegrationMode.ASYNC}
                  control={<Radio />}
                  label={t('radios.async')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
              </RadioGroup>
            </Stack>
          </Box>
        </Paper>
        <PaymentMethods
          notification={notification}
          formik={formik}
          newPagopaPayment={newPagopaPayment}
          newF24Payment={newF24Payment}
        />
      </NewNotificationCard>
    </form>
  );
};

export default DebtPositionDetail;
