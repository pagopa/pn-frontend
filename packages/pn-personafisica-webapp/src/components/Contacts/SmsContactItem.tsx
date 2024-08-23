import { useFormik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { InputAdornment } from '@mui/material';
import { DisclaimerModal, appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  contactAlreadyExists,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import EditDigitalContact from './EditDigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InsertDigitalContact from './InsertDigitalContact';
import SpecialContacts from './SpecialContacts';

interface Props {
  senderId?: string;
  senderName?: string;
  blockEdit?: boolean;
  onEdit?: (editFlag: boolean) => void;
}

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
  SPECIAL = 'special',
}

const SmsContactItem: React.FC<Props> = ({
  senderId = 'default',
  senderName,
  blockEdit,
  onEdit,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSMSAddress, specialSMSAddresses, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const digitalElemRef = useRef<{ toggleEdit: () => void }>({ toggleEdit: () => {} });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const value = defaultSMSAddress?.value ?? '';
  // value contains the prefix
  const contactValue = value.replace(internationalPhonePrefix, '');
  const blockDelete = specialSMSAddresses.length > 0;

  const validationSchema = yup.object().shape({
    [`${senderId}_sms`]: phoneValidationSchema(t),
  });

  const initialValues = {
    [`${senderId}_sms`]: contactValue ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, senderId);
      // first check if contact already exists
      if (
        contactAlreadyExists(addresses, formik.values[`${senderId}_sms`], senderId, ChannelType.SMS)
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
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, senderId);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId,
      senderName,
      channelType: ChannelType.SMS,
      value: internationalPhonePrefix + formik.values[`${senderId}_sms`],
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

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_SUCCESS, senderId);

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
    await formik.setFieldTouched(`${senderId}_sms`, false, false);
    await formik.setFieldValue(`${senderId}_sms`, initialValues[`${senderId}_sms`], true);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId,
        channelType: ChannelType.SMS,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_SUCCESS, senderId);
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
      title={t('courtesy-contacts.sms-title', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.sms-description', { ns: 'recapiti' })}
    >
      <form
        onSubmit={formik.handleSubmit}
        data-testid={`${senderId}_smsContact`}
        style={{ width: isMobile ? '100%' : '50%' }}
      >
        {value && (
          <EditDigitalContact
            senderId={senderId}
            ref={digitalElemRef}
            inputProps={{
              id: `${senderId}_sms`,
              name: `${senderId}_sms`,
              label: t(`courtesy-contacts.link-sms-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values[`${senderId}_sms`],
              onChange: (e) => void handleChangeTouched(e),
              error: formik.touched[`${senderId}_sms`] && Boolean(formik.errors[`${senderId}_sms`]),
              helperText: formik.touched[`${senderId}_sms`] && formik.errors[`${senderId}_sms`],
              prefix: internationalPhonePrefix,
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
            label={t(`courtesy-contacts.sms-to-add`, { ns: 'recapiti' })}
            inputProps={{
              id: `${senderId}_sms`,
              name: `${senderId}_sms`,
              placeholder: t(`courtesy-contacts.link-sms-placeholder`, { ns: 'recapiti' }),
              value: formik.values[`${senderId}_sms`],
              onChange: (e) => void handleChangeTouched(e),
              error: formik.touched[`${senderId}_sms`] && Boolean(formik.errors[`${senderId}_sms`]),
              helperText: formik.touched[`${senderId}_sms`] && formik.errors[`${senderId}_sms`],
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                ),
              },
            }}
            insertDisabled={!formik.isValid}
            buttonLabel={t(`courtesy-contacts.sms-add`, { ns: 'recapiti' })}
          />
        )}
      </form>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values[`${senderId}_sms`]}
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
        content={t(`alert-dialog-sms`, { ns: 'recapiti' })}
      />
      <ContactCodeDialog
        value={formik.values[senderId + '_sms']}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.SMS}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-sms-message`, {
          value: formik.values[`${senderId}_sms`],
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      {value && (
        <SpecialContacts digitalAddresses={specialSMSAddresses} channelType={ChannelType.SMS} />
      )}
    </DigitalContactsCard>
  );
};

export default SmsContactItem;
