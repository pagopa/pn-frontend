import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Stack, Typography } from '@mui/material';
import { appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams, Sender } from '../../models/contacts';
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
import SpecialDigitalContacts from './SpecialDigitalContacts';

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
  const [modalOpen, setModalOpen] = useState<{
    type: ModalType;
    data: { value: string; sender: Sender };
  } | null>(null);
  const dispatch = useAppDispatch();

  const value = defaultPECAddress?.value ?? '';
  const blockDelete = specialPECAddresses.length > 0;
  const verifyingAddress = defaultPECAddress ? !defaultPECAddress.pecValid : false;

  const handleSubmit = (value: string, sender: Sender = { senderId: 'default' }) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_START, sender.senderId);
    // first check if contact already exists
    if (contactAlreadyExists(addresses, value, sender.senderId, ChannelType.PEC)) {
      setModalOpen({ type: ModalType.EXISTING, data: { value, sender } });
      return;
    }
    handleCodeVerification(value, sender);
  };

  const handleCodeVerification = (
    value: string,
    sender: Sender = { senderId: 'default' },
    verificationCode?: string
  ) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_CONVERSION, sender.senderId);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: sender.senderId,
      senderName: sender.senderName,
      channelType: ChannelType.PEC,
      value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          setModalOpen({ type: ModalType.CODE, data: { value, sender } });
          return;
        }

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_SUCCESS, sender.senderId);

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
          if (value && sender.senderId === 'default') {
            digitalContactRef.current.toggleEdit();
          }
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen({ type: ModalType.VALIDATION, data: { value, sender } });
      })
      .catch(() => {});
  };

  const handleCancelCode = async (sender: Sender = { senderId: 'default' }) => {
    setModalOpen(null);
    if (value && sender.senderId === 'default') {
      digitalContactRef.current.toggleEdit();
    }
    await digitalContactRef.current.resetForm();
  };

  const deleteConfirmHandler = (sender: Sender = { senderId: 'default' }) => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: sender.senderId,
        channelType: ChannelType.PEC,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_PEC_SUCCESS, sender.senderId);
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
          value={value}
          channelType={ChannelType.PEC}
          ref={digitalContactRef}
          inputProps={{
            label: t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' }),
          }}
          insertButtonLabel={t('button.conferma')}
          onSubmit={handleSubmit}
          onDelete={() =>
            setModalOpen({
              type: ModalType.DELETE,
              data: { value, sender: { senderId: 'default' } },
            })
          }
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
              onClick={() =>
                setModalOpen({
                  type: ModalType.CANCEL_VALIDATION,
                  data: { value, sender: { senderId: 'default' } },
                })
              }
              data-testid="cancelValidation"
            >
              {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
            </ButtonNaked>
          </Stack>
        </>
      )}
      <ExistingContactDialog
        open={modalOpen?.type === ModalType.EXISTING}
        value={modalOpen?.data.value ?? ''}
        handleDiscard={() => handleCancelCode(modalOpen?.data.sender)}
        handleConfirm={() =>
          handleCodeVerification(modalOpen?.data.value ?? '', modalOpen?.data.sender)
        }
      />
      <ContactCodeDialog
        value={modalOpen?.data.value ?? ''}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={modalOpen?.type === ModalType.CODE}
        onConfirm={(code) =>
          handleCodeVerification(modalOpen?.data.value ?? '', modalOpen?.data.sender, code)
        }
        onDiscard={() => handleCancelCode(modalOpen?.data.sender)}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)}
      />
      <PecVerificationDialog
        open={modalOpen?.type === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <CancelVerificationModal
        open={modalOpen?.type === ModalType.CANCEL_VALIDATION}
        senderId={modalOpen?.data.sender.senderId}
        handleClose={() => setModalOpen(null)}
      />
      <DeleteDialog
        showModal={modalOpen?.type === ModalType.DELETE}
        removeModalTitle={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-message`, {
          value: modalOpen?.data.value ?? '',
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      {value && (
        <SpecialDigitalContacts
          digitalAddresses={specialPECAddresses}
          channelType={ChannelType.PEC}
          handleConfirm={(value: string, sender: Sender) => handleSubmit(value, sender)}
        />
      )}
    </DigitalContactsCard>
  );
};

export default PecContactItem;
