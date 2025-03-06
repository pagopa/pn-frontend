import { useFormik } from 'formik';
import _ from 'lodash';
import { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import EuroIcon from '@mui/icons-material/Euro';
import {
  Alert,
  FormControlLabel,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CustomDropdown, dataRegex } from '@pagopa-pn/pn-commons';

import {
  NewNotification,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationPayment,
  NewNotificationRecipient,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
  PaymentModel,
  VAT,
} from '../../models/NewNotification';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { uploadNotificationPaymentDocument } from '../../redux/newNotification/actions';
import { setDebtPositionDetail } from '../../redux/newNotification/reducers';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import {
  checkApplyCost,
  f24ValidationSchema,
  identicalIUV,
  pagoPaValidationSchema,
} from '../../utility/validation.utility';
import NewNotificationCard from './NewNotificationCard';
import { FormBox, FormBoxSubtitle, FormBoxTitle } from './NewNotificationFormElelements';
import PaymentMethods from './PaymentMethods';

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
  onPreviousStep: () => void;
  forwardedRef: ForwardedRef<unknown>;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const DebtPositionDetail: React.FC<Props> = ({
  notification,
  onConfirm,
  onPreviousStep,
  forwardedRef,
}) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail',
  });
  const { t: tc } = useTranslation(['common']);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const hasPagoPa = notification.recipients.some(
    (recipient) =>
      recipient.debtPosition === PaymentModel.PAGO_PA ||
      recipient.debtPosition === PaymentModel.PAGO_PA_F24
  );

  const { PAYMENT_INFO_LINK } = getConfiguration();
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
      const recipientIndex = `${recipient.recipientType}-${recipient.taxId}`;
      const recipientData = formik.values.recipients[recipientIndex];
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
      notificationFeePolicy: notification.notificationFeePolicy,
      paFee: notification.paFee || undefined,
      vat: notification.vat || undefined,
      pagoPaIntMode: notification.pagoPaIntMode ?? PagoPaIntegrationMode.NONE,
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
            [`${recipient.recipientType}-${recipient.taxId}`]: {
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

  const recipientSchema = () => {
    const recipientSchema: { [key: string]: yup.ObjectSchema<any> } = {};
    Object.keys(initialValues.recipients).forEach((recipientIndex) => {
      const taxId = recipientIndex.split('-')[1];
      const recipient = notification.recipients.find((r) => r.taxId === taxId);
      const debtPosition = recipient?.debtPosition;

      // eslint-disable-next-line functional/immutable-data
      recipientSchema[recipientIndex] = yup.object({
        pagoPa: yup.array().of(
          yup.object().when([], {
            is: () =>
              debtPosition === PaymentModel.PAGO_PA || debtPosition === PaymentModel.PAGO_PA_F24,
            then: () => pagoPaValidationSchema(t, tc),
          })
        ),
        f24: yup.array().of(
          yup.object().when([], {
            is: () =>
              debtPosition === PaymentModel.F24 || debtPosition === PaymentModel.PAGO_PA_F24,
            then: () => f24ValidationSchema(tc),
          })
        ),
      });
    });

    return recipientSchema;
  };

  const validationSchema = yup.object().shape({
    notificationFeePolicy: yup
      .string()
      .oneOf(Object.values(NotificationFeePolicy))
      .required(tc('required-field')),
    paFee: yup
      .mixed()
      .optional()
      .when('notificationFeePolicy', {
        is: NotificationFeePolicy.DELIVERY_MODE,
        then: yup
          .mixed()
          .required(tc('required-field'))
          .test('is-currency', `${t('notification-fee.pa-fee')} ${tc('invalid')}`, (value) =>
            dataRegex.currency.test(String(value))
          ),
      }),
    vat: yup
      .number()
      .optional()
      .when('notificationFeePolicy', {
        is: NotificationFeePolicy.DELIVERY_MODE,
        then: yup.number().oneOf(VAT).required(tc('required-field')),
      }),
    pagoPaIntMode: yup
      .string()
      .oneOf(Object.values(PagoPaIntegrationMode))
      .test('checkRecipientDebtPosition', tc('required-field'), (value) => {
        const hasPagoPaDebtPosition = notification.recipients.some(
          (r) =>
            r.debtPosition === PaymentModel.PAGO_PA || r.debtPosition === PaymentModel.PAGO_PA_F24
        );

        return !(hasPagoPaDebtPosition && value === PagoPaIntegrationMode.NONE);
      }),
    recipients: yup
      .object(recipientSchema())
      .test('identicalIUV', t('identical-notice-codes-error'), function (values) {
        const errors = identicalIUV(values as any);

        if (errors.length === 0) {
          return true;
        }

        return new yup.ValidationError(
          errors.map(
            (e) => new yup.ValidationError(e.messageKey ? t(e.messageKey) : '', e.value, e.id)
          )
        );
      })
      .test('applyCostValidation', t('at-least-one-applycost'), function (values) {
        if (this.parent.notificationFeePolicy !== NotificationFeePolicy.DELIVERY_MODE) {
          return true;
        }

        const validationErrors = checkApplyCost(values as any);

        if (validationErrors.length === 0) {
          return true;
        }

        return new yup.ValidationError(
          validationErrors.map(
            (e) => new yup.ValidationError(e.messageKey ? t(e.messageKey) : '', e.value, e.id)
          )
        );
      }),
  });

  const updateRefAfterUpload = async (paymentPayload: Array<NewNotificationRecipient>) => {
    for (const recipient of paymentPayload) {
      const taxId = recipient.taxId;
      if (recipient.payments) {
        for (const [index, payment] of recipient.payments.entries()) {
          if (payment.pagoPa) {
            await formik.setFieldValue(
              `recipients[${taxId}].pagoPa[${index}].ref`,
              payment.pagoPa.ref,
              false
            );
          }
          if (payment.f24) {
            await formik.setFieldValue(
              `recipients[${taxId}].f24[${index}].ref`,
              payment.f24.ref,
              false
            );
          }
        }
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async () => {
      const paymentData = await dispatch(uploadNotificationPaymentDocument(formatPayments()));
      const paymentPayload = paymentData.payload as Array<NewNotificationRecipient>;
      if (paymentPayload) {
        await updateRefAfterUpload(paymentPayload);
      }
      saveDebtPositionDetail(paymentPayload);
      onConfirm();
    },
  });

  const saveDebtPositionDetail = (recipients: Array<NewNotificationRecipient>) => {
    dispatch(
      setDebtPositionDetail({
        recipients,
        vat: formik.values.vat,
        paFee: formik.values.paFee,
        notificationFeePolicy: formik.values.notificationFeePolicy,
        pagoPaIntMode: formik.values.pagoPaIntMode,
      })
    );
  };

  const isDeliveryMode =
    formik.values.notificationFeePolicy === NotificationFeePolicy.DELIVERY_MODE;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'notificationFeePolicy' && value === NotificationFeePolicy.FLAT_RATE) {
      await formik.setFieldValue('paFee', undefined);
      await formik.setFieldTouched('paFee', false);

      await formik.setFieldValue('vat', undefined);
      await formik.setFieldTouched('vat', false);
      const updatedRecipients = Object.fromEntries(
        Object.entries(formik.values.recipients).map(([taxId, payments]) => [
          taxId,
          {
            pagoPa: payments.pagoPa.map((payment) => ({
              ...payment,
              applyCost: false,
            })),
            f24: payments.f24.map((payment) => ({
              ...payment,
              applyCost: false,
            })),
          },
        ])
      );
      await formik.setFieldValue('recipients', updatedRecipients);
    }
    await formik.setFieldValue(name, value);
  };

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handlePreviousStep = () => {
    saveDebtPositionDetail(formatPayments());
    onPreviousStep();
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      saveDebtPositionDetail(formatPayments());
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="paymentMethodForm">
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        noPaper={true}
        previousStepLabel={t('back-to-debt-position')}
        previousStepOnClick={handlePreviousStep}
      >
        <Paper sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
          <Typography variant="h6" fontWeight={700}>
            {t('title')}
          </Typography>
          <FormBox>
            <FormBoxTitle id="notificationFee" text={t('notification-fee.title')} />
            <FormBoxSubtitle text={t('notification-fee.description')} />
            {/* TODO: CHECK IF ARIA-LIVE IS ENOUGH */}
            <Stack
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'end'}
              aria-live="polite"
            >
              <RadioGroup
                aria-labelledby="notificationFee"
                name="notificationFeePolicy"
                value={formik.values.notificationFeePolicy}
                onChange={(e) => handleChange(e)}
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
              {isDeliveryMode && (
                <Stack direction={'row'} justifyContent="space-between">
                  <TextField
                    required
                    size="small"
                    id="paFee"
                    name="paFee"
                    label={t('notification-fee.pa-fee')}
                    value={formik.values.paFee}
                    error={formik.touched.paFee && Boolean(formik.errors.paFee)}
                    helperText={formik.touched.paFee && formik.errors.paFee}
                    onChange={handleChangeTouched}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ width: '21px' }}>
                          <EuroIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flexBasis: '75%', margin: '0rem 0.8rem' }}
                  />
                  <CustomDropdown
                    id="vat"
                    name="vat"
                    required
                    label={`${t('notification-fee.vat')}*`}
                    size="small"
                    value={formik.values.vat ?? ''}
                    onChange={handleChange}
                    sx={{ flexBasis: '30%' }}
                    error={formik.touched.vat && Boolean(formik.errors.vat)}
                    helperText={formik.touched.vat && formik.errors.vat}
                  >
                    {VAT.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}%
                      </MenuItem>
                    ))}
                  </CustomDropdown>
                </Stack>
              )}
            </Stack>
            {isDeliveryMode && (
              <Typography variant="caption">{t('notification-fee.disclaimer')}</Typography>
            )}
          </FormBox>

          {hasPagoPa && (
            <FormBox>
              <FormBoxTitle id="pagopaIntMode" text={t('pagopa-int-mode.title')} />
              <Typography variant="body2" fontSize={'14px'} marginTop={0.5}>
                <Trans
                  t={t}
                  i18nKey={'pagopa-int-mode.description'}
                  components={[
                    <Link
                      key="learn-more"
                      href={PAYMENT_INFO_LINK}
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
                aria-labelledby="pagopaIntMode"
                name="pagoPaIntMode"
                value={formik.values.pagoPaIntMode}
                onChange={handleChange}
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
            </FormBox>
          )}
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

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <DebtPositionDetail {...props} forwardedRef={ref} />
));
