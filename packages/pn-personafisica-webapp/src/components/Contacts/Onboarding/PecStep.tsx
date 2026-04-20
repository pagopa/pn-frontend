import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';
import { ConfirmationModal, appStateActions } from '@pagopa-pn/pn-commons';
import { IllusMIMessage } from '@pagopa/mui-italia';

import { EmailContactState, PecContactState } from '../../../models/Onboarding';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../../models/contacts';
import { createOrUpdateAddress } from '../../../redux/contact/actions';
import { useAppDispatch } from '../../../redux/hooks';
import {
  emailValidationSchema,
  normalizeContactValue,
  pecValidationSchema,
} from '../../../utility/contacts.utility';
import ContactCodeDialog from '../ContactCodeDialog';
import EmailSection, { EmailMode } from './EmailSection';
import OnboardingContactItem from './OnboardingContactItem';

type Props = {
  pec: PecContactState;
  email: EmailContactState;
  showOptionalEmail: boolean;
  onPecChange: (value?: string, isValid?: boolean) => void;
  onEmailChange: (value?: string) => void;
  onShowOptionalEmail: (show: boolean) => void;
  registerContinueHandler?: (handler: () => Promise<boolean>) => void;
};

type FlowKey = 'pec' | 'email';

const getInitialEmailMode = (email: EmailContactState, showOptionalEmail: boolean): EmailMode => {
  if (email.value && email.alreadySet) {
    return 'edit';
  }

  if (email.value && !email.alreadySet) {
    return 'readonly';
  }

  return showOptionalEmail ? 'insert' : 'collapsed';
};

