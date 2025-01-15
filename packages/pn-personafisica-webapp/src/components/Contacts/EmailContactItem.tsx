import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
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

const EmailSmsComponent: React.FC = () => {
  const { t } = useTranslation(['recapiti']);

  const [insertMode, setInsertMode] = useState(false);

  return (
    <Box mt={3}>
      <Divider />
      {insertMode ? (
        <Box mt={3}>
          <SmsContactItem onCancelInsert={() => setInsertMode(false)} />
        </Box>
      ) : (
        <>
          <Typography variant="body1" fontWeight={600} fontSize="16px" mt={3} mb={1}>
            {t('courtesy-contacts.email-sms-updates')}
          </Typography>
          <Button variant="naked" sx={{ fontSize: '16px' }} onClick={() => setInsertMode(true)}>
            {t('courtesy-contacts.email-sms-add')}
          </Button>
        </>
      )}
    </Box>
  );
};

const EmailContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const {
    defaultEMAILAddress,
    defaultSMSAddress,
    specialEMAILAddresses,
    defaultSERCQ_SENDAddress,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const isActive = !!defaultEMAILAddress;

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
    if (!defaultSERCQ_SENDAddress) {
      setModalOpen(ModalType.INFORMATIVE);
      return;
    }
    // disclaimer modal must be opened only when we are adding a default address
    /* if (legalAddresses.length === 0) {
      setModalOpen(ModalType.DISCLAIMER);
      return;
    } */
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

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS, 'default');

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
    if (isActive) {
      return 'success';
    }
    if (defaultSERCQ_SENDAddress && !hasCourtesyAddresses) {
      return 'warning';
    }
    return 'default';
  };

  const getActions = () =>
    isActive
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
            {t('disable', { ns: 'recapiti' })}
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
          label={t(`status.${isActive ? 'active' : 'inactive'}`, { ns: 'recapiti' })}
          color={getChipColor()}
          size="small"
          sx={{ mb: 2 }}
        />
      }
      actions={getActions()}
      expanded={isActive}
      data-testid="emailContact"
    >
      {!isActive && (
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
      {isActive && (
        <Typography variant="body1" fontSize={{ xs: '14px', lg: '16px' }} mt={2}>
          {t('courtesy-contacts.email-filled-description', { ns: 'recapiti' })}
        </Typography>
      )}
      {!defaultSMSAddress && <EmailSmsComponent />}
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      {/* <DisclaimerModal
        open={modalOpen === ModalType.DISCLAIMER}
        onConfirm={() => {
          setModalOpen(null);
          handleCodeVerification();
        }}
        onCancel={handleCancelCode}
        confirmLabel={t('button.conferma')}
        checkboxLabel={t('button.capito')}
        content={t(`alert-dialog-email`, { ns: 'recapiti' })}
      /> */}
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
        removeModalTitle={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-email-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-email-message`, {
          value: currentAddress.current.value,
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
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
