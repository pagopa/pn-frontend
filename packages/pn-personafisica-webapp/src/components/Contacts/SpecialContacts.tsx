import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
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
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
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

const isPFEvent = (eventKey: string): eventKey is keyof typeof PFEventsType =>
  Object.keys(PFEventsType).includes(eventKey);

const SpecialContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { addresses, specialAddresses, defaultPECAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
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

  const sendSuccessEvent = (type: ChannelType) => {
    const eventKey = `SEND_ADD_${type}_UX_SUCCESS`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], currentAddress.current.senderId);
    }
  };

  const sendCodeErrorEvent = (type: ChannelType) => {
    const eventKey = `SEND_ADD_${type}_CODE_ERROR`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey]);
    }
  };

  const onConfirm = (
    value: string,
    channelType: ChannelType,
    sender: Sender = { senderId: 'default' }
  ) => {
    const eventKey = `SEND_ADD_${channelType}_UX_START`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], sender.senderId);
    }

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
    setModalOpen(ModalType.CONFIRM_LEGAL_ASSOCIATION);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      const eventKey = `SEND_ADD_${currentAddress.current.channelType}_UX_CONVERSION`;
      if (isPFEvent(eventKey)) {
        PFEventStrategyFactory.triggerEvent(
          PFEventsType[eventKey],
          currentAddress.current.senderId
        );
      }
    }

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

        sendSuccessEvent(currentAddress.current.channelType);

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
        addressType: AddressType.LEGAL,
        senderId: currentAddress.current.senderId,
        channelType: currentAddress.current.channelType,
      })
    )
      .unwrap()
      .then(() => {
        const eventKey = `SEND_REMOVE_${currentAddress.current.channelType}_UX_SUCCESS`;
        if (isPFEvent(eventKey)) {
          PFEventStrategyFactory.triggerEvent(
            PFEventsType[eventKey],
            currentAddress.current.senderId
          );
        }
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
      <Typography sx={{ mt: 3 }} variant="body2" fontSize="14px" color="text.secondary">
        <Trans
          i18nKey="special-contacts.description"
          ns="recapiti"
          components={[
            <ButtonNaked
              key="addSpecialContactButton"
              onClick={() => setModalOpen(ModalType.SPECIAL)}
              color="primary"
              data-testid="addSpecialContactButton"
              sx={{ top: '-2px' }}
            />,
          ]}
        />
      </Typography>
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
              {Object.entries(groupedAddresses).map(([senderId, addr], index) => (
                <SpecialContactItem
                  index={index}
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
        onConfirm={(value: string, channelType: ChannelType, sender: Sender) => {
          setModalOpen(null);
          onConfirm(value, channelType, sender);
        }}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.LEGAL}
        channelType={currentAddress.current.channelType}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => sendCodeErrorEvent(currentAddress.current.channelType)}
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