const PecStep: React.FC<Props> = ({
  pec,
  email,
  showOptionalEmail,
  onPecChange,
  onEmailChange,
  onShowOptionalEmail,
  registerContinueHandler,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const [showVerifyPecModal, setShowVerifyPecModal] = useState(false);
  const [codeDialogFlow, setCodeDialogFlow] = useState<FlowKey | null>(null);
  const [emailMode, setEmailMode] = useState<EmailMode>(() =>
    getInitialEmailMode(email, showOptionalEmail)
  );

  const emailContactRef = useRef<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
  }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const currentValuesRef = useRef<Record<FlowKey, string>>({
    pec: pec.value ?? '',
    email: email.value ?? '',
  });

  useEffect(() => {
    setEmailMode(getInitialEmailMode(email, showOptionalEmail));
  }, [email, showOptionalEmail]);

  const hasPecFlowState = Boolean(pec.value) || pec.isValid !== undefined;
  const isPecPendingValidation = pec.isValid === false;
  const showPecDisclaimer = !pec.alreadySet && !hasPecFlowState;

  const validationSchema = useMemo(
    () =>
      yup.object({
        pec: pecValidationSchema(t),
        email: emailMode === 'insert' ? emailValidationSchema(t) : yup.string().notRequired(),
        pecDisclaimer: showPecDisclaimer
          ? yup.bool().isTrue(t('required-field', { ns: 'common' }))
          : yup.bool().notRequired(),
      }),
    [emailMode, showPecDisclaimer, t]
  );

  const formik = useFormik({
    initialValues: {
      pec: pec.value ?? '',
      email: email.value ?? '',
      pecDisclaimer: pec.alreadySet,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async () => {
      // no-op: submission is handled by dedicated PEC and email actions
    },
  });

  const submitContactFlow = useCallback(
    async (flow: FlowKey, value: string, verificationCode?: string) => {
      const digitalAddressParams: SaveDigitalAddressParams =
        flow === 'pec'
          ? {
              addressType: AddressType.LEGAL,
              senderId: 'default',
              channelType: ChannelType.PEC,
              value,
              code: verificationCode,
            }
          : {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value,
              code: verificationCode,
            };

      try {
        const res = await dispatch(createOrUpdateAddress(digitalAddressParams)).unwrap();

        if (!res) {
          setCodeDialogFlow(flow);
          return;
        }

        setCodeDialogFlow(null);

        if (flow === 'pec') {
          onPecChange(value, res?.pecValid);

          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t('legal-contacts.pec-added-successfully', { ns: 'recapiti' }),
            })
          );
          return;
        }

        onEmailChange(value);

        if (email.alreadySet) {
          emailContactRef.current.toggleEdit();
          setEmailMode('edit');
        } else {
          setEmailMode('readonly');
        }

        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.email-added-successfully', { ns: 'recapiti' }),
          })
        );
      } catch {
        // handled by ContactCodeDialog / AppResponsePublisher
      }
    },
    [dispatch, email.alreadySet, onEmailChange, onPecChange, t]
  );

  const handleFieldChange = useCallback(
    async (field: 'pec' | 'email', value: string) => {
      await formik.setFieldValue(field, value);
      await formik.setFieldTouched(field, true, false);
    },
    [formik]
  );

  const handleVerifyPec = useCallback(async () => {
    await formik.setFieldTouched('pec', true, false);

    if (showPecDisclaimer) {
      await formik.setFieldTouched('pecDisclaimer', true, false);
    }

    const errors = await formik.validateForm();
    const normalizedValue = normalizeContactValue(formik.values.pec);

    if (!normalizedValue || errors.pec || errors.pecDisclaimer) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    currentValuesRef.current.pec = normalizedValue;
    await submitContactFlow('pec', normalizedValue);
  }, [formik, showPecDisclaimer, submitContactFlow]);

  const handleVerifyEmail = useCallback(async () => {
    await formik.setFieldTouched('email', true, false);
    const errors = await formik.validateForm();
    const normalizedValue = normalizeContactValue(formik.values.email);

    if (!normalizedValue || errors.email) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    currentValuesRef.current.email = normalizedValue;
    await submitContactFlow('email', normalizedValue);
  }, [formik, submitContactFlow]);

  const handleSubmitEmailEdit = useCallback(
    (newValue: string) => {
      const normalizedValue = normalizeContactValue(newValue);

      if (!normalizedValue) {
        return;
      }

      if (normalizedValue === email.value && email.alreadySet) {
        emailContactRef.current.toggleEdit();
        setEmailMode('edit');
        return;
      }

      // eslint-disable-next-line functional/immutable-data
      currentValuesRef.current.email = normalizedValue;
      void submitContactFlow('email', normalizedValue);
    },
    [email.alreadySet, email.value, submitContactFlow]
  );

  const handleCollapseEmail = useCallback(() => {
    void formik.setFieldValue('email', '', false);
    void formik.setFieldTouched('email', false, false);
    setEmailMode('collapsed');
    onShowOptionalEmail(false);
  }, [formik, onShowOptionalEmail]);

  const handleCodeDialogConfirm = useCallback(
    async (code?: string) => {
      if (!codeDialogFlow) {
        return;
      }

      const value = normalizeContactValue(currentValuesRef.current[codeDialogFlow]);

      if (!value) {
        return;
      }

      await submitContactFlow(codeDialogFlow, value, code);
    },
    [codeDialogFlow, submitContactFlow]
  );

  const handleCodeDialogDiscard = useCallback(async () => {
    const activeFlow = codeDialogFlow;
    setCodeDialogFlow(null);

    if (activeFlow === 'email' && email.alreadySet) {
      emailContactRef.current.toggleEdit();
      await emailContactRef.current.resetForm();
      setEmailMode('edit');
    }
  }, [codeDialogFlow, email.alreadySet]);

  const handleContinueAttempt = useCallback(async (): Promise<boolean> => {
    if (hasPecFlowState) {
      return true;
    }

    await formik.setFieldTouched('pec', true, false);

    if (showPecDisclaimer) {
      await formik.setFieldTouched('pecDisclaimer', true, false);
    }
    const errors = await formik.validateForm();

    if (errors.pec || errors.pecDisclaimer) {
      return false;
    }

    setShowVerifyPecModal(true);
    return false;
  }, [formik, hasPecFlowState, showPecDisclaimer]);

  useEffect(() => {
    registerContinueHandler?.(handleContinueAttempt);
  }, [handleContinueAttempt, registerContinueHandler]);

  const codeDialogValue = codeDialogFlow ? currentValuesRef.current[codeDialogFlow] : '';
  const codeDialogAddressType = codeDialogFlow === 'pec' ? AddressType.LEGAL : AddressType.COURTESY;
  const codeDialogChannelType = codeDialogFlow === 'pec' ? ChannelType.PEC : ChannelType.EMAIL;

  const handlePecDisclaimerChange = useCallback(
    async (checked: boolean) => {
      await formik.setFieldValue('pecDisclaimer', checked, false);
      await formik.setFieldTouched('pecDisclaimer', true, false);
      await formik.validateField('pecDisclaimer');
    },
    [formik]
  );

  const renderPecDisclaimerFooter = () => {
    if (!showPecDisclaimer) {
      return null;
    }

    return (
      <FormControl error={Boolean(formik.touched.pecDisclaimer && formik.errors.pecDisclaimer)}>
        <FormControlLabel
          sx={{ alignItems: 'flex-start', m: 0 }}
          control={
            <Checkbox
              checked={formik.values.pecDisclaimer}
              onChange={(_, checked) => void handlePecDisclaimerChange(checked)}
              size="small"
              sx={{
                alignSelf: 'flex-start',
                p: 0,
                mr: 1,
              }}
            />
          }
          label={
            <Typography variant="body2" fontSize="14px" color="text.secondary">
              <Trans i18nKey="onboarding.digital-domicile.pec.disclaimer" ns="recapiti" />
            </Typography>
          }
        />
        {formik.touched.pecDisclaimer && formik.errors.pecDisclaimer && (
          <FormHelperText>{formik.errors.pecDisclaimer}</FormHelperText>
        )}
      </FormControl>
    );
  };

  return (
    <>
      <Stack data-testid="pec-step">
        <Typography fontSize="18px" fontWeight={700} mb={1}>
          {t(
            isPecPendingValidation
              ? 'onboarding.digital-domicile.pec.pending.title'
              : 'onboarding.digital-domicile.pec.title'
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {t(
            isPecPendingValidation
              ? 'onboarding.digital-domicile.pec.pending.description'
              : 'onboarding.digital-domicile.pec.description'
          )}
        </Typography>

        <Stack
          spacing={2}
          sx={{
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          {isPecPendingValidation ? (
            <Chip
              label={t('onboarding.digital-domicile.pec.pending.badge')}
              size="small"
              sx={{ width: 'fit-content' }}
            />
          ) : hasPecFlowState ? (
            <OnboardingContactItem
              mode="view"
              label={t('onboarding.digital-domicile.pec.label-summary')}
              value={pec.value}
            />
          ) : (
            <OnboardingContactItem
              mode="entry"
              label={t('onboarding.digital-domicile.pec.label-choose-address')}
              inputLabel={t('onboarding.digital-domicile.pec.input-label')}
              value={formik.values.pec}
              buttonLabel={t('onboarding.digital-domicile.pec.verify-cta')}
              buttonVariant="outlined"
              error={formik.errors.pec}
              touched={formik.touched.pec}
              onChange={(value) => void handleFieldChange('pec', value)}
              onBlur={formik.handleBlur}
              onSubmit={handleVerifyPec}
              footer={renderPecDisclaimerFooter()}
            />
          )}

          <Divider />

          <EmailSection
            mode={emailMode}
            email={email}
            emailValue={formik.values.email}
            emailError={formik.errors.email}
            emailTouched={formik.touched.email}
            onEmailValueChange={(value) => void handleFieldChange('email', value)}
            onEmailBlur={formik.handleBlur}
            onVerifyEmail={handleVerifyEmail}
            onSubmitEmailEdit={handleSubmitEmailEdit}
            onExpand={() => {
              setEmailMode('insert');
              onShowOptionalEmail(true);
            }}
            onCollapse={handleCollapseEmail}
            emailContactRef={emailContactRef}
          />
        </Stack>
      </Stack>

      <ContactCodeDialog
        value={codeDialogValue}
        addressType={codeDialogAddressType}
        channelType={codeDialogChannelType}
        open={Boolean(codeDialogFlow)}
        onConfirm={(code) => void handleCodeDialogConfirm(code)}
        onDiscard={() => void handleCodeDialogDiscard()}
      />

      <ConfirmationModal
        open={showVerifyPecModal}
        title={t('onboarding.digital-domicile.pec.verify-before-continue-title')}
        contentAlign="center"
        slots={{
          illustration: <IllusMIMessage />,
        }}
        slotsProps={{
          confirmButton: {
            onClick: () => setShowVerifyPecModal(false),
            children: t('button.understand', { ns: 'common' }),
          },
        }}
      >
        <Typography variant="body2">
          <Trans
            i18nKey="onboarding.digital-domicile.pec.verify-before-continue-content"
            ns="recapiti"
          />
        </Typography>
      </ConfirmationModal>
    </>
  );
};

export default PecStep;
