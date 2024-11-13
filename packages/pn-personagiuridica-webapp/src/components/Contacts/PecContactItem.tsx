import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Typography } from '@mui/material';
import { appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { contactAlreadyExists } from '../../utility/contacts.utility';
import CancelVerificationModal from './CancelVerificationModal';
import ContactCodeDialog from './ContactCodeDialog';
import DefaultDigitalContact from './DefaultDigitalContact';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import ExistingContactDialog from './ExistingContactDialog';
import PecValidationItem from './PecValidationItem';
import PecValueDialog from './PecValueDialog';
import PecVerificationDialog from './PecVerificationDialog';

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CANCEL_VALIDATION = 'cancel_validation',
  DELETE = 'delete',
  CODE = 'code',
  VALUE = 'value',
}

const PecContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const {
    defaultPECAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
    addresses,
    defaultSERCQ_SENDAddress,
  } = useAppSelector(contactsSelectors.selectAddresses);
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

  const currentValue = defaultPECAddress?.value ?? '';
  const blockDelete = specialPECAddresses.length > 0 || specialSERCQ_SENDAddresses.length > 0;
  const verifyingAddress = defaultPECAddress ? !defaultPECAddress.pecValid : false;

  const handleSubmit = (value: string) => {
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value };
    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, 'default', ChannelType.PEC)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.PEC,
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

        // contact has already been verified
        if (res.pecValid) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`legal-contacts.pec-added-successfully`, { ns: 'recapiti' }),
            })
          );
          setModalOpen(null);
          if (currentValue) {
            digitalContactRef.current.toggleEdit();
          }
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
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

  const handleCancelValidation = () => {
    setModalOpen(ModalType.CANCEL_VALIDATION);

    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value: currentValue };
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: 'default',
        channelType: ChannelType.PEC,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.pec-removed-successfully`, { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  const handlePecAdd = () => {
    setModalOpen(ModalType.VALUE);
  };

  return (
    <DigitalContactsCard
      title={defaultSERCQ_SENDAddress ? '' : t('legal-contacts.pec-title', { ns: 'recapiti' })}
      subtitle={
        defaultSERCQ_SENDAddress ? '' : t('legal-contacts.pec-description', { ns: 'recapiti' })
      }
      sx={{
        pt: defaultSERCQ_SENDAddress ? 0 : 3,
        borderTopLeftRadius: defaultSERCQ_SENDAddress ? 0 : 4,
        borderTopRightRadius: defaultSERCQ_SENDAddress ? 0 : 4,
        borderBottomLeftRadius: currentValue ? 0 : 4,
        borderBottomRightRadius: currentValue ? 0 : 4,
      }}
    >
      {!verifyingAddress && !defaultSERCQ_SENDAddress && (
        <DefaultDigitalContact
          label={t('legal-contacts.pec-to-add', { ns: 'recapiti' })}
          value={currentValue}
          channelType={ChannelType.PEC}
          ref={digitalContactRef}
          inputProps={{
            label: t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' }),
          }}
          insertButtonLabel={t('button.attiva')}
          onSubmit={handleSubmit}
          onDelete={() => {
            setModalOpen(ModalType.DELETE);
            // eslint-disable-next-line functional/immutable-data
            currentAddress.current = { value: currentValue };
          }}
        />
      )}
      {verifyingAddress && (
        <PecValidationItem senderId="default" onCancelValidation={handleCancelValidation} />
      )}
      {!verifyingAddress && defaultSERCQ_SENDAddress && (
        <>
          <Divider sx={{ color: 'text.secondary' }} />
          <Typography mt={2} variant="body2" color="text.secondary">
            {t('legal-contacts.sercq-send-pec', { ns: 'recapiti' })}
          </Typography>
          <ButtonNaked color={'primary'} size="medium" onClick={handlePecAdd}>
            {t('legal-contacts.sercq-send-add-pec', { ns: 'recapiti' })}
          </ButtonNaked>
        </>
      )}
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <CancelVerificationModal
        open={modalOpen === ModalType.CANCEL_VALIDATION}
        senderId="default"
        handleClose={() => setModalOpen(null)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-message`, {
          value: currentAddress.current.value,
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      <PecValueDialog
        open={modalOpen === ModalType.VALUE}
        onDiscard={() => setModalOpen(null)}
        onConfirm={(value) => {
          handleSubmit(value);
        }}
      />
    </DigitalContactsCard>
  );
};

export default PecContactItem;
