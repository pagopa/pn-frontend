import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { SERCQ_SEND_VALUE, appStateActions } from '@pagopa-pn/pn-commons';

import {
  AddressType,
  ChannelType,
  ContactOperation,
  ContactSource,
  DigitalAddress,
  SaveDigitalAddressParams,
  Sender,
} from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import CancelVerificationModal from './CancelVerificationModal';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import ExistingContactDialog from './ExistingContactDialog';
import PecVerificationDialog from './PecVerificationDialog';
import SpecialContactItem from './SpecialContactItem';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE = 'delete',
  VALIDATION = 'validation',
  CANCEL_VALIDATION = 'cancel_validation',
}

const SpecialContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const { addresses, specialAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const currentAddress = useRef<
    Pick<DigitalAddress, 'value' | 'senderId' | 'senderName' | 'channelType'>
  >({
    value: '',
    senderId: 'default',
    channelType: ChannelType.PEC,
  });

  const labelRoot = `legal-contacts`;
  const contactType = currentAddress.current.channelType.toLowerCase();

  const handleCodeVerification = (verificationCode?: string) => {
    // eslint-disable-next-line functional/no-let
    let value = currentAddress.current.value;
    if (currentAddress.current.channelType === ChannelType.SMS) {
      value = internationalPhonePrefix + value;
    }
    if (currentAddress.current.channelType === ChannelType.SERCQ_SEND) {
      value = SERCQ_SEND_VALUE;
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: currentAddress.current.senderId,
      senderName: currentAddress.current.senderName,
      channelType: currentAddress.current.channelType,
      value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        // contact has already been verified
        if (res.pecValid || currentAddress.current.channelType !== ChannelType.PEC) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${labelRoot}.${contactType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );
          handleCloseModal();
          // init the flux to add the courtesy address
          dispatch(
            setExternalEvent({
              source: ContactSource.RECAPITI,
              destination: ChannelType.SERCQ_SEND,
              operation: ContactOperation.ADD_COURTESY,
            })
          );
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
      })
      .catch(() => {});
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: currentAddress.current.senderId,
        channelType: currentAddress.current.channelType,
      })
    )
      .unwrap()
      .then(() => {
        // reset current address
        // eslint-disable-next-line functional/immutable-data
        currentAddress.current = {
          ...currentAddress.current,
          value: '',
          senderId: 'default',
          senderName: undefined,
        };
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`${labelRoot}.${contactType}-removed-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
      })
      .catch(() => {});
  };

  const handleDelete = (value: string, channelType: ChannelType, sender: Sender) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
    };
    setModalOpen(ModalType.DELETE);
  };

  const handleEdit = (value: string, channelType: ChannelType, sender: Sender) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
    };

    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, sender.senderId, channelType)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }

    handleCodeVerification();
  };

  const handleCloseModal = () => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      ...currentAddress.current,
      value: '',
      senderId: 'default',
      senderName: undefined,
    };
    setModalOpen(null);
  };

  const handleCancelValidation = (senderId: string) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      ...currentAddress.current,
      senderId,
    };
    setModalOpen(ModalType.CANCEL_VALIDATION);
  };

  /**
   * Case: we have a SERCQ SEND enabled on a sender and we decide to add a PEC for the same sender.
   * Until when the PEC is not validated, we will have the SERCQ SEND address and the PEC address.
   * This leads to an error, because on the interface we will show both the addresses.
   */
  const uniqueAddresses: Array<DigitalAddress> = specialAddresses.filter(
    (addr, _, arr) =>
      arr.findIndex(
        (el) =>
          addr.senderId === el.senderId &&
          (addr.channelType !== el.channelType || addr.value !== el.value) &&
          el.channelType === ChannelType.PEC &&
          !el.pecValid
      ) === -1
  );

  return (
    <>
      <Card sx={{ mt: 3, backgroundColor: 'grey.50', borderRadius: 0.5 }}>
        <CardContent data-testid="specialContacts" sx={{ padding: 2 }}>
          <Typography fontSize="14px" fontWeight={700} mb={3}>
            {t('special-contacts.card-title', { ns: 'recapiti' })}
          </Typography>
          <Stack
            spacing={3}
            divider={<Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }} />}
          >
            {uniqueAddresses.map((addr) => (
              <SpecialContactItem
                key={`sender-${addr.senderId}`}
                address={addr}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCancelValidation={handleCancelValidation}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.LEGAL}
        channelType={currentAddress.current.channelType}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCloseModal}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`special-contacts.remove-special-title`, {
          ns: 'recapiti',
          contactValue:
            currentAddress.current.channelType === ChannelType.SERCQ_SEND
              ? t(`legal-contacts.sercq_send-title`, {
                  ns: 'recapiti',
                })
              : currentAddress.current.value,
        })}
        removeModalBody={t(`special-contacts.remove-special-description`, {
          ns: 'recapiti',
        })}
        handleModalClose={handleCloseModal}
        confirmHandler={deleteConfirmHandler}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={handleCloseModal}
      />
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCloseModal}
        handleConfirm={() => handleCodeVerification()}
      />
      <CancelVerificationModal
        open={modalOpen === ModalType.CANCEL_VALIDATION}
        senderId={currentAddress.current.senderId}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default SpecialContacts;
