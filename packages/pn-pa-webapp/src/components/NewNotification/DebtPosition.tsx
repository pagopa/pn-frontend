import { useFormik } from 'formik';
import React, { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { NewNotificationRecipient, PaymentModel } from '../../models/NewNotification';
import { useAppDispatch } from '../../redux/hooks';
import { setDebtPosition } from '../../redux/newNotification/reducers';
import NewNotificationCard from './NewNotificationCard';
import { FormBoxTitle } from './NewNotificationFormElelements';

type Props = {
  recipients: Array<NewNotificationRecipient>;
  onConfirm: () => void;
  onPreviousStep: () => void;
  goToLastStep: () => void;
  forwardedRef: ForwardedRef<unknown>;
};

const DebtPosition: React.FC<Props> = ({
  recipients,
  onConfirm,
  onPreviousStep,
  goToLastStep,
  forwardedRef,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position',
  });
  const { t: tc } = useTranslation(['common']);

  const initialValues = () => ({
    recipients: recipients.map((recipient) => ({
      ...recipient,
      debtPosition: recipient.debtPosition ?? undefined,
    })),
  });

  const validationSchema = yup.object().shape({
    recipients: yup.array().of(
      yup.object().shape({
        debtPosition: yup.string().required(tc('required-field')),
      })
    ),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(setDebtPosition(values));
      if (values.recipients.every((recipient) => recipient.debtPosition === PaymentModel.NOTHING)) {
        goToLastStep();
        return;
      }
      onConfirm();
    },
  });

  const handleChange = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    await formik.setFieldValue(`recipients.${index}.debtPosition`, value);
  };

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      dispatch(setDebtPosition(formik.values));
      onPreviousStep();
    }
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(setDebtPosition(formik.values));
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="debtPositionForm">
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        noPaper={true}
        previousStepLabel={t('back-to-recipient')}
        previousStepOnClick={handlePreviousStep}
      >
        {recipients.map((recipient, index) => (
          <Paper
            key={recipient.taxId}
            sx={{ padding: '24px', marginTop: '40px' }}
            elevation={0}
            data-testid="payments-type-choice"
          >
            <Typography variant="h6" fontWeight={700}>
              {recipients.length === 1
                ? t('debt-position')
                : t('debt-position-of', {
                    fullName: `${recipient.firstName} ${recipient.lastName}`,
                  })}
            </Typography>
            <Box mt={3} p={3} border={1} borderColor="divider" borderRadius={1}>
              <FormControl margin="none" fullWidth>
                <FormLabel id="payments-type">
                  <FormBoxTitle text={t('which-type-of-payments')} />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="payments-type"
                  name={`recipients.${index}.debtPosition`}
                  value={formik.values.recipients[index].debtPosition ?? ''}
                  onChange={(e) => handleChange(e, index)}
                  sx={{ mt: 2 }}
                >
                  <FormControlLabel
                    value={PaymentModel.PAGO_PA}
                    control={<Radio />}
                    label={t('radios.pago-pa')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                    data-testid="paymentModel"
                  />
                  <FormControlLabel
                    value={PaymentModel.F24}
                    control={<Radio />}
                    label={t('radios.f24')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                    data-testid="paymentModel"
                  />
                  <FormControlLabel
                    value={PaymentModel.PAGO_PA_F24}
                    control={<Radio />}
                    label={t('radios.pago-pa-f24')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                    data-testid="paymentModel"
                  />
                  <FormControlLabel
                    value={PaymentModel.NOTHING}
                    control={<Radio />}
                    label={t('radios.nothing')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                    data-testid="paymentModel"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Paper>
        ))}
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <DebtPosition {...props} forwardedRef={ref} />
));
