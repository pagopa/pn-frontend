import { useFormik } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Divider, Stack, Typography } from '@mui/material';
import { ConfirmationModal, EventAction, appStateActions } from '@pagopa-pn/pn-commons';
import { IllusMIMessage, MIAlert } from '@pagopa/mui-italia';

import {
  EmailContactState,
  OnboardingAvailableFlows,
  SmsContactState,
} from '../../../../models/Onboarding';
import { PFEventsType } from '../../../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../../../models/contacts';
import { createOrUpdateAddress } from '../../../../redux/contact/actions';
import { useAppDispatch } from '../../../../redux/hooks';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  emailValidationSchema,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../../../utility/contacts.utility';
import ContactCodeDialog from '../../ContactCodeDialog';
import CourtesyContactHandler, { CourtesyInputMode } from './CourtesyContactHandler';

type CourtesyChannelType = ChannelType.EMAIL | ChannelType.SMS;

const channelEvents: Record<
  CourtesyChannelType,
  {
    otp: PFEventsType;
    otpVerification: PFEventsType;
    verification: PFEventsType;
    activated: PFEventsType;
  }
> = {
  [ChannelType.EMAIL]: {
    otp: PFEventsType.SEND_ONBOARDING_EMAIL_OTP,
    otpVerification: PFEventsType.SEND_ONBOARDING_EMAIL_OTP_VERIFICATION,
    verification: PFEventsType.SEND_ONBOARDING_EMAIL_VERIFICATION,
    activated: PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED,
  },
  [ChannelType.SMS]: {
    otp: PFEventsType.SEND_ONBOARDING_SMS_OTP,
    otpVerification: PFEventsType.SEND_ONBOARDING_SMS_OTP_VERIFICATION,
    verification: PFEventsType.SEND_ONBOARDING_SMS_VERIFICATION,
    activated: PFEventsType.SEND_ONBOARDING_SMS_ACTIVATED,
  },
};

const trackCourtesy = (event: PFEventsType, extra?: Record<string, unknown>) =>
  PFEventStrategyFactory.triggerEvent(event, {
    onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
    ...extra,
  });

type Props = {
  ioEnabled: boolean;
  email: EmailContactState;
  sms: SmsContactState;
  onContactAdded: (key: 'email' | 'sms', value: string) => void;
  registerContinueHandler?: (handler: () => Promise<boolean>) => void;
};

type ContactRef = {
  toggleEdit: () => void;
  resetForm: () => Promise<void>;
};

const createContactRef = (): ContactRef => ({
  toggleEdit: () => {},
  resetForm: () => Promise.resolve(),
});

