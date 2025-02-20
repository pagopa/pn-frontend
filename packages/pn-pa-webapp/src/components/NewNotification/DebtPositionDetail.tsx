import { useFormik } from 'formik';
import { ForwardedRef } from 'react';

import { NewNotificationRecipient } from '../../models/NewNotification';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  recipients: Array<NewNotificationRecipient>;
  onConfirm: () => void;
  onPreviousStep: () => void;
  goToLastStep: () => void;
  forwardedRef: ForwardedRef<unknown>;
};

const DebtPositionDetail: React.FC<Props> = ({
  recipients,
  onConfirm,
  onPreviousStep,
  goToLastStep,
  forwardedRef,
}) => {
  const initialValues = () => ({
    recipients: recipients.map((recipient) => ({
      ...recipient,
      debtPosition: recipient.debtPosition ?? undefined,
    })),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        dispatch(setDebtPosition(values));
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
  console.log('hello');
  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        noPaper={true}
        previousStepLabel={t('back-to-recipient')}
        previousStepOnClick={onPreviousStep}
      >
        {recipients.map((recipient, index) => (
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
                  name={`recipients.${index}.debtPosition`}
                  value={formik.values.recipients[index].debtPosition}
                  onChange={(e) => handleChange(e, index)}
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

export default DebtPositionDetail;
