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
  const [modalOpen, setModalOpen] = useState<{
    type: ModalType;
    data: { value: string; sender: Sender };
  } | null>(null);
  const dispatch = useAppDispatch();

  const value = defaultSMSAddress?.value ?? '';
  const blockDelete = specialSMSAddresses.length > 0;

  const handleSubmit = (value: string, sender: Sender = { senderId: 'default' }) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, sender.senderId);
    // first check if contact already exists
    if (
      contactAlreadyExists(
        addresses,
        internationalPhonePrefix + value,
        sender.senderId,
        ChannelType.SMS
      )
    ) {
      setModalOpen({ type: ModalType.EXISTING, data: { value, sender } });
      return;
    }
    // disclaimer modal must be opened only when we are adding a default address and no legal address has been added
    if (sender.senderId === 'default' && legalAddresses.length === 0) {
      setModalOpen({ type: ModalType.DISCLAIMER, data: { value, sender } });
      return;
    }
    handleCodeVerification(value, sender);
  };

  const handleCodeVerification = (
    value: string,
    sender: Sender = { senderId: 'default' },
    verificationCode?: string
  ) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, sender.senderId);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType: ChannelType.SMS,
      value: internationalPhonePrefix + value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          // aprire la code modal
          setModalOpen({ type: ModalType.CODE, data: { value, sender } });
          return;
        }

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_SUCCESS, sender.senderId);

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
        if (value && sender.senderId === 'default') {
          digitalContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleCancelCode = async (sender: Sender = { senderId: 'default' }) => {
    setModalOpen(null);
    if (value && sender.senderId === 'default') {
      digitalContactRef.current.toggleEdit();
    }
    await digitalContactRef.current.resetForm();
  };

  const deleteConfirmHandler = (sender: Sender = { senderId: 'default' }) => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: sender.senderId,
        channelType: ChannelType.SMS,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_SUCCESS, sender.senderId);
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
        value={value}
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
        onDelete={() =>
          setModalOpen({
            type: ModalType.DELETE,
            data: { value, sender: { senderId: 'default' } },
          })
        }
      />
      <ExistingContactDialog
        open={modalOpen?.type === ModalType.EXISTING}
        value={modalOpen?.data.value ?? ''}
        handleDiscard={() => handleCancelCode(modalOpen?.data.sender)}
        handleConfirm={() =>
          handleCodeVerification(modalOpen?.data.value ?? '', modalOpen?.data.sender)
        }
      />
      <DisclaimerModal
        open={modalOpen?.type === ModalType.DISCLAIMER}
        onConfirm={() => {
          setModalOpen(null);
          handleCodeVerification(modalOpen?.data.value ?? '', modalOpen?.data.sender);
        }}
        onCancel={() => handleCancelCode(modalOpen?.data.sender)}
        confirmLabel={t('button.conferma')}
        checkboxLabel={t('button.capito')}
        content={t(`alert-dialog-sms`, { ns: 'recapiti' })}
      />
      <ContactCodeDialog
        value={modalOpen?.data.value ?? ''}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.SMS}
        open={modalOpen?.type === ModalType.CODE}
        onConfirm={(code) =>
          handleCodeVerification(modalOpen?.data.value ?? '', modalOpen?.data.sender, code)
        }
        onDiscard={() => handleCancelCode(modalOpen?.data.sender)}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)}
      />
      <DeleteDialog
        showModal={modalOpen?.type === ModalType.DELETE}
        removeModalTitle={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-message`, {
          value: modalOpen?.data.value ?? '',
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      {value && (
        <SpecialDigitalContacts
          prefix={internationalPhonePrefix}
          digitalAddresses={specialSMSAddresses}
          channelType={ChannelType.SMS}
          handleConfirm={(value: string, sender: Sender) => handleSubmit(value, sender)}
        />
      )}
    </DigitalContactsCard>
  );
};

export default SmsContactItem;
