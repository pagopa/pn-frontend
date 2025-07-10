import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Button, ButtonProps, Chip, Typography } from '@mui/material';
import { PnInfoCard, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InformativeDialog from './InformativeDialog';
import SmsContactItem from './SmsContactItem';

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
  INFORMATIVE = 'informative',
}

type Props = {
  slotsProps?: {
    nextButton?: ButtonProps;
    exitButton?: ButtonProps;
  };
};

const EmailContactItem: React.FC<Props> = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const {
    defaultSERCQ_SENDAddress,
    defaultPECAddress,
    defaultEMAILAddress,
    defaultSMSAddress,
    specialEMAILAddresses,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;
  const isEmailActive = !!defaultEMAILAddress;

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string }>({
    value: '',
  });
  const dispatch = useAppDispatch();

  const currentValue = defaultEMAILAddress?.value ?? '';
  const blockDelete = specialEMAILAddresses.length > 0;

  const handleSubmit = (value: string) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_START, {
      senderId: 'default',
      source: ContactSource.RECAPITI,
    });
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value };
    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, 'default', ChannelType.EMAIL)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    if (!isDigitalDomicileActive) {
      setModalOpen(ModalType.INFORMATIVE);
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION, 'default');
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
        // contact to verify
        // open code modal
        if (!res) {
          // aprire la code modal
          setModalOpen(ModalType.CODE);
          return;
        }

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS, {
          senderId: 'default',
          fromSercqSend: true,
        });

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.email-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setModalOpen(null);
        if (currentValue) {
          digitalContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
    if (currentValue) {
      digitalContactRef.current.toggleEdit();
    }
    await digitalContactRef.current.resetForm();
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.EMAIL,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_EMAIL_SUCCESS, 'default');
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.email-removed-successfully`, { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  const getChipColor = () => {
    if (isEmailActive) {
      return 'success';
    }
    if (defaultSERCQ_SENDAddress && !hasCourtesyAddresses) {
      return 'warning';
    }
    return 'default';
  };

  const getRemoveModalTitle = () => {
    if (isDigitalDomicileActive) {
      return t(`courtesy-contacts.remove-email-title-dod-enabled`, {
        ns: 'recapiti',
      });
    }
    return t(`courtesy-contacts.remove-email`, { ns: 'recapiti' });
  };

  const getRemoveModalMessage = () => {
    if (isDigitalDomicileActive) {
      return (
        <Trans
          i18nKey={'courtesy-contacts.remove-address-message-dod-enabled'}
          ns={'recapiti'}
          components={[
            <Typography variant="body2" fontSize={'18px'} key={'paragraph1'} sx={{ mb: 2 }} />,
            <Typography variant="body2" fontSize={'18px'} key={'paragraph2'} />,
          ]}
        />
      );
    }
    return t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-email-message`, {
      value: currentAddress.current.value,
      ns: 'recapiti',
    });
  };

  const getActions = () =>
    isEmailActive
      ? [
          <Button
            data-testid="disable-email"
            key="disable"
            variant="naked"
            color="error"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => {
              setModalOpen(ModalType.DELETE);
              // eslint-disable-next-line functional/immutable-data
              currentAddress.current = { value: currentValue };
            }}
            sx={{ p: '10px 16px' }}
          >
            {t('button.disable')}
          </Button>,
        ]
      : undefined;

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContact component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <PnInfoCard
      title={
        <Typography
          variant="h6"
          fontSize={{ xs: '22px', lg: '24px' }}
          fontWeight={700}
          mb={2}
          data-testid="emailContactTitle"
        >
          {t('courtesy-contacts.email-title', { ns: 'recapiti' })}
        </Typography>
      }
      subtitle={
        <Chip
          label={t(`status.${isEmailActive ? 'active' : 'inactive'}`, { ns: 'recapiti' })}
          color={getChipColor()}
          size="small"
          sx={{ mb: 2 }}
        />
      }
      actions={getActions()}
      expanded={isEmailActive}
      data-testid="emailContact"
      slotProps={{ Card: { id: 'emailContactSection' } }}
    >
      {!isEmailActive && (
        <Typography variant="body1" fontSize={{ xs: '14px', lg: '16px' }} mb={3}>
          {t('courtesy-contacts.email-empty-description', { ns: 'recapiti' })}
        </Typography>
      )}
      <DigitalContact
        label={t(`courtesy-contacts.email-to-add`, { ns: 'recapiti' })}
        value={currentValue}
        channelType={ChannelType.EMAIL}
        ref={digitalContactRef}
        inputProps={{
          label: t(`courtesy-contacts.link-email-placeholder`, {
            ns: 'recapiti',
          }),
        }}
        insertButtonLabel={t(`courtesy-contacts.email-add`, { ns: 'recapiti' })}
        onSubmit={handleSubmit}
      />
      {isEmailActive && (
        <Typography variant="body1" fontSize={{ xs: '14px', lg: '16px' }} mt={2}>
          {t('courtesy-contacts.email-filled-description', { ns: 'recapiti' })}
        </Typography>
      )}
      {!defaultSMSAddress && <SmsContactItem />}
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={getRemoveModalTitle()}
        removeModalBody={getRemoveModalMessage()}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
        channelType={ChannelType.EMAIL}
        slotsProps={{
          cancelButton: { variant: isDigitalDomicileActive ? 'contained' : 'outlined' },
          nextButton: {
            variant: isDigitalDomicileActive ? 'outlined' : 'contained',
            children: isDigitalDomicileActive
              ? "{t(`courtesy-contacts.remove-email}`, { ns: 'recapiti' })}"
              : "{t('button.conferma')}",
          },
        }}
      />
      <InformativeDialog
        open={modalOpen === ModalType.INFORMATIVE}
        title={t('courtesy-contacts.info-modal-email-title', { ns: 'recapiti' })}
        subtitle={t('courtesy-contacts.info-modal-email-subtitle', { ns: 'recapiti' })}
        content={t('courtesy-contacts.info-modal-email-content', { ns: 'recapiti' })}
        onConfirm={() => handleCodeVerification()}
        onDiscard={() => setModalOpen(null)}
      />
    </PnInfoCard>
  );
};

export default EmailContactItem;
