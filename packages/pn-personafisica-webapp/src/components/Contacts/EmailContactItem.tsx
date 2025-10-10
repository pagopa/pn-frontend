import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Button, Chip, Divider, Typography } from '@mui/material';
import { PnInfoCard, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { createOrUpdateAddress, removeSercqAndEmail } from '../../redux/contact/actions';
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
import SpecialContacts from './SpecialContacts';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE_PRECONFIRM = 'delete_preconfirm',
  DELETE = 'delete',
  INFORMATIVE = 'informative',
}

const EmailContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const {
    defaultSERCQ_SENDAddress,
    defaultPECAddress,
    defaultEMAILAddress,
    defaultSMSAddress,
    specialAddresses,
    specialEMAILAddresses,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;
  const isEmailActive = !!defaultEMAILAddress;
  const hasAnySERCQAddrEnabled =
    !!defaultSERCQ_SENDAddress ||
    specialAddresses.some((addr) => addr.channelType === ChannelType.SERCQ_SEND);

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

  const showSpecialContactsSection = !defaultSMSAddress
    ? specialAddresses.filter((addr) => addr.addressType === AddressType.COURTESY).length > 0
    : specialEMAILAddresses.length > 0;

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string }>({
    value: '',
  });
  const dispatch = useAppDispatch();

  const currentValue = defaultEMAILAddress?.value ?? '';
  const blockDelete = specialEMAILAddresses.length > 0;

  const blockDueToSercqDefaultAndPecSpecials =
    !!defaultSERCQ_SENDAddress &&
    addresses.some(
      (a) =>
        a.addressType === AddressType.LEGAL &&
        a.channelType === ChannelType.PEC &&
        a.senderId !== 'default'
    );

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

    // Collect all sender IDs with an active SERCQ address
    // to be removed before deleting the email
    const sercqSenderIds = addresses
      .filter((addr) => addr.channelType === ChannelType.SERCQ_SEND)
      .map((addr) => addr.senderId);

    const removingSercq = sercqSenderIds.length > 0;

    dispatch(removeSercqAndEmail({ senderIds: sercqSenderIds }))
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_EMAIL_SUCCESS, 'default');
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(
              removingSercq
                ? 'courtesy-contacts.email-and-sercq-removed-successfully'
                : 'courtesy-contacts.email-removed-successfully',
              { ns: 'recapiti' }
            ),
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
    if (blockDelete || blockDueToSercqDefaultAndPecSpecials) {
      return t(`courtesy-contacts.block-remove-email-title`, { ns: 'recapiti' });
    }
    if (modalOpen === ModalType.DELETE_PRECONFIRM) {
      return t(`courtesy-contacts.remove-email-preconfirm-title`, { ns: 'recapiti' });
    }
    if (hasAnySERCQAddrEnabled) {
      return t(`courtesy-contacts.remove-email-and-sercq-title`, { ns: 'recapiti' });
    }
    if (defaultPECAddress) {
      return t(`courtesy-contacts.remove-email-pec-enabled-title`, { ns: 'recapiti' });
    }
    return t(`courtesy-contacts.remove-email-no-domicile-title`, { ns: 'recapiti' });
  };

  const getRemoveModalMessage = () => {
    if (blockDelete) {
      return t(`courtesy-contacts.block-remove-email-message`, { ns: 'recapiti' });
    }
    if (blockDueToSercqDefaultAndPecSpecials) {
      return t('courtesy-contacts.block-remove-email-sercq-default-pec-special-message', {
        ns: 'recapiti',
      });
    }
    if (modalOpen === ModalType.DELETE_PRECONFIRM) {
      return (
        <Trans
          i18nKey="courtesy-contacts.remove-email-preconfirm-message"
          ns="recapiti"
          components={[<Typography variant="body2" fontSize={'18px'} key={'paragraph1'} />]}
        />
      );
    }
    if (hasAnySERCQAddrEnabled) {
      return (
        <Trans
          i18nKey="courtesy-contacts.remove-email-and-sercq-message"
          ns="recapiti"
          components={[<Typography variant="body2" fontSize={'18px'} key={'paragraph1'} />]}
        />
      );
    }
    if (defaultPECAddress) {
      return (
        <Trans
          i18nKey="courtesy-contacts.remove-email-pec-enabled-message"
          ns="recapiti"
          components={[
            <Typography variant="body2" fontSize={'18px'} key={'paragraph1'} sx={{ mb: 2 }} />,
            <Typography variant="body2" fontSize={'18px'} key={'paragraph2'} />,
          ]}
        />
      );
    }
    // No digital domicile (no PEC and no SERCQ)
    return t('courtesy-contacts.remove-email-no-domicile-message', {
      ns: 'recapiti',
      value: currentAddress.current.value,
    });
  };

  const getSecondaryButtonLabel = () => {
    if (modalOpen === ModalType.DELETE_PRECONFIRM) {
      return t('courtesy-contacts.remove-email', { ns: 'recapiti' });
    } else {
      return hasAnySERCQAddrEnabled
        ? t('courtesy-contacts.remove-email-and-sercq', { ns: 'recapiti' })
        : t('courtesy-contacts.remove-email', { ns: 'recapiti' });
    }
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
              // eslint-disable-next-line functional/immutable-data
              currentAddress.current = { value: currentValue };
              // If any SERCQ is active (and not blocked), open a pre-confirm step first
              setModalOpen(
                !blockDelete && hasAnySERCQAddrEnabled && !blockDueToSercqDefaultAndPecSpecials
                  ? ModalType.DELETE_PRECONFIRM
                  : ModalType.DELETE
              );
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
      {!defaultSMSAddress && (
        <>
          <Divider sx={{ mt: 3, mb: 3 }} />
          <SmsContactItem />
        </>
      )}
      {showSpecialContactsSection && (
        <SpecialContacts
          addressType={AddressType.COURTESY}
          channelType={!defaultSMSAddress ? undefined : ChannelType.EMAIL}
        />
      )}
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
        showModal={modalOpen === ModalType.DELETE || modalOpen === ModalType.DELETE_PRECONFIRM}
        removeModalTitle={getRemoveModalTitle()}
        removeModalBody={getRemoveModalMessage()}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete || blockDueToSercqDefaultAndPecSpecials}
        slotsProps={
          !blockDelete
            ? (() => {
                const noDigitalDomicile = !defaultPECAddress && !hasAnySERCQAddrEnabled;
                if (modalOpen === ModalType.DELETE && noDigitalDomicile) {
                  return {
                    primaryButton: {
                      onClick: deleteConfirmHandler,
                      label: t('button.conferma'),
                    },
                    secondaryButton: {
                      onClick: () => setModalOpen(null),
                      label: t('button.annulla'),
                    },
                  };
                }
                return {
                  primaryButton: {
                    onClick: () => setModalOpen(null),
                    label: t('button.annulla'),
                  },
                  secondaryButton: {
                    onClick:
                      modalOpen === ModalType.DELETE_PRECONFIRM
                        ? () => setModalOpen(ModalType.DELETE)
                        : deleteConfirmHandler,
                    label: getSecondaryButtonLabel(),
                    variant: 'outlined',
                    color: 'error',
                  },
                };
              })()
            : undefined
        }
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
