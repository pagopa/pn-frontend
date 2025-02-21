import { useFormik } from 'formik';
import { ForwardedRef } from 'react';
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
  NewNotificationRecipient,
  NotificationFeePolicy,
  PagoPaIntegrationMode,
  PaymentModel,
} from '../../models/NewNotification';
import NewNotificationCard from './NewNotificationCard';
import PaymentMethods from './PaymentMethods';

type Props = {
  recipients: Array<NewNotificationRecipient>;
  notification: NewNotification;
  onConfirm: () => void;
  onPreviousStep: () => void;
  goToLastStep: () => void;
  ref: ForwardedRef<unknown>;
};

const DebtPositionDetail: React.FC<Props> = ({
  notification,
  onConfirm,
  onPreviousStep,
  goToLastStep,
}) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position-detail',
  });

  const initialValues = () => ({
    notification: {
      ...notification,
      notificationFeePolicy: notification.notificationFeePolicy ?? undefined,
      pagoPaIntMode: notification.pagoPaIntMode ?? undefined,
    },
  });

  console.log(initialValues);
  const validationSchema = yup.object().shape({
    recipients: yup.array().of(
      yup.object().shape({
        debtPosition: yup.string().required(t('common.required-field')),
      })
    ),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        // dispatch(setDebtPosition(values));
        if (
          values.recipients.every((recipient) => recipient.debtPosition === PaymentModel.NOTHING)
        ) {
          goToLastStep();
          return;
        }
        onConfirm();
      }
    },
  });

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
                name={`notification-fee.title`}
                value={formik.values.notification.notificationFeePolicy}
                onChange={() => {}}
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
                name={`pagopa-int-mode.title`}
                value={formik.values.notification.pagoPaIntMode}
                onChange={() => {}}
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
          onConfirm={() => {}}
          isCompleted={false}
          formik={formik}
        />
      </NewNotificationCard>
    </form>
  );
};

export default DebtPositionDetail;
