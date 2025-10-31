import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { EventAction, SERCQ_SEND_VALUE, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
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
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import { isPFEvent } from '../../utility/mixpanel';
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

const SpecialContacts: React.FC<{ addressType: AddressType; channelType?: ChannelType }> = ({
  addressType,
  channelType,
}) => {
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

  const specialContactItemRef = useRef<{ toggleEdit: () => void }>({
    toggleEdit: () => {},
  });

  const labelRoot = `${addressType.toLowerCase()}-contacts`;
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

  const handleEdit = (
    value: string,
    channelType: ChannelType,
    sender: Sender = { senderId: 'default' }
  ) => {
    const eventKey = `SEND_ADD_${channelType}_START`;
    if (isPFEvent(eventKey)) {
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], {
        senderId: sender.senderId,
        source: ContactSource.RECAPITI,
      });
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

    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode || currentAddress.current.channelType === ChannelType.SERCQ_SEND) {
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
      addressType,
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
    PFEventStrategyFactory.triggerEvent(
      currentAddress.current.channelType === ChannelType.SERCQ_SEND
        ? PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CONTINUE
        : PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE,
      {
        event_type: EventAction.ACTION,
        addresses,
        customized_contact: true,
      }
    );
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType,
        senderId: currentAddress.current.senderId,
        channelType: currentAddress.current.channelType,
      })
    )
      .unwrap()
      .then(() => {
        const eventKey = `SEND_REMOVE_${currentAddress.current.channelType}_SUCCESS`;
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
    PFEventStrategyFactory.triggerEvent(
      channelType === ChannelType.SERCQ_SEND
        ? PFEventsType.SEND_REMOVE_SERCQ_SEND_START
        : PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_START,
      {
        event_type: EventAction.ACTION,
        addresses,
        customized_contact: true,
      }
    );

    PFEventStrategyFactory.triggerEvent(
      channelType === ChannelType.SERCQ_SEND
        ? PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP
        : PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP,
      {
        event_type: EventAction.SCREEN_VIEW,
        addresses,
        customized_contact: true,
      }
    );
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = {
      value,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType,
    };
    setModalOpen(ModalType.DELETE);
  };

  const handleCloseModal = () => {
    PFEventStrategyFactory.triggerEvent(
      currentAddress.current.channelType === ChannelType.SERCQ_SEND
        ? PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CANCEL
        : PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL,
      {
        event_type: EventAction.ACTION,
        addresses,
        customized_contact: true,
      }
    );
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
      addr.addressType === addressType &&
      (channelType ? addr.channelType === channelType : true) &&
      arr.findIndex(
        (el) =>
          addr.senderId === el.senderId &&
          (addr.channelType !== el.channelType || addr.value !== el.value) &&
          el.channelType === ChannelType.PEC &&
          !el.pecValid
      ) === -1
  );

  const groupedAddresses = uniqueAddresses.reduce<
    Array<{ senderId: string; addresses: Array<DigitalAddress> }>
  >((arr, addr) => {
    const addrIndex = arr.findIndex((el) => el.senderId === addr.senderId);
    if (addrIndex === -1) {
      // eslint-disable-next-line functional/immutable-data
      arr.push({ senderId: addr.senderId, addresses: [addr] });
    } else {
      // eslint-disable-next-line functional/immutable-data
      arr[addrIndex].addresses.push(addr);
    }
    return arr;
  }, []);

  return (
    <>
      <Card sx={{ mt: 3, backgroundColor: 'grey.50', borderRadius: 0.5 }}>
        <CardContent data-testid="specialContacts" sx={{ padding: 2 }}>
          <Typography fontSize="14px" fontWeight={700} mb={3}>
            {t('special-contacts.card-title', { ns: 'recapiti' })}
          </Typography>
          {addressType === AddressType.COURTESY && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>
                {t(`special-contacts.courtesy-banner.title`, {
                  ns: 'recapiti',
                })}
              </AlertTitle>
              {t(`special-contacts.courtesy-banner.description`, {
                ns: 'recapiti',
              })}
            </Alert>
          )}
          <Stack
            spacing={3}
            divider={<Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }} />}
          >
            {groupedAddresses.map((group) => (
              <Box key={`sender-${group.senderId}`}>
                {group.addresses.map((addr, index) => (
                  <SpecialContactItem
                    specialContactItemRef={specialContactItemRef}
                    key={`sender-${group.senderId}-${addr.channelType.toLowerCase()}`}
                    address={addr}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCancelValidation={handleCancelValidation}
                    showSenderName={index === 0}
                  />
                ))}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
      {addressType === AddressType.LEGAL && (
        <ContactCodeDialog
          value={currentAddress.current.value}
          addressType={addressType}
          channelType={currentAddress.current.channelType}
          open={modalOpen === ModalType.CODE}
          onConfirm={(code) => handleCodeVerification(code)}
          onDiscard={handleCloseModal}
          onError={() => sendCodeErrorEvent(currentAddress.current.channelType)}
        />
      )}
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={
          currentAddress.current.channelType === ChannelType.SERCQ_SEND
            ? t('legal-contacts.remove-sercq_send-title', { ns: 'recapiti' })
            : t('special-contacts.remove-special-title', {
                ns: 'recapiti',
                contactValue: currentAddress.current.value,
              })
        }
        removeModalBody={
          currentAddress.current.channelType === ChannelType.SERCQ_SEND ? (
            <Trans
              i18nKey="legal-contacts.remove-sercq_send-message"
              ns="recapiti"
              components={[
                <Typography variant="body2" fontSize="18px" key="paragraph1" sx={{ mb: 2 }} />,
                <Typography variant="body2" fontSize="18px" key="paragraph2" />,
              ]}
            />
          ) : (
            t('special-contacts.remove-special-description', { ns: 'recapiti' })
          )
        }
        handleModalClose={handleCloseModal}
        confirmHandler={deleteConfirmHandler}
        slotsProps={
          currentAddress.current.channelType === ChannelType.SERCQ_SEND
            ? {
                primaryButton: {
                  onClick: handleCloseModal,
                  label: t('button.annulla'),
                },
                secondaryButton: {
                  onClick: deleteConfirmHandler,
                  label: t('legal-contacts.remove-sercq_send-confirm', { ns: 'recapiti' }),
                  variant: 'outlined',
                  color: 'error',
                },
              }
            : undefined
        }
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
