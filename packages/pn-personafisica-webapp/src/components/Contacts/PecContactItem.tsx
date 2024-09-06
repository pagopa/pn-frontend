import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Stack, Typography } from '@mui/material';
import { appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists } from '../../utility/contacts.utility';
import CancelVerificationModal from './CancelVerificationModal';
import ContactCodeDialog from './ContactCodeDialog';
import DefaultDigitalContact from './DefaultDigitalContact';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import ExistingContactDialog from './ExistingContactDialog';
import PecVerificationDialog from './PecVerificationDialog';

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CANCEL_VALIDATION = 'cancel_validation',
  DELETE = 'delete',
  CODE = 'code',
}

const PecContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultPECAddress, specialPECAddresses, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
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
  const blockDelete = specialPECAddresses.length > 0;
  const verifyingAddress = defaultPECAddress ? !defaultPECAddress.pecValid : false;

  const handleSubmit = (value: string) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_START, 'default');
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
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_CONVERSION, 'default');
    }

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

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_SUCCESS, 'default');

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
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_PEC_SUCCESS, 'default');
      })
      .catch(() => {});
  };

  /*
   * if *some* value has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DefaultDigitalContact component includes the "update" button)
   */
  /*
   * if *no* value has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <DigitalContactsCard
      title={t('legal-contacts.pec-title', { ns: 'recapiti' })}
      subtitle={t('legal-contacts.pec-description', { ns: 'recapiti' })}
    >
      {!verifyingAddress && (
        <DefaultDigitalContact
          label={t('legal-contacts.pec-to-add', { ns: 'recapiti' })}
          value={currentValue}
          channelType={ChannelType.PEC}
          ref={digitalContactRef}
          inputProps={{
            label: t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' }),
          }}
          insertButtonLabel={t('button.conferma')}
          onSubmit={handleSubmit}
          onDelete={() => {
            setModalOpen(ModalType.DELETE);
            // eslint-disable-next-line functional/immutable-data
            currentAddress.current = { value: currentValue };
          }}
        />
      )}
      {verifyingAddress && (
        <>
          <Typography mb={1} sx={{ fontWeight: 'bold' }} mt={3}>
            {t('legal-contacts.pec-validating', { ns: 'recapiti' })}
          </Typography>
          <Stack direction="row" spacing={1}>
            <WatchLaterIcon fontSize="small" />
            <Typography id="validationPecProgress" fontWeight="bold" variant="body2">
              {t('legal-contacts.validation-in-progress', { ns: 'recapiti' })}
            </Typography>
            <ButtonNaked
              color="primary"
              onClick={() => {
                setModalOpen(ModalType.CANCEL_VALIDATION);
                // eslint-disable-next-line functional/immutable-data
                currentAddress.current = { value: currentValue };
              }}
              data-testid="cancelValidation"
            >
              {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
            </ButtonNaked>
          </Stack>
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
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <CancelVerificationModal
        open={modalOpen === ModalType.CANCEL_VALIDATION}
        senderId={'default'}
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
    </DigitalContactsCard>
  );
};

export default PecContactItem;
