import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  AddressType,
  ChannelType,
  DigitalAddress,
  SERCQ_SEND_VALUE,
  SaveDigitalAddressParams,
  Sender,
} from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import AddSpecialContactDialog from './AddSpecialContactDialog';
import CancelVerificationModal from './CancelVerificationModal';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import ExistingContactDialog from './ExistingContactDialog';
import LegalContactAssociationDialog from './LegalContactAssociationDialog';
import PecVerificationDialog from './PecVerificationDialog';
import SpecialContactItem from './SpecialContactItem';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE = 'delete',
  SPECIAL = 'special',
  VALIDATION = 'validation',
  CANCEL_VALIDATION = 'cancel_validation',
  CONFIRM_LEGAL_ASSOCIATION = 'confirm_legal_association',
}

type Addresses = {
  [senderId: string]: Array<DigitalAddress>;
};

const SpecialContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { addresses, specialAddresses, defaultPECAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const currentAddress = useRef<DigitalAddress>({
    value: '',
    senderId: 'default',
    addressType: AddressType.LEGAL,
    channelType: ChannelType.PEC,
  });

  const labelRoot = `${currentAddress.current.addressType.toLowerCase()}-contacts`;
  const contactType = currentAddress.current.channelType.toLowerCase();

  const onConfirm = (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender = { senderId: 'default' }
  ) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
      addressType,
    };

    if (addressType === AddressType.LEGAL) {
      setModalOpen(ModalType.CONFIRM_LEGAL_ASSOCIATION);
      return;
    }

    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, sender.senderId, channelType)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    handleCodeVerification();
  };

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
      addressType: currentAddress.current.addressType,
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
        addressType: currentAddress.current.addressType,
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
      })
      .catch(() => {});
  };

  const handleDelete = (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
      addressType,
    };
    setModalOpen(ModalType.DELETE);
  };

  const handleEdit = (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
      addressType,
    };
    setModalOpen(ModalType.SPECIAL);
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

  const handleCreateNewAssociation = (sender: Sender) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      ...currentAddress.current,
      senderId: sender.senderId,
      senderName: sender.senderName,
    };

    setModalOpen(ModalType.SPECIAL);
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
  };

  const groupedAddresses: Addresses = specialAddresses.reduce((obj, a) => {
    if (!obj[a.senderId]) {
      // eslint-disable-next-line functional/immutable-data
      obj[a.senderId] = [];
    }
    // eslint-disable-next-line functional/immutable-data
    obj[a.senderId].push(a);
    return obj;
  }, {} as Addresses);

  return (
    <>
      <Stack spacing={2}>
        <Typography id="specialContact" variant="h6" fontWeight={600} fontSize={28}>
          {t('special-contacts.title', { ns: 'recapiti' })}
        </Typography>
        <Typography sx={{ mt: 2 }} variant="body1">
          {t('special-contacts.description', { ns: 'recapiti' })}
        </Typography>
        <ButtonNaked
          component={Typography}
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(ModalType.SPECIAL)}
          color="primary"
          size="small"
          pt={1}
          sx={{ alignSelf: 'flex-start' }}
          data-testid="addSpecialContactButton"
        >
          {t('special-contacts.add-contact', { ns: 'recapiti' })}
        </ButtonNaked>
      </Stack>
      {Object.keys(groupedAddresses).length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="body1" fontWeight={700}>
              {t('special-contacts.card-title', { ns: 'recapiti' })}
            </Typography>
            {!isMobile && (
              <Stack direction="row" spacing={6} mt={3}>
                <Typography variant="caption" fontWeight={600} sx={{ width: '224px' }}>
                  {t(`special-contacts.senders`, { ns: 'recapiti' })}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {t('special-contacts.contacts', { ns: 'recapiti' })}
                </Typography>
              </Stack>
            )}
            <Stack divider={<Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }} />}>
              {Object.entries(groupedAddresses).map(([senderId, addr]) => (
                <SpecialContactItem
                  key={`sender-${senderId}`}
                  addresses={addr}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCancelValidation={handleCancelValidation}
                  handleCreateNewAssociation={handleCreateNewAssociation}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
      <AddSpecialContactDialog
        open={modalOpen === ModalType.SPECIAL}
        value={currentAddress.current.value ?? ''}
        sender={{
          senderId: currentAddress.current.senderId,
          senderName: currentAddress.current.senderName,
        }}
        channelType={currentAddress.current.channelType}
        onDiscard={handleCloseModal}
        onConfirm={(
          value: string,
          channelType: ChannelType,
          addressType: AddressType,
          sender: Sender
        ) => {
          setModalOpen(null);
          onConfirm(value, channelType, addressType, sender);
        }}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={currentAddress.current.addressType}
        channelType={currentAddress.current.channelType}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`special-contacts.remove-special-title`, {
          ns: 'recapiti',
          contactValue:
            currentAddress.current.channelType === ChannelType.SERCQ_SEND
              ? t(`legal-contacts.sercq-send-title`, {
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
      <LegalContactAssociationDialog
        open={modalOpen === ModalType.CONFIRM_LEGAL_ASSOCIATION}
        senderName={currentAddress.current.senderName ?? ''}
        newAddressValue={
          currentAddress.current.channelType === ChannelType.PEC
            ? currentAddress.current.value
            : t('special-contacts.sercq_send', { ns: 'recapiti' })
        }
        oldAddressValue={
          defaultPECAddress
            ? defaultPECAddress.value
            : t('special-contacts.sercq_send', { ns: 'recapiti' })
        }
        handleClose={handleCloseModal}
        handleConfirm={() => handleCodeVerification()}
      />
    </>
  );
};

export default SpecialContacts;
