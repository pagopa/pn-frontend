import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Stack, Typography } from '@mui/material';
import { appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import SmsContactItem from './SmsContactItem';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
}

const EmailSmsContactWizard: React.FC = () => {
  const { t } = useTranslation('recapiti');
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const { defaultSMSAddress, defaultEMAILAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
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

  const emailValue = defaultEMAILAddress?.value ?? '';
  const smsValue = defaultSMSAddress?.value ?? '';

  const handleSubmit = (channelType: ChannelType, value: string) => {
    const source = externalEvent?.source ?? ContactSource.RECAPITI;
    PFEventStrategyFactory.triggerEvent(
      channelType === ChannelType.EMAIL
        ? PFEventsType.SEND_ADD_EMAIL_START
        : PFEventsType.SEND_ADD_SMS_START,
      {
        senderId: 'default',
        source,
      }
    );
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { channelType, value };
    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, 'default', channelType)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    handleCodeVerification(channelType);
  };

  const handleCodeVerification = (channelType: ChannelType, verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(
        channelType === ChannelType.EMAIL
          ? PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION
          : PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
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
          setModalOpen(ModalType.CODE);
          return;
        }

        PFEventStrategyFactory.triggerEvent(
          channelType === ChannelType.EMAIL
            ? PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS
            : PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
          { senderId: 'default', fromSercqSend: true }
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

  const handleCancelCode = async () => {
    setModalOpen(null);
    if (currentAddress.current.channelType === ChannelType.EMAIL && emailValue) {
      emailContactRef.current.toggleEdit();
      await emailContactRef.current.resetForm();
    } else if (currentAddress.current.channelType === ChannelType.SMS && smsValue) {
      smsContactRef.current.toggleEdit();
      await smsContactRef.current.resetForm();
    }
  };

  return (
    <Stack useFlexGap data-testid="emailSmsContactWizard">
      <Typography fontSize="22px" fontWeight={700} mb={{ xs: 2, lg: 3 }}>
        {t('legal-contacts.sercq-send-wizard.step_3.title')}
      </Typography>

      <Typography fontSize="16px" mb={{ xs: 3, lg: 4 }}>
        {t('legal-contacts.sercq-send-wizard.step_3.content')}
      </Typography>

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
      />

      {/* SMS */}
      {smsValue ? (
        <>
          <Divider sx={{ mt: 1, mb: 3 }} />
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
          />
        </>
      ) : (
        <SmsContactItem
          slotsProps={{
            textField: {
              sx: { flexBasis: { xs: 'unset', lg: '50%' } },
            },
            button: {
              sx: { height: '43px', fontWeight: 700, flexBasis: { xs: 'unset', lg: '25%' } },
            },
          }}
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
