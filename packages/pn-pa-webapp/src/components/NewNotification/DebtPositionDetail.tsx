import { getIn, useFormik } from 'formik';
import * as _ from 'lodash-es';
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
  useFormControl,
} from '@mui/material';
import { CustomDropdown, useIsMobile } from '@pagopa-pn/pn-commons';

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
import { newF24Payment, newPagopaPayment } from '../../utility/notification.utility';
import {
  checkApplyCost,
  f24ValidationSchema,
  identicalIUV,
  identicalSHA,
  isCurrencyAndMaxValue,
  paFeeValidationSchema,
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

function PaFeeFocusHelperText() {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail',
  });
  const { focused } = useFormControl() || {};

  if (focused) {
    return t('notification-fee.pa-fee-validation');
  }
  return false;
}

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
  const isMobile = useIsMobile('sm');
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const hasPagoPa = notification.recipients.some(
    (recipient) =>
      recipient.debtPosition === PaymentModel.PAGO_PA ||
      recipient.debtPosition === PaymentModel.PAGO_PA_F24
  );

  const { PAYMENT_INFO_LINK } = getConfiguration();
  const dispatch = useAppDispatch();

  const hasFieldError = (fieldName: string) =>
    Boolean(
      getIn(formik.touched, fieldName) ||
        (_.get(formik.values, fieldName) && String(_.get(formik.values, fieldName)).length > 0)
    );

  const formatPayments = (): Array<NewNotificationRecipient> => {
    const recipients = _.cloneDeep(notification.recipients);
    return recipients.map((recipient) => {
      const recipientKey = `${recipient.recipientType}-${recipient.taxId}`;
      const recipientData = formik.values.recipients[recipientKey];
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
              pagoPa: newPagopaPayment(recipient.taxId, newPaymentIdx, organization.fiscal_code),
            });
          }
          if (
            (debtPosition === PaymentModel.F24 || debtPosition === PaymentModel.PAGO_PA_F24) &&
            !hasF24
          ) {
            const lastPaymentIdx = payments[payments.length - 1]?.f24?.idx ?? -1;
            const newPaymentIdx = lastPaymentIdx + 1;
            payments.push({
              f24: newF24Payment(recipient.taxId, newPaymentIdx),
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
    Object.keys(initialValues.recipients).forEach((recipientKey) => {
      const taxId = recipientKey.split('-')[1];
      const recipient = notification.recipients.find((r) => r.taxId === taxId);
      const debtPosition = recipient?.debtPosition;

      // eslint-disable-next-line functional/immutable-data
      recipientSchema[recipientKey] = yup.object({
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

  const getErrorMessage = (error: {
    messageKey: string;
    data?: {
      [key: string]: number | string;
    };
  }) => {
    if (
      error.messageKey === 'notification-fee.pa-fee-currency' ||
      error.messageKey === 'notification-fee.pa-fee-max-value'
    ) {
      return t(error.messageKey, error.data);
    }
    return '';
  };
  const validationSchema = yup.object().shape({
    notificationFeePolicy: yup
      .string()
      .oneOf(Object.values(NotificationFeePolicy))
      .required(tc('required-field')),

    paFee: paFeeValidationSchema(tc).test({
      name: 'isCurrency',
      test(value?: string) {
        const error = isCurrencyAndMaxValue(value);

        if (error) {
          return this.createError({
            message: getErrorMessage(error),
            path: this.path,
          });
        }
        return true;
      },
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

        const errors = checkApplyCost(values as any);

        if (errors.length === 0) {
          return true;
        }

        return new yup.ValidationError(
          errors.map(
            (e) => new yup.ValidationError(e.messageKey ? t(e.messageKey) : '', e.value, e.id)
          )
        );
      })
      .test('checkDuplicatedFile', t('identical-sha256-error'), function (values) {
        const errors = identicalSHA(values as any);

        if (errors.length === 0) {
          return true;
        }

        return new yup.ValidationError(
          errors.map(
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
    <form onSubmit={formik.handleSubmit} data-testid="debtPositionDetailForm">
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
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent={'space-between'}
              alignItems={isMobile ? 'flex-start' : 'flex-end'}
              aria-live="polite"
              mb={1}
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
                  data-testid="notificationFeePolicy"
                  label={t('radios.flat-rate')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
                <FormControlLabel
                  value={NotificationFeePolicy.DELIVERY_MODE}
                  control={<Radio />}
                  data-testid="notificationFeePolicy"
                  label={t('radios.delivery-mode')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
              </RadioGroup>
            </Stack>
            {isDeliveryMode && (
              <>
                <Stack sx={{ width: isMobile ? '100%' : '50%' }}>
                  <TextField
                    required
                    size="small"
                    id="paFee"
                    name="paFee"
                    label={t('notification-fee.pa-fee')}
                    value={formik.values.paFee}
                    error={hasFieldError('paFee') && Boolean(formik.errors.paFee)}
                    helperText={
                      (hasFieldError('paFee') && formik.errors.paFee) || <PaFeeFocusHelperText />
                    }
                    data-testid="notification-pa-fee"
                    onChange={handleChangeTouched}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ width: '21px' }}>
                          <EuroIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flexBasis: isMobile ? '100%' : '60%',
                      margin: '1rem 0',
                    }}
                  />
                  <CustomDropdown
                    id="vat"
                    name="vat"
                    required
                    label={`${t('notification-fee.vat')}*`}
                    size="small"
                    value={formik.values.vat ?? ''}
                    onChange={handleChange}
                    sx={{ flexBasis: isMobile ? '100%' : '40%' }}
                    error={hasFieldError('vat') && Boolean(formik.errors.vat)}
                    helperText={hasFieldError('vat') && formik.errors.vat}
                    data-testid="notification-vat"
                  >
                    {VAT.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}%
                      </MenuItem>
                    ))}
                  </CustomDropdown>
                </Stack>
                <Typography variant="caption">{t('notification-fee.disclaimer')}</Typography>
              </>
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
              <Alert severity={'warning'} sx={{ mb: 3, mt: 2 }} data-testid="pagoPaIntModeAlert">
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
                  data-testid="pagoPaIntMode"
                  label={t('radios.sync')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
                <FormControlLabel
                  value={PagoPaIntegrationMode.ASYNC}
                  control={<Radio />}
                  data-testid="pagoPaIntMode"
                  label={t('radios.async')}
                  componentsProps={{ typography: { fontSize: '16px' } }}
                />
              </RadioGroup>
            </FormBox>
          )}
        </Paper>
        <PaymentMethods notification={notification} formik={formik} hasFieldError={hasFieldError} />
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <DebtPositionDetail {...props} forwardedRef={ref} />
));
