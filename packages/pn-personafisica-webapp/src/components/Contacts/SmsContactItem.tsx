import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DisclaimerModal, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams, Sender } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DefaultDigitalContact from './DefaultDigitalContact';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import ExistingContactDialog from './ExistingContactDialog';
import SpecialDigitalContacts from './SpecialDigitalContacts';

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
}

const SmsContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSMSAddress, specialSMSAddresses, addresses, legalAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string; sender: Sender }>({
    value: '',
    sender: { senderId: 'dafault' },
  });
  const dispatch = useAppDispatch();

  const currentValue = defaultSMSAddress?.value ?? '';
  const blockDelete =
    specialSMSAddresses.length > 0 && currentAddress.current.sender.senderId === 'default';

  const handleSubmit = (value: string, sender: Sender = { senderId: 'default' }) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, sender.senderId);
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value, sender };
    // first check if contact already exists
    if (
      contactAlreadyExists(
        addresses,
        internationalPhonePrefix + value,
        sender.senderId,
        ChannelType.SMS
      )
    ) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    // disclaimer modal must be opened only when we are adding a default address and no legal address has been added
    if (sender.senderId === 'default' && legalAddresses.length === 0) {
      setModalOpen(ModalType.DISCLAIMER);
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
        currentAddress.current.sender.senderId
      );
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: currentAddress.current.sender.senderId,
      senderName: currentAddress.current.sender.senderName,
      channelType: ChannelType.SMS,
      value: internationalPhonePrefix + currentAddress.current.value,
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
          PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
          currentAddress.current.sender.senderId
        );

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.sms-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setModalOpen(null);
        if (currentValue && currentAddress.current.sender.senderId === 'default') {
          digitalContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
    if (currentValue && currentAddress.current.sender.senderId === 'default') {
      digitalContactRef.current.toggleEdit();
    }
    await digitalContactRef.current.resetForm();
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: currentAddress.current.sender.senderId,
        channelType: ChannelType.SMS,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_REMOVE_SMS_SUCCESS,
          currentAddress.current.sender.senderId
        );
      })
      .catch(() => {});
  };

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DefaultDigitalContact component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */

  return (
    <DigitalContactsCard
      title={t('courtesy-contacts.sms-title', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.sms-description', { ns: 'recapiti' })}
    >
      <DefaultDigitalContact
        label={t(`courtesy-contacts.sms-to-add`, { ns: 'recapiti' })}
        value={currentValue}
        channelType={ChannelType.SMS}
        ref={digitalContactRef}
        inputProps={{
          label: t(`courtesy-contacts.link-sms-placeholder`, {
            ns: 'recapiti',
          }),
          prefix: internationalPhonePrefix,
        }}
        insertButtonLabel={t(`courtesy-contacts.sms-add`, { ns: 'recapiti' })}
        onSubmit={handleSubmit}
        onDelete={() => {
          setModalOpen(ModalType.DELETE);
          // eslint-disable-next-line functional/immutable-data
          currentAddress.current = { value: currentValue, sender: { senderId: 'default' } };
        }}
      />
      {currentValue && (
        <SpecialDigitalContacts
          prefix={internationalPhonePrefix}
          digitalAddresses={specialSMSAddresses}
          channelType={ChannelType.SMS}
          onConfirm={(value: string, sender: Sender) => handleSubmit(value, sender)}
          onDelete={(value, sender) => {
            setModalOpen(ModalType.DELETE);
            // eslint-disable-next-line functional/immutable-data
            currentAddress.current = { value, sender };
          }}
        />
      )}
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value ?? ''}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      <DisclaimerModal
        open={modalOpen === ModalType.DISCLAIMER}
        onConfirm={() => {
          setModalOpen(null);
          handleCodeVerification();
        }}
        onCancel={handleCancelCode}
        confirmLabel={t('button.conferma')}
        checkboxLabel={t('button.capito')}
        content={t(`alert-dialog-sms`, { ns: 'recapiti' })}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.SMS}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-message`, {
          value: currentAddress.current.value,
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
    </DigitalContactsCard>
  );
};

export default SmsContactItem;
