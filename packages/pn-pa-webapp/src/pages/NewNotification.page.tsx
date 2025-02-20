import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Alert, Box, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { PnBreadcrumb, Prompt, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';

import Attachments from '../components/NewNotification/Attachments';
import DebtPosition from '../components/NewNotification/DebtPosition';
import PaymentMethods from '../components/NewNotification/PaymentMethods';
import PreliminaryInformations from '../components/NewNotification/PreliminaryInformations';
import Recipient from '../components/NewNotification/Recipient';
import SyncFeedback from '../components/NewNotification/SyncFeedback';
import { NewNotificationLangOther, PaymentModel } from '../models/NewNotification';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createNewNotification } from '../redux/newNotification/actions';
import { resetState, setSenderInfos } from '../redux/newNotification/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';

const SubTitle = () => {
  const { t } = useTranslation(['common', 'notifiche']);
  return (
    <>
      {t('new-notification.subtitle', { ns: 'notifiche' })} {/* PN-2028 */}
      <Link to={routes.API_KEYS}>{t('menu.api-key')}</Link>
    </>
  );
};

const NewNotification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useIsMobile();
  const notification = useAppSelector(
    (state: RootState) => state.newNotificationState.notification
  );
  const isCompleted = useAppSelector((state: RootState) => state.newNotificationState.isCompleted);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const { IS_PAYMENT_ENABLED } = useMemo(() => getConfiguration(), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'notifiche']);

  const steps = useMemo(() => {
    const baseSteps = [
      t('new-notification.steps.preliminary-informations.title', { ns: 'notifiche' }),
      t('new-notification.steps.recipient.title', { ns: 'notifiche' }),
    ];

    if (IS_PAYMENT_ENABLED) {
      // eslint-disable-next-line functional/immutable-data
      baseSteps.push(
        t('new-notification.steps.debt-position.title', { ns: 'notifiche' }),
        t('new-notification.steps.payment-methods.title', { ns: 'notifiche' })
      );
    }

    // eslint-disable-next-line functional/immutable-data
    baseSteps.push(t('new-notification.steps.attachments.title', { ns: 'notifiche' }));
    return baseSteps;
  }, [t, IS_PAYMENT_ENABLED]);

  const hasDebtPosition =
    IS_PAYMENT_ENABLED &&
    notification.recipients.some(
      (recipient) => recipient.debtPosition && recipient.debtPosition !== PaymentModel.NOTHING
    );

  const childRef = useRef<{ confirm: () => void }>();

  const goToNextStep = () => {
    setActiveStep((previousStep) => previousStep + 1);
  };

  const goToPreviousStep = (selectedStep?: number) => {
    if (selectedStep !== undefined && selectedStep >= 0 && selectedStep < activeStep) {
      // navigation event from stepper
      if (childRef.current) {
        childRef.current.confirm();
        setActiveStep(selectedStep);
      }
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const createNotification = () => {
    if (activeStep === steps.length - 1 && isCompleted) {
      void dispatch(createNewNotification(notification))
        .unwrap()
        .then(() => setActiveStep((previousStep) => previousStep + 1))
        .catch(() => {
          /** Without this catch vitest return errors of unhandle errors.
           * The error is handled in other parts of the application with
           * the appearance of a toast with the related error, but it's
           * necessary to use this catch here too.
           *
           * Sarah Donvito e Carlos Lombardi, 2024.01.23
           */
        });
    }
  };

  const isPaymentMethodStepDisabled = (index: number) =>
    IS_PAYMENT_ENABLED && index === 3 && !hasDebtPosition;

  const onStepClick = (index: number) =>
    index < activeStep && !isPaymentMethodStepDisabled(index) ? goToPreviousStep(index) : undefined;

  useEffect(() => {
    createNotification();
  }, [isCompleted]);

  useEffect(() => {
    dispatch(
      setSenderInfos({
        senderDenomination: organization.rootParent?.description
          ? organization.rootParent?.description + ' - ' + organization.name
          : organization.name,
        senderTaxId: organization.fiscal_code,
      })
    );
  }, [organization]);

  useEffect(() => () => void dispatch(resetState()), []);

  if (activeStep === steps.length) {
    return <SyncFeedback />;
  }

  return (
    <Prompt
      title={t('new-notification.prompt.title', { ns: 'notifiche' })}
      message={t('new-notification.prompt.message', { ns: 'notifiche' })}
    >
      <Box p={3}>
        <Grid container sx={{ padding: isMobile ? '0 20px' : 0 }}>
          <Grid item xs={12} lg={8}>
            <PnBreadcrumb
              linkRoute={routes.DASHBOARD}
              linkLabel={t('new-notification.breadcrumb-root', { ns: 'notifiche' })}
              currentLocationLabel={t('new-notification.breadcrumb-leaf', { ns: 'notifiche' })}
              goBackLabel={t('button.indietro', { ns: 'common' })}
            />
            <TitleBox
              variantTitle="h4"
              title={t('new-notification.title', { ns: 'notifiche' })}
              sx={{ pt: '20px' }}
              subTitle={<SubTitle />}
              variantSubTitle="body1"
            ></TitleBox>
            {!IS_PAYMENT_ENABLED && (
              <Alert role="alert" data-testid="alert" sx={{ mt: 3 }} severity={'warning'}>
                <Typography component="span" variant="body1">
                  {t('new-notification.warning-payment-disabled', { ns: 'notifiche' })}
                </Typography>
              </Alert>
            )}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ marginTop: '60px' }}
              data-testid="stepper"
            >
              {steps.map((label, index) => (
                <Step
                  id={label}
                  key={label}
                  onClick={() => onStepClick(index)}
                  sx={{ cursor: index < activeStep ? 'pointer' : 'auto' }}
                  data-testid={`step-${index}`}
                  disabled={isPaymentMethodStepDisabled(index)}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <PreliminaryInformations notification={notification} onConfirm={goToNextStep} />
            )}
            {activeStep === 1 && (
              <Recipient
                onConfirm={goToNextStep}
                onPreviousStep={goToPreviousStep}
                recipientsData={notification.recipients}
                paymentMode={notification.paymentMode}
                ref={childRef}
              />
            )}
            {activeStep === 2 && IS_PAYMENT_ENABLED && (
              <DebtPosition
                recipients={notification.recipients}
                onConfirm={goToNextStep}
                onPreviousStep={goToPreviousStep}
                goToLastStep={() => setActiveStep(steps.length - 1)}
                ref={childRef}
              />
            )}
            {activeStep === 3 && IS_PAYMENT_ENABLED && hasDebtPosition && (
              <PaymentMethods
                onConfirm={goToNextStep}
                notification={notification}
                isCompleted={isCompleted}
                onPreviousStep={goToPreviousStep}
                ref={childRef}
              />
            )}
            {((IS_PAYMENT_ENABLED && activeStep === 4) ||
              (!IS_PAYMENT_ENABLED && activeStep === 2)) && (
              <Attachments
                onConfirm={createNotification}
                onPreviousStep={goToPreviousStep}
                isCompleted={isCompleted}
                attachmentsData={notification.documents}
                hasAdditionalLang={
                  notification.lang === NewNotificationLangOther && !!notification.additionalLang
                }
                hasDebtPosition={hasDebtPosition}
                ref={childRef}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Prompt>
  );
};

export default NewNotification;
