import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Divider, Stack, Table, TableBody, Typography } from '@mui/material';
import { appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  DigitalAddress,
  SaveDigitalAddressParams,
  Sender,
} from '../../models/contacts';
import { Party } from '../../models/party';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import AddSpecialContactDialog from './AddSpecialContactDialog';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import SpecialContactElem from './SpecialContactItem';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE = 'delete',
  SPECIAL = 'special',
  VALIDATION = 'validation',
}

export type SpecialAddress = Omit<DigitalAddress, 'senderId' | 'senderName'> & {
  senders: Array<{ senderId: string; senderName?: string }>;
};

type Addresses = {
  [senderId: string]: Array<DigitalAddress>;
};

const SpecialContacts: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { addresses } = useAppSelector(contactsSelectors.selectAddresses);
  const [modalOpen, setModalOpen] = useState<{
    type: ModalType;
    data: { value: string; senders: Array<Party> };
  } | null>(null);

  const currentAddress = useRef<{ value: string; sender: Sender; channelType: ChannelType }>({
    value: '',
    sender: { senderId: 'dafault' },
    channelType: ChannelType.PEC,
  });

  const labelRoot =
    currentAddress.current.channelType === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts';
  const contactType = currentAddress.current.channelType.toLowerCase();

  const specialAddresses: Array<SpecialAddress> = addresses.reduce((arr, addr) => {
    const addressIndex = arr.findIndex((a) => a.value === addr.value);
    if (addressIndex === -1) {
      const specialAddress = {
        addressType: addr.addressType,
        channelType: addr.channelType,
        value: addr.value,
        pecValid: addr.pecValid,
        codeValid: addr.codeValid,
        senders: [{ senderId: addr.senderId, senderName: addr.senderName }],
      };
      // eslint-disable-next-line functional/immutable-data
      arr.push(specialAddress);
    } else {
      // eslint-disable-next-line functional/immutable-data
      arr[addressIndex].senders.push({ senderId: addr.senderId, senderName: addr.senderName });
    }
    return arr;
  }, [] as Array<SpecialAddress>);

  const sendSuccessEvent = (type: ChannelType) => {
    const event =
      type === ChannelType.PEC
        ? PFEventsType.SEND_ADD_PEC_UX_SUCCESS
        : type === ChannelType.SMS
        ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
        : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS;
    PFEventStrategyFactory.triggerEvent(event, currentAddress.current.sender.senderId);
  };

  const onConfirm = (
    value: string,
    addressType: ChannelType,
    sender: Sender = { senderId: 'default' }
  ) => {
    const event =
      addressType === ChannelType.PEC
        ? PFEventsType.SEND_ADD_PEC_START
        : addressType === ChannelType.SMS
        ? PFEventsType.SEND_ADD_SMS_START
        : PFEventsType.SEND_ADD_EMAIL_START;
    PFEventStrategyFactory.triggerEvent(event, sender.senderId); // TODO si dovrà passare un array di sender?

    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value, sender, channelType: addressType };

    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, sender.senderId, addressType)) {
      setModalOpen({
        type: ModalType.EXISTING,
        data: {
          value,
          senders: [
            {
              id: sender.senderId,
              name: sender.senderName ?? '',
            },
          ],
        },
      });
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      const event =
        currentAddress.current.channelType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_UX_CONVERSION
          : currentAddress.current.channelType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_UX_CONVERSION
          : PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION;
      PFEventStrategyFactory.triggerEvent(event, currentAddress.current.sender.senderId);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType:
        currentAddress.current.channelType === ChannelType.PEC
          ? AddressType.LEGAL
          : AddressType.COURTESY,
      senderId: currentAddress.current.sender.senderId,
      senderName: currentAddress.current.sender.senderName,
      channelType: currentAddress.current.channelType,
      value:
        currentAddress.current.channelType === ChannelType.SMS
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
          setModalOpen({
            type: ModalType.CODE,
            data: {
              value: currentAddress.current.value,
              senders: [
                {
                  id: currentAddress.current.sender.senderId,
                  name: currentAddress.current.sender.senderName ?? '',
                },
              ],
            },
          });
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
          setModalOpen(null);
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen({
          type: ModalType.VALIDATION,
          data: {
            value: currentAddress.current.value,
            senders: [
              {
                id: currentAddress.current.sender.senderId,
                name: currentAddress.current.sender.senderName ?? '',
              },
            ],
          },
        });
      })
      .catch(() => {});
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType:
          currentAddress.current.channelType === ChannelType.PEC
            ? AddressType.LEGAL
            : AddressType.COURTESY,
        senderId: currentAddress.current.sender.senderId,
        channelType: currentAddress.current.channelType,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(
          currentAddress.current.channelType === ChannelType.PEC
            ? PFEventsType.SEND_REMOVE_PEC_SUCCESS
            : currentAddress.current.channelType === ChannelType.SMS
            ? PFEventsType.SEND_REMOVE_SMS_SUCCESS
            : PFEventsType.SEND_REMOVE_EMAIL_SUCCESS,
          currentAddress.current.sender.senderId
        );
      })
      .catch(() => {});
  };

  const handleDelete = (
    value: string,
    channelType: ChannelType,
    sender: { senderId: string; senderName: string }
  ) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value, sender, channelType };
    setModalOpen({
      type: ModalType.DELETE,
      data: {
        value,
        senders: [
          {
            id: sender.senderId,
            name: sender.senderName,
          },
        ],
      },
    });
  };

  const handleEdit = (
    value: string,
    channelType: ChannelType,
    sender: { senderId: string; senderName: string }
  ) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value, sender, channelType };

    setModalOpen({
      type: ModalType.SPECIAL,
      data: {
        value,
        senders: [
          {
            id: sender.senderId,
            name: sender.senderName,
          },
        ],
      },
    });
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
    // await digitalContactRef.current.resetForm();
  };

  const groupedAddresses: Addresses = addresses
    .filter((a) => a.senderId !== 'default')
    .reduce((obj, a) => {
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
          onClick={() =>
            setModalOpen({ type: ModalType.SPECIAL, data: { value: '', senders: [] } })
          }
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
            <>
              {!isMobile && (
                <Table>
                  <TableBody>
                    {Object.entries(groupedAddresses).map(([senderId, addr]) => (
                      <SpecialContactElem
                        key={senderId}
                        addresses={addr}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
              {isMobile &&
                Object.entries(groupedAddresses).map(([senderId, addr]) => (
                  <>
                    <Stack key={senderId} sx={{ mt: 2 }}>
                      <SpecialContactElem
                        key={senderId}
                        addresses={addr}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                      <Divider sx={{ backgroundColor: 'white', color: 'text.secondary' }} />
                    </Stack>
                  </>
                ))}
            </>
          </CardContent>
        </Card>
      )}
      <AddSpecialContactDialog
        open={modalOpen?.type === ModalType.SPECIAL}
        value={modalOpen?.data.value ?? ''}
        senders={modalOpen?.data.senders ?? []}
        onDiscard={() => setModalOpen(null)}
        // ATTENZIONE
        // al momento le api non accettano più sender alla volta
        // per testare il giro, si utilizza sempre il primo sender
        onConfirm={(value: string, addressType: ChannelType, senders: Array<Party>) => {
          setModalOpen(null);
          onConfirm(value, addressType, { senderId: senders[0].id, senderName: senders[0].name });
        }}
        digitalAddresses={specialAddresses}
        channelType={currentAddress.current.channelType}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={
          currentAddress.current.channelType === ChannelType.PEC
            ? AddressType.LEGAL
            : AddressType.COURTESY
        }
        channelType={currentAddress.current.channelType}
        open={modalOpen?.type === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)} // TODO fix event type
      />
      <DeleteDialog
        showModal={modalOpen?.type === ModalType.DELETE}
        removeModalTitle={t(`special-contacts.remove-special-title`, {
          ns: 'recapiti',
          contactValue: currentAddress.current.value,
        })}
        removeModalBody={t(`special-contacts.remove-special-description`, {
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
      />
    </>
  );
};

export default SpecialContacts;
