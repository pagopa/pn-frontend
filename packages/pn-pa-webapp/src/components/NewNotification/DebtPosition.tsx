import { useFormik } from 'formik';
import React, { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';

import { NewNotificationRecipient, PaymentModel } from '../../models/NewNotification';
import { useAppDispatch } from '../../redux/hooks';
import { setDebtPosition } from '../../redux/newNotification/reducers';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  recipients: Array<NewNotificationRecipient>;
  onConfirm: () => void;
  onPreviousStep: () => void;
  forwardedRef: ForwardedRef<unknown>;
};

interface DebtPositionFormValues {
  recipientDebtPositions: {
    [taxId: string]: PaymentModel | undefined;
  };
}

// const recipients = [
//   {
//     taxId: 'xx',
//     firstName: 'Ale',
//     lastName: 'Gelmi',
//   },
//   {
//     taxId: 'xxx',
//     firstName: 'Giorgio',
//     lastName: 'Troisi',
//   },
// ];

const DebtPosition: React.FC<Props> = ({ recipients, onConfirm, onPreviousStep, forwardedRef }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.debt-position',
  });
  const { t: tc } = useTranslation(['common']);

  const initialValues = (): DebtPositionFormValues => ({
    recipientDebtPositions: recipients.reduce(
      (acc, recipient) => ({
        ...acc,
        [recipient.taxId]: undefined,
      }),
      {}
    ),
  });

  const validationSchema = yup.object().shape({
    recipientDebtPositions: yup.object().shape(
      recipients.reduce((acc, recipient) => {
        // eslint-disable-next-line functional/immutable-data
        acc[recipient.taxId] = yup.string().required(tc('required-field'));
        return acc;
      }, {} as { [key: string]: yup.StringSchema })
    ),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      if (formik.isValid) {
        dispatch(setDebtPosition(values));
        onConfirm();
      }
    },
  });

  const handleChange = async (event: ChangeEvent<HTMLInputElement>, taxId: string) => {
    const { value } = event.target;

    if (Object.values(PaymentModel).includes(value as PaymentModel)) {
      await formik.setFieldValue(`recipientDebtPositions.${taxId}`, value);
    }

    await formik.setFieldTouched(`recipientDebtPositions.${taxId}`, true, false);
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      setDebtPosition(formik.values);
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        noPaper={true}
        previousStepLabel={t('back-to-recipient')}
        previousStepOnClick={onPreviousStep}
      >
        {recipients.map((recipient) => (
          <Paper key={recipient.taxId} sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
            <Typography variant="h6" fontWeight={700}>
              {recipients.length === 1
                ? t('debt-position')
                : t('debt-position-of', {
                    fullName: `${recipient.firstName} ${recipient.lastName}`,
                  })}
            </Typography>
            <Box mt={3} p={3} border={1} borderColor="divider" borderRadius={1}>
              <Stack direction="column">
                <Typography fontSize="16px" fontWeight={600}>
                  {t('which-type-of-payments')}
                </Typography>
                <RadioGroup
                  aria-labelledby="comunication-type-label"
                  name="debtPosition"
                  value={formik.values.recipientDebtPositions[recipient.taxId] || ''}
                  onChange={(e) => handleChange(e, recipient.taxId)}
                  sx={{ mt: 2 }}
                >
                  <FormControlLabel
                    value={PaymentModel.PAGO_PA_NOTICE}
                    control={<Radio />}
                    label={t('radios.pago-pa-notice')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                  />
                  <FormControlLabel
                    value={PaymentModel.F24}
                    control={<Radio />}
                    label={t('radios.f24')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                  />
                  <FormControlLabel
                    value={PaymentModel.PAGO_PA_F24}
                    control={<Radio />}
                    label={t('radios.pago-pa-f24')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                  />
                  <FormControlLabel
                    value={PaymentModel.NOTHING}
                    control={<Radio />}
                    label={t('radios.nothing')}
                    componentsProps={{ typography: { fontSize: '16px' } }}
                  />
                </RadioGroup>
              </Stack>
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
