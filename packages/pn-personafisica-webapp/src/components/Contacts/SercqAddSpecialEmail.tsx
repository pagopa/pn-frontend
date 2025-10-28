/* eslint-disable functional/immutable-data */
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
}

const SercqAddSpecialEmail = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const addressesData = useAppSelector(contactsSelectors.selectAddresses);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const { defaultEMAILAddress } = addressesData || {};

  const currentAddress = useRef<{ channelType: ChannelType; value: string }>({
    channelType: ChannelType.EMAIL,
    value: '',
  });
  const emailContactRef = useRef<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
    closeEditMode: () => void;
  }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
    closeEditMode: () => {},
  });

  const handleSubmit = (channelType: ChannelType, value: string) => {
    if (!defaultEMAILAddress) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_START
      );
    }

    currentAddress.current = { channelType, value };
    if (contactAlreadyExists(addressesData.addresses, value, 'default', channelType)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    handleCodeVerification();
  };

  const handleCloseCodeDialog = () => {
    const eventToTrigger = defaultEMAILAddress
      ? PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_BACK
      : PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_BACK;

    PFEventStrategyFactory.triggerEvent(eventToTrigger);
    setModalOpen(null);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      const eventToTrigger = defaultEMAILAddress
        ? PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_CONVERSION
        : PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION;

      PFEventStrategyFactory.triggerEvent(eventToTrigger);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.EMAIL,
      value: currentAddress.current.value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        const eventToTrigger = defaultEMAILAddress
          ? PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_SUCCESS
          : PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS;

        PFEventStrategyFactory.triggerEvent(eventToTrigger);

        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.email-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setModalOpen(null);
        emailContactRef.current.closeEditMode();
      })
      .catch(() => {});
  };

  return (
    <>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCloseCodeDialog}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR)}
      />
      <DigitalContact
        label={t(`courtesy-contacts.email-to-add`, { ns: 'recapiti' })}
        value={defaultEMAILAddress ? defaultEMAILAddress.value : ''}
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
        slots={{ label: () => <></> }}
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
        onEditButtonClickCallback={() =>
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_START
          )
        }
        onEditCancelCallback={() =>
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CANCEL
          )
        }
        onEditConfirmCallback={() =>
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CONTINUE
          )
        }
      />
    </>
  );
};

export default SercqAddSpecialEmail;
