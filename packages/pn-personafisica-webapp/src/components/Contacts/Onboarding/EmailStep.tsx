import { useFormik } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Stack, Typography } from '@mui/material';
import { EventAction, appStateActions } from '@pagopa-pn/pn-commons';

import { OnboardingAvailableFlows } from '../../../models/Onboarding';
import { PFEventsType } from '../../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../../models/contacts';
import { createOrUpdateAddress } from '../../../redux/contact/actions';
import { useAppDispatch } from '../../../redux/hooks';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { emailValidationSchema, normalizeContactValue } from '../../../utility/contacts.utility';
import ContactCodeDialog from '../ContactCodeDialog';
import DigitalContact from '../DigitalContact';
import OnboardingContactItem from './OnboardingContactItem';

type Props = {
  value?: string;
  alreadySet: boolean;
  onChange: (value?: string) => void;
  onVerified?: () => void;
};

const EmailStep: React.FC<Props> = ({ value, alreadySet, onChange, onVerified }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const [codeDialogOpen, setCodeDialogOpen] = useState(false);

  const emailContactRef = useRef<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
  }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const currentValueRef = useRef<string>(value ?? '');

  const formik = useFormik({
    initialValues: {
      email: value ?? '',
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      email: emailValidationSchema(t),
    }),
    onSubmit: async () => {
      const normalizedValue = normalizeContactValue(formik.values.email);

      if (!normalizedValue) {
        return;
      }

      // eslint-disable-next-line functional/immutable-data
      currentValueRef.current = normalizedValue;
      await handleCodeVerification();
    },
  });

  const showEditableExistingEmail = Boolean(value) && alreadySet;
  const showReadonlyNewEmail = Boolean(value) && !alreadySet;
  const isEmailSaved = showEditableExistingEmail || showReadonlyNewEmail;

  const title = isEmailSaved
    ? t('onboarding.digital-domicile.email.title-existing')
    : t('onboarding.digital-domicile.email.title');

  const description = t('onboarding.digital-domicile.email.description');

  // START Mixpanel
  const trackDigitalDomicile = useCallback(
    (event: PFEventsType, extra?: Record<string, unknown>) =>
      PFEventStrategyFactory.triggerEvent(event, {
        onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
        ...extra,
      }),
    []
  );

  const handleEditButtonClick = useCallback(
    (nextEditMode: boolean) => {
      if (!nextEditMode) {
        return;
      }

      trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_EDITING);
    },
    [trackDigitalDomicile]
  );

  const handleEditConfirmClick = useCallback(() => {
    trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED);
  }, [trackDigitalDomicile]);

  // END Mixpanel

  const handleCodeVerification = useCallback(
    async (verificationCode?: string) => {
      const digitalAddressParams: SaveDigitalAddressParams = {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.EMAIL,
        value: currentValueRef.current,
        code: verificationCode,
      };

      try {
        if (verificationCode) {
          trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_OTP_VERIFICATION);
        }
        const res = await dispatch(createOrUpdateAddress(digitalAddressParams)).unwrap();

        if (!res) {
          trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_OTP, {
            event_type: EventAction.SCREEN_VIEW,
          });

          setCodeDialogOpen(true);
          return;
        }

        setCodeDialogOpen(false);
        onChange(currentValueRef.current);

        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.email-added-successfully', { ns: 'recapiti' }),
          })
        );

        trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED, {
          event_type: EventAction.CONFIRM,
        });

        if (value && alreadySet) {
          emailContactRef.current.toggleEdit();
        } else {
          onVerified?.();
        }
      } catch {
        // handled by ContactCodeDialog/AppResponsePublisher
      }
    },
    [alreadySet, dispatch, onChange, t, value, onVerified, trackDigitalDomicile]
  );

  const handleVerifyEmail = useCallback(async () => {
    await formik.setFieldTouched('email', true, false);
    const errors = await formik.validateForm();
    const normalizedValue = normalizeContactValue(formik.values.email);

    if (!normalizedValue || errors.email) {
      return;
    }

    trackDigitalDomicile(PFEventsType.SEND_ONBOARDING_EMAIL_VERIFICATION);

    // eslint-disable-next-line functional/immutable-data
    currentValueRef.current = normalizedValue;
    await handleCodeVerification();
  }, [formik, handleCodeVerification, trackDigitalDomicile]);

  const handleSubmitEmailEdit = useCallback(
    (newValue: string) => {
      const normalizedValue = normalizeContactValue(newValue);

      if (!normalizedValue) {
        return;
      }

      if (normalizedValue === value && alreadySet) {
        emailContactRef.current.toggleEdit();
        return;
      }

      // eslint-disable-next-line functional/immutable-data
      currentValueRef.current = normalizedValue;
      void handleCodeVerification();
    },
    [alreadySet, handleCodeVerification, value]
  );

  const handleDiscardCodeDialog = useCallback(async () => {
    setCodeDialogOpen(false);

    if (value && alreadySet) {
      emailContactRef.current.toggleEdit();
      await emailContactRef.current.resetForm();
    }
  }, [alreadySet, value]);

  const handleEmailFieldChange = (newValue: string) => {
    void formik.setFieldValue('email', newValue);
    void formik.setFieldTouched('email', true, false);
  };

  const renderEmailContent = () => {
    if (showEditableExistingEmail) {
      return (
        <DigitalContact
          ref={emailContactRef}
          label={t('onboarding.digital-domicile.email.label')}
          value={value ?? ''}
          channelType={ChannelType.EMAIL}
          inputProps={{
            label: t('onboarding.digital-domicile.email.input-label'),
          }}
          insertButtonLabel={t('onboarding.digital-domicile.email.confirm-cta')}
          onSubmit={handleSubmitEmailEdit}
          onEditButtonClickCallback={handleEditButtonClick}
          onEditConfirmCallback={handleEditConfirmClick}
          showLabelOnEdit
          slots={{
            label: () => <></>,
            leadingEditIcon: MailOutlineIcon,
          }}
          slotsProps={{
            textField: {
              sx: { flexBasis: { xs: 'unset', lg: '50%' } },
            },
            button: {
              sx: {
                height: '43px',
                fontWeight: 700,
                flexBasis: { xs: 'unset', lg: '25%' },
              },
            },
            container: {
              width: '100%',
            },
            leadingEditIcon: {
              sx: { color: 'disabled' },
              fontSize: 'small',
            },
          }}
        />
      );
    }

    if (!isEmailSaved) {
      return (
        <OnboardingContactItem
          mode="entry"
          inputLabel={t('onboarding.digital-domicile.email.input-label')}
          value={formik.values.email}
          buttonLabel={t('onboarding.digital-domicile.email.verify-cta')}
          error={formik.errors.email}
          touched={formik.touched.email}
          onChange={handleEmailFieldChange}
          onBlur={formik.handleBlur}
          onSubmit={handleVerifyEmail}
          prefix={<MailOutlineIcon fontSize="small" color="disabled" />}
        />
      );
    }

    if (showReadonlyNewEmail) {
      return (
        <OnboardingContactItem
          mode="view"
          label={t('onboarding.digital-domicile.email.label')}
          value={value ?? currentValueRef.current}
          icon={<MailOutlineIcon color="disabled" fontSize="small" aria-hidden="true" />}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Stack data-testid="email-step">
        <Typography fontSize="18px" fontWeight={700} mb={1}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>

        {renderEmailContent()}
      </Stack>

      <ContactCodeDialog
        value={currentValueRef.current}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        open={codeDialogOpen}
        onConfirm={(code) => void handleCodeVerification(code)}
        onDiscard={() => void handleDiscardCodeDialog()}
      />
    </>
  );
};

export default EmailStep;
