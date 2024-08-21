import { useFormik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { DisclaimerModal, appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, emailValidationSchema } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import EditDigitalContact from './EditDigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InsertDigitalContact from './InsertDigitalContact';
import SpecialContactElem from './SpecialContactElem';

interface Props {
  value: string;
  senderId?: string;
  senderName?: string;
  blockDelete?: boolean;
  blockEdit?: boolean;
  onEdit?: (editFlag: boolean) => void;
}

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
}

const EmailContactItem: React.FC<Props> = ({
  value,
  senderId = 'default',
  senderName,
  blockDelete,
  blockEdit,
  onEdit,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses =
    useAppSelector((state: RootState) => state.contactsState.digitalAddresses) ?? [];
  const digitalElemRef = useRef<{ toggleEdit: () => void }>({ toggleEdit: () => {} });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const validationSchema = yup.object().shape({
    [`${senderId}_email`]: emailValidationSchema(t),
  });

  const initialValues = {
    [`${senderId}_email`]: value ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_START, senderId);
      // first check if contact already exists
      if (
        contactAlreadyExists(
          digitalAddresses,
          formik.values[`${senderId}_email`],
          senderId,
          ChannelType.EMAIL
        )
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      // disclaimer modal must be opened only when we are adding a default address
      if (senderId === 'default') {
        setModalOpen(ModalType.DISCLAIMER);
        return;
      }
      handleCodeVerification();
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION, senderId);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId,
      senderName,
      channelType: ChannelType.EMAIL,
      value: formik.values[`${senderId}_email`],
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

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS, senderId);

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
        if (value) {
          digitalElemRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
    if (value) {
      digitalElemRef.current.toggleEdit();
    }
    await formik.setFieldTouched(`${senderId}_email`, false, false);
    await formik.setFieldValue(`${senderId}_email`, initialValues[`${senderId}_email`], true);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId,
        channelType: ChannelType.EMAIL,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_EMAIL_SUCCESS, senderId);
      })
      .catch(() => {});
  };

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the EditDigitalContact component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <DigitalContactsCard
      title={t('courtesy-contacts.email-title', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.email-description', { ns: 'recapiti' })}
    >
      <form
        onSubmit={formik.handleSubmit}
        data-testid={`${senderId}_emailContact`}
        style={{ width: isMobile ? '100%' : '50%' }}
      >
        {value && (
          <EditDigitalContact
            senderId={senderId}
            ref={digitalElemRef}
            inputProps={{
              id: `${senderId}_email`,
              name: `${senderId}_email`,
              label: t(`courtesy-contacts.link-email-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values[`${senderId}_email`],
              onChange: (e) => void handleChangeTouched(e),
              error:
                formik.touched[`${senderId}_email`] && Boolean(formik.errors[`${senderId}_email`]),
              helperText: formik.touched[`${senderId}_email`] && formik.errors[`${senderId}_email`],
            }}
            saveDisabled={!formik.isValid}
            editDisabled={blockEdit}
            onDelete={() => setModalOpen(ModalType.DELETE)}
            onEditCancel={() => formik.resetForm({ values: initialValues })}
            onEdit={onEdit}
          />
        )}
        {!value && (
          <InsertDigitalContact
            label={t(`courtesy-contacts.email-to-add`, { ns: 'recapiti' })}
            inputProps={{
              id: `${senderId}_email`,
              name: `${senderId}_email`,
              placeholder: t(`courtesy-contacts.link-email-placeholder`, { ns: 'recapiti' }),
              value: formik.values[`${senderId}_email`],
              onChange: handleChangeTouched,
              error:
                formik.touched[`${senderId}_email`] && Boolean(formik.errors[`${senderId}_email`]),
              helperText: formik.touched[`${senderId}_email`] && formik.errors[`${senderId}_email`],
            }}
            insertDisabled={!formik.isValid}
            buttonLabel={t(`courtesy-contacts.email-add`, { ns: 'recapiti' })}
          />
        )}
      </form>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values[`${senderId}_email`]}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      <DisclaimerModal
        open={modalOpen === ModalType.DISCLAIMER}
        onConfirm={() => {
          setModalOpen(null);
          handleCodeVerification();
        }}
        onCancel={handleCancelCode}
        confirmLabel={t('button.conferma')}
        checkboxLabel={t('button.capito')}
        content={t(`alert-dialog-email`, { ns: 'recapiti' })}
      />
      <ContactCodeDialog
        value={formik.values[senderId + '_email']}
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
          value: formik.values[`${senderId}_email`],
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      <SpecialContactElem addressType="email" />
    </DigitalContactsCard>
  );
};

export default EmailContactItem;
