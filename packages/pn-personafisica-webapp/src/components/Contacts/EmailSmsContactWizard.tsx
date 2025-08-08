import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Divider, Stack, Typography } from '@mui/material';
import { EventAction, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import { isPFEvent } from '../../utility/mixpanel';
import ContactCodeDialog from './ContactCodeDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InformativeDialog from './InformativeDialog';
import SmsContactItem from './SmsContactItem';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  INFORMATIVE = 'informative',
}

const SmsLabelWithDisclaimer = () => {
  const { t } = useTranslation('recapiti');
  return (
    <>
      <Typography fontSize="16px" fontWeight={700} mb={2}>
        {t('courtesy-contacts.sms-to-add', { ns: 'recapiti' })}
      </Typography>
      <Typography fontSize="16px" mb={2}>
        <Trans ns="recapiti" i18nKey="legal-contacts.sercq-send-wizard.step_3.sms-disclaimer" />
      </Typography>
    </>
  );
};

const EmailSmsContactWizard: React.FC = () => {
  const { t } = useTranslation('recapiti');
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const {
    defaultSMSAddress,
    defaultEMAILAddress,
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    addresses,
    courtesyAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const emailContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  const smsContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ channelType: ChannelType; value: string }>({
    channelType: ChannelType.EMAIL,
    value: '',
  });

  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;

  const emailValue = defaultEMAILAddress?.value ?? '';
  const smsValue = defaultSMSAddress?.value ?? '';

  const handleSubmit = (channelType: ChannelType, value: string) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { channelType, value };
    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, 'default', channelType)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    if (!isDigitalDomicileActive && channelType === ChannelType.EMAIL) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_EMAIL);
      setModalOpen(ModalType.INFORMATIVE);
      return;
    }
    handleCodeVerification(channelType);
  };

  const handleCodeVerification = (channelType: ChannelType, verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(
        channelType === ChannelType.EMAIL
          ? PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION
          : PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION,
        'default'
      );
    }

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

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          // aprire la code modal
          const eventKey = `SEND_ADD_SERCQ_SEND_${channelType}_OTP`;
          if (isPFEvent(eventKey)) {
            PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey]);
          }
          setModalOpen(ModalType.CODE);
          return;
        }

        PFEventStrategyFactory.triggerEvent(
          channelType === ChannelType.EMAIL
            ? PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS
            : PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS
        );

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.${channelType.toLowerCase()}-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setModalOpen(null);
        if (currentAddress.current.channelType === ChannelType.EMAIL && emailValue) {
          emailContactRef.current.toggleEdit();
        }
        if (currentAddress.current.channelType === ChannelType.SMS && smsValue) {
          smsContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleTrackValidationEvents = (
    value: string,
    channelType: ChannelType,
    errors?: string
  ) => {
    const status = !value ? 'missing' : errors ? 'invalid' : 'valid';
    const validationKey = `${channelType.toLowerCase()}_validation`;
    const data = { [validationKey]: status };

    if (!value || errors) {
      const eventKey = `SEND_ADD_SERCQ_SEND_${channelType}_ERROR`;
      if (isPFEvent(eventKey)) {
        PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], data);
      }
    }

    const eventKey = `SEND_ADD_SERCQ_SEND_ADD_${channelType}_START`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], data);
    }
  };

  const handleEditCallback = (editMode: boolean, channelType: ChannelType) => {
    if (editMode) {
      const eventKey = `SEND_ADD_SERCQ_SEND_CHANGE_${channelType}`;
      if (isPFEvent(eventKey)) {
        PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey]);
      }
    }
  };

  const handleCancelCode = async () => {
    const eventKey = `SEND_ADD_SERCQ_SEND_ADD_${currentAddress.current.channelType}_BACK`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey]);
    }

    setModalOpen(null);

    const isEmail = currentAddress.current.channelType === ChannelType.EMAIL;
    const isSms = currentAddress.current.channelType === ChannelType.SMS;

    if (isEmail) {
      if (emailValue) {
        emailContactRef.current.toggleEdit();
        await emailContactRef.current.resetForm();
      }
    } else if (isSms && smsValue) {
      smsContactRef.current.toggleEdit();
      await smsContactRef.current.resetForm();
    }
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS, {
      event_type: EventAction.SCREEN_VIEW,
      contacts: courtesyAddresses,
    });
  }, []);

  return (
    <Stack useFlexGap data-testid="emailSmsContactWizard">
      <Typography fontSize="22px" fontWeight={700} mb={{ xs: 2, lg: 3 }}>
        {t('legal-contacts.sercq-send-wizard.step_3.title')}
      </Typography>

      <Typography fontSize="16px" mb={emailValue ? { xs: 3, lg: 4 } : 1}>
        {t('legal-contacts.sercq-send-wizard.step_3.content')}
      </Typography>

      {!emailValue && (
        <Typography fontSize="16px" mb={{ xs: 3, lg: 4 }}>
          <Trans ns="recapiti" i18nKey="legal-contacts.sercq-send-wizard.step_3.email-disclaimer" />
        </Typography>
      )}

      {/* EMAIL */}
      <DigitalContact
        label={t(`courtesy-contacts.email-to-add`, { ns: 'recapiti' })}
        value={emailValue}
        channelType={ChannelType.EMAIL}
        ref={emailContactRef}
        inputProps={{
          label: t(`courtesy-contacts.link-email-placeholder`, {
            ns: 'recapiti',
          }),
        }}
        insertButtonLabel={t(`courtesy-contacts.email-add`, { ns: 'recapiti' })}
        onSubmit={(value) => handleSubmit(ChannelType.EMAIL, value)}
        showVerifiedIcon
        showLabelOnEdit
        slots={{ label: emailValue ? undefined : () => <></> }}
        slotsProps={{
          textField: {
            sx: { flexBasis: { xs: 'unset', lg: '50%' } },
          },
          button: {
            sx: { height: '43px', fontWeight: 700, flexBasis: { xs: 'unset', lg: '25%' } },
          },
          container: {
            width: '100%',
          },
        }}
        onEditCallback={(editMode: boolean) => handleEditCallback(editMode, ChannelType.EMAIL)}
        beforeValidationCallback={(value: string, errors?: string) =>
          handleTrackValidationEvents(value, ChannelType.EMAIL, errors)
        }
      />
      <InformativeDialog
        open={modalOpen === ModalType.INFORMATIVE}
        title={t('courtesy-contacts.info-modal-email-title', { ns: 'recapiti' })}
        subtitle={t('courtesy-contacts.info-modal-email-subtitle', { ns: 'recapiti' })}
        content={t('courtesy-contacts.info-modal-email-content', { ns: 'recapiti' })}
        onConfirm={() => {
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_EMAIL_CONTINUE
          );
          handleCodeVerification(currentAddress.current.channelType);
        }}
        onDiscard={() => {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_EMAIL_CANCEL);
          setModalOpen(null);
        }}
      />

      <Divider sx={{ mt: 3, mb: 3 }} />
      {/* SMS */}
      {smsValue ? (
        <DigitalContact
          label={t(`courtesy-contacts.sms-to-add`, { ns: 'recapiti' })}
          value={smsValue}
          channelType={ChannelType.SMS}
          ref={smsContactRef}
          inputProps={{
            label: t(`courtesy-contacts.link-sms-placeholder`, {
              ns: 'recapiti',
            }),
            prefix: internationalPhonePrefix,
          }}
          insertButtonLabel={t(`courtesy-contacts.sms-add`, { ns: 'recapiti' })}
          onSubmit={(value) => handleSubmit(ChannelType.SMS, value)}
          showVerifiedIcon
          showLabelOnEdit
          slotsProps={{
            textField: {
              sx: { flexBasis: { xs: 'unset', lg: '50%' } },
            },
            button: {
              sx: { height: '43px', fontWeight: 700, flexBasis: { xs: 'unset', lg: '25%' } },
            },
            container: {
              width: '100%',
            },
          }}
          onEditCallback={(editMode: boolean) => handleEditCallback(editMode, ChannelType.SMS)}
          beforeValidationCallback={(value: string, errors?: string) =>
            handleTrackValidationEvents(value, ChannelType.SMS, errors)
          }
        />
      ) : (
        <SmsContactItem
          slots={{ label: SmsLabelWithDisclaimer }}
          slotsProps={{
            textField: {
              sx: { flexBasis: { xs: 'unset', lg: '50%' } },
            },
            button: {
              sx: { height: '43px', fontWeight: 700, flexBasis: { xs: 'unset', lg: '25%' } },
            },
          }}
          beforeValidationCallback={(value: string, errors?: string) =>
            handleTrackValidationEvents(value, ChannelType.SMS, errors)
          }
        />
      )}

      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={currentAddress.current.channelType}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(currentAddress.current.channelType, code)}
        onDiscard={handleCancelCode}
        onError={() =>
          PFEventStrategyFactory.triggerEvent(
            currentAddress.current.channelType === ChannelType.EMAIL
              ? PFEventsType.SEND_ADD_EMAIL_CODE_ERROR
              : PFEventsType.SEND_ADD_SMS_CODE_ERROR
          )
        }
      />
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification(currentAddress.current.channelType)}
      />
    </Stack>
  );
};

export default EmailSmsContactWizard;
