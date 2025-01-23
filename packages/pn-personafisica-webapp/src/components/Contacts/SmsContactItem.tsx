import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { PnInfoCard, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

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
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InformativeDialog from './InformativeDialog';

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
  INFORMATIVE = 'informative',
}

type Props = {
  onCancelInsert?: () => void;
};

const SmsContactElem: React.FC<Props> = ({ onCancelInsert }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQ_SENDAddress, defaultPECAddress, defaultSMSAddress, addresses } =
    useAppSelector(contactsSelectors.selectAddresses);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string }>({
    value: '',
  });
  const dispatch = useAppDispatch();

  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;

  const currentValue = defaultSMSAddress?.value ?? '';

  const handleSubmit = (value: string) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, {
      senderId: 'default',
      source: ContactSource.RECAPITI,
    });
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value };
    // first check if contact already exists
    if (
      contactAlreadyExists(addresses, internationalPhonePrefix + value, 'default', ChannelType.SMS)
    ) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    if (!isDigitalDomicileActive) {
      setModalOpen(ModalType.INFORMATIVE);
      return;
    }
    // disclaimer modal must be opened only when we are adding a default address and no legal address has been added
    /* if (legalAddresses.length === 0) {
      setModalOpen(ModalType.DISCLAIMER);
      return;
    } */
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, 'default');
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
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

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_SUCCESS, 'default');

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

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContact component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */

  return (
    <>
      <DigitalContact
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
        onCancelInsert={onCancelInsert}
      />
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
    content={t(`alert-dialog-sms`, { ns: 'recapiti' })}
  /> */}
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.SMS}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)}
      />
      <InformativeDialog
        open={modalOpen === ModalType.INFORMATIVE}
        title={t('courtesy-contacts.info-modal-sms-title', { ns: 'recapiti' })}
        subtitle={t('courtesy-contacts.info-modal-sms-subtitle', { ns: 'recapiti' })}
        content={t('courtesy-contacts.info-modal-sms-content', { ns: 'recapiti' })}
        onConfirm={() => handleCodeVerification()}
        onDiscard={() => setModalOpen(null)}
      />
    </>
  );
};

const SmsContactItem: React.FC<Props> = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const { defaultSERCQ_SENDAddress, defaultSMSAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const [insertMode, setInsertMode] = useState(false);

  const isActive = !!defaultSMSAddress;

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.SMS,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_SUCCESS, 'default');
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.sms-removed-successfully`, { ns: 'recapiti' }),
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
            data-testid="disable-sms"
            key="disable"
            variant="naked"
            color="error"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => {
              setModalOpen(ModalType.DELETE);
            }}
            sx={{ p: '10px 16px' }}
          >
            {t('button.disable')}
          </Button>,
        ]
      : undefined;

  if (isActive) {
    return (
      <PnInfoCard
        title={
          <Typography
            variant="h6"
            fontWeight={700}
            fontSize={{ xs: '22px', lg: '24px' }}
            mb={2}
            data-testid="smsContactTitle"
          >
            {t('courtesy-contacts.sms-title', { ns: 'recapiti' })}
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
        data-testid="smsContact"
      >
        <SmsContactElem />
        <Typography
          mt={2}
          variant="body1"
          fontSize={{ xs: '14px', lg: '18px' }}
          color="text.secondary"
          data-testid="smsContactDescription"
        >
          {t('courtesy-contacts.sms-description', { ns: 'recapiti' })}
        </Typography>
        <DeleteDialog
          showModal={modalOpen === ModalType.DELETE}
          removeModalTitle={t('courtesy-contacts.remove-sms-title', {
            ns: 'recapiti',
          })}
          removeModalBody={t('courtesy-contacts.remove-sms-message', {
            value: defaultSMSAddress.value,
            ns: 'recapiti',
          })}
          handleModalClose={() => setModalOpen(null)}
          confirmHandler={deleteConfirmHandler}
        />
      </PnInfoCard>
    );
  }
  return (
    <Box mt={3}>
      <Divider />
      {insertMode ? (
        <Box mt={3}>
          <SmsContactElem onCancelInsert={() => setInsertMode(false)} />
        </Box>
      ) : (
        <>
          <Typography variant="body1" fontWeight={600} fontSize="16px" mt={3} mb={1}>
            {t('courtesy-contacts.email-sms-updates', { ns: 'recapiti' })}
          </Typography>
          <ButtonNaked
            color="primary"
            sx={{ fontSize: '16px' }}
            onClick={() => setInsertMode(true)}
          >
            {t('courtesy-contacts.email-sms-add', { ns: 'recapiti' })}
          </ButtonNaked>
        </>
      )}
    </Box>
  );
};

export default SmsContactItem;