const EmailSmsStep = ({
  ioEnabled,
  email,
  sms,
  onContactAdded,
  registerContinueHandler,
}: Props) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const [smsMode, setSmsMode] = React.useState<CourtesyInputMode>(
    ioEnabled ? 'collapsed' : 'insert'
  );
  const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);
  const [verifyModal, setVerifyModal] = useState<{ open: boolean; channel: ChannelType | null }>({
    open: false,
    channel: null,
  });

  const shouldShowBanner = !ioEnabled && !email.alreadySet;

  const currentAddress = useRef<{ channelType: ChannelType; value: string }>({
    channelType: ChannelType.EMAIL,
    value: '',
  });

  const emailContactRef = useRef<ContactRef>(createContactRef());
  const smsContactRef = useRef<ContactRef>(createContactRef());

  const getEmailMode = (): CourtesyInputMode => {
    if (email.alreadySet) {
      return 'edit';
    }
    return email.value ? 'readonly' : 'insert';
  };

  const getSmsMode = (): CourtesyInputMode => {
    if (sms.alreadySet) {
      return 'edit';
    }
    if (sms.value) {
      return 'readonly';
    }

    return smsMode;
  };

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: emailValidationSchema(t),
        sms: getSmsMode() === 'insert' ? phoneValidationSchema(t) : yup.string().notRequired(),
      }),
    [smsMode, t]
  );

  const formik = useFormik({
    initialValues: {
      email: email.value ?? '',
      sms: (sms.value ?? '').replace(internationalPhonePrefix, ''),
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: () => {},
  });

  const toggleVerifyModal = (channel: ChannelType | null) => {
    setVerifyModal((prev) => ({
      open: !prev.open,
      channel,
    }));
  };

  const handleCollapseSms = async () => {
    trackCourtesy(PFEventsType.SEND_ONBOARDING_SMS_ACTIVATION_CANCELED);
    setSmsMode('collapsed');
    await smsContactRef.current.resetForm();
  };

  const handleExpandSms = () => {
    trackCourtesy(PFEventsType.SEND_ONBOARDING_SMS_SELECTED);
    setSmsMode('insert');
  };

  const handleCodeVerification = (channelType: ChannelType, verificationCode?: string) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType,
      value:
        channelType === ChannelType.SMS
          ? internationalPhonePrefix + currentAddress.current.value
          : currentAddress.current.value,
      code: verificationCode,
    };

    const events = channelEvents[channelType as CourtesyChannelType];

    if (verificationCode) {
      trackCourtesy(events.otpVerification);
    }

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (!res) {
          trackCourtesy(events.otp, { event_type: EventAction.SCREEN_VIEW });
          setCodeModalOpen(true);
          return;
        }

        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.${channelType.toLowerCase()}-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setCodeModalOpen(false);
        onContactAdded(
          channelType === ChannelType.EMAIL ? 'email' : 'sms',
          channelType === ChannelType.SMS
            ? internationalPhonePrefix + currentAddress.current.value
            : currentAddress.current.value
        );

        trackCourtesy(events.activated, { event_type: EventAction.CONFIRM });

        if (channelType === ChannelType.EMAIL && email.alreadySet) {
          emailContactRef.current.toggleEdit();
        }
        if (channelType === ChannelType.SMS && sms.alreadySet) {
          smsContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleVerify = async (channelType: ChannelType, value: string) => {
    const fieldName = channelType === ChannelType.EMAIL ? 'email' : 'sms';
    await formik.setFieldTouched(fieldName, true, false);
    const error = await formik.validateField(fieldName);
    if (error || !value) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { channelType, value };

    trackCourtesy(channelEvents[channelType as CourtesyChannelType].verification);

    handleCodeVerification(channelType);
  };

  const handleCancelCode = async () => {
    setCodeModalOpen(false);

    if (currentAddress.current.channelType === ChannelType.EMAIL && email.alreadySet) {
      emailContactRef.current.toggleEdit();
      await emailContactRef.current.resetForm();
    } else if (currentAddress.current.channelType === ChannelType.SMS && sms.alreadySet) {
      smsContactRef.current.toggleEdit();
      await smsContactRef.current.resetForm();
    }
  };

  const handleContinueAttempt = useCallback(async (): Promise<boolean> => {
    const smsEnabled = smsMode === 'insert';

    await formik.setFieldTouched('email', true, false);
    if (smsEnabled) {
      await formik.setFieldTouched('sms', true, false);
    }

    const errors = await formik.validateForm();

    const emailNeedsVerify = formik.values.email && !errors.email && !email.value;
    const smsNeedsVerify = smsEnabled && formik.values.sms && !errors.sms && !sms.value;

    if (emailNeedsVerify) {
      toggleVerifyModal(ChannelType.EMAIL);
      return false;
    }
    if (smsNeedsVerify) {
      toggleVerifyModal(ChannelType.SMS);
      return false;
    }

    return !errors.email && (!smsEnabled || !errors.sms);
  }, [formik, smsMode, email.value, sms.value]);

  useEffect(() => {
    registerContinueHandler?.(handleContinueAttempt);
  }, [handleContinueAttempt, registerContinueHandler]);

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_EMAIL_SMS_ACTIVATION, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
      email_value: email.value,
      sms_value: sms.value,
    });
  }, []);

  return (
    <Stack data-testid="email-sms-step" spacing={2}>
      {shouldShowBanner && (
        <MIAlert
          severity="info"
          data-testid="courtesy-banner"
          description={t('onboarding.courtesy.banner-description')}
        />
      )}

      <CourtesyContactHandler
        channelType={ChannelType.EMAIL}
        mode={getEmailMode()}
        contactState={email}
        contactValue={formik.values.email}
        onContactValueChange={(value) => formik.setFieldValue('email', value)}
        contactError={formik.errors.email}
        contactTouched={formik.touched.email}
        onVerifyContact={() => void handleVerify(ChannelType.EMAIL, formik.values.email)}
        onSubmitEdit={(value) => void handleVerify(ChannelType.EMAIL, value)}
        contactRef={emailContactRef}
      />

      <Divider />

      <CourtesyContactHandler
        channelType={ChannelType.SMS}
        mode={getSmsMode()}
        contactState={sms}
        contactValue={formik.values.sms}
        onContactValueChange={(value) => formik.setFieldValue('sms', value)}
        contactError={formik.errors.sms}
        contactTouched={formik.touched.sms}
        onVerifyContact={() => void handleVerify(ChannelType.SMS, formik.values.sms)}
        onSubmitEdit={(value) => void handleVerify(ChannelType.SMS, value)}
        contactRef={smsContactRef}
        onExpand={handleExpandSms}
        onCollapse={handleCollapseSms}
      />

      <ContactCodeDialog
        open={codeModalOpen}
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={currentAddress.current.channelType}
        onConfirm={(code) => handleCodeVerification(currentAddress.current.channelType, code)}
        onDiscard={handleCancelCode}
      />

      <ConfirmationModal
        open={verifyModal.open}
        contentAlign="center"
        slots={{
          illustration: <IllusMIMessage />,
        }}
        title={
          verifyModal.channel === ChannelType.EMAIL
            ? t('onboarding.courtesy.email.verify-before-continue-title')
            : t('onboarding.courtesy.sms.verify-before-continue-title')
        }
        slotsProps={{
          confirmButton: {
            onClick: () => toggleVerifyModal(null),
            children: t('button.understand', { ns: 'common' }),
          },
        }}
      >
        <Typography variant="body2">
          {verifyModal.channel === ChannelType.EMAIL
            ? t('onboarding.courtesy.email.verify-before-continue-content')
            : t('onboarding.courtesy.sms.verify-before-continue-content')}
        </Typography>
      </ConfirmationModal>
    </Stack>
  );
};

export default EmailSmsStep;
