import { useCallback, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { AppResponse, AppResponsePublisher, CodeModal, ErrorMessage } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

import { AddressType, ChannelType } from '../../models/contacts';

type Props = {
  value: string;
  addressType: AddressType;
  channelType: ChannelType;
  open: boolean;
  onDiscard: () => void;
  onConfirm: (code?: string) => void;
  onError?: () => void;
  variant?: 'default' | 'onboarding-email' | 'onboarding-pec';
};

const ContactCodeDialog: React.FC<Props> = ({
  value,
  addressType,
  channelType,
  open = false,
  onDiscard,
  onConfirm,
  onError,
  variant = 'default',
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const contactType = channelType.toLowerCase();
  const isOnboardingEmail = variant === 'onboarding-email' && channelType === ChannelType.EMAIL;
  const isOnboardingPec = variant === 'onboarding-pec' && channelType === ChannelType.PEC;
  const isOnboardingOtp = isOnboardingEmail || isOnboardingPec;
  const onboardingContactType = isOnboardingEmail ? 'email' : 'pec';
  const onboardingTitleKey = isOnboardingEmail
    ? 'onboarding.courtesy.email.verify-before-continue-title'
    : 'onboarding.digital-domicile.pec.verify-before-continue-title';
  const codeModalRef = useRef<{
    updateError: (error: ErrorMessage, codeNotValid: boolean) => void;
  }>(null);
  const labelRoot = `${addressType.toLowerCase()}-contacts`;

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (!open) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
        onError?.();
      }
      return false;
    },
    [open]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

  return (
    <CodeModal
      title={
        isOnboardingEmail || isOnboardingPec
          ? t(onboardingTitleKey, { ns: 'recapiti' })
          : t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti', value })
      }
      subtitle={
        isOnboardingEmail || isOnboardingPec ? (
          <>
            <Trans
              i18nKey={`onboarding.otp.description-${onboardingContactType}`}
              ns="recapiti"
              values={{ value }}
              components={{ strong: <strong /> }}
            />
            <br />
            <Trans
              i18nKey="onboarding.otp.validity"
              ns="recapiti"
              components={{ strong: <strong /> }}
            />
          </>
        ) : (
          <Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" />
        )
      }
      open={open}
      codeLength={5}
      codeSectionTitle={t(`insert-code`, { ns: 'recapiti' })}
      codeSectionAdditional={
        <Typography component={Box} variant="body2">
          <Trans
            i18nKey={
              isOnboardingEmail || isOnboardingPec
                ? `onboarding.otp.new-code-${onboardingContactType}`
                : `${labelRoot}.${contactType}-new-code`
            }
            ns="recapiti"
            components={[
              <MIButton
                variant="text"
                key="newCodeBtn"
                onClick={() => onConfirm()}
                sx={{
                  textDecoration: 'underline',
                  display: 'inline',
                  fontWeight: 400,
                  verticalAlign: 'baseline',
                }}
                data-testid="newCodeBtn"
              />,
            ]}
          />
        </Typography>
      }
      cancelLabel={t('button.annulla')}
      confirmLabel={
        isOnboardingEmail || isOnboardingPec
          ? t(`onboarding.otp.confirm-label`, {
              ns: 'recapiti',
            })
          : t('button.conferma')
      }
      cancelCallback={onDiscard}
      confirmCallback={(value: string) => onConfirm(value)}
      ref={codeModalRef}
    />
  );
};

export default ContactCodeDialog;
