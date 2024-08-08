import { useFormik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { CodeModal, DisclaimerModal, ErrorMessage, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  contactAlreadyExists,
  emailValidationSchema,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import ExistingContactDialog from './ExistingContactDialog';

interface Props {
  type: ChannelType.EMAIL | ChannelType.SMS;
  value: string;
  blockDelete?: boolean;
}

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
}

const CourtesyContactItem = ({ type, value, blockDelete }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const contactType = type.toLowerCase();
  const digitalElemRef = useRef<{ editContact: () => void; toggleEdit: () => void }>({
    editContact: () => {},
    toggleEdit: () => {},
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const dispatch = useAppDispatch();
  const labelType = type === ChannelType.EMAIL ? 'email' : 'sms';
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const digitalAddresses =
    useAppSelector((state: RootState) => state.contactsState.digitalAddresses) ?? [];

  const emailValidationSch = yup.object().shape({
    email: emailValidationSchema(t),
  });

  // note that phoneValidationSchema depends on the phoneRegex which is different
  // for the insertion and modification cases, check the comment
  // about the useEffect which calls setPhoneRegex below
  const phoneValidationSch = yup.object().shape({
    sms: phoneValidationSchema(t, !!value),
  });

  const formik = useFormik({
    initialValues: {
      [contactType]: value ?? '',
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: type === ChannelType.EMAIL ? emailValidationSch : phoneValidationSch,
    onSubmit: () => {
      const contactValue = getContactValue(type);
      PFEventStrategyFactory.triggerEvent(
        type === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_START
          : PFEventsType.SEND_ADD_EMAIL_START,
        'default'
      );

      if (contactAlreadyExists(digitalAddresses, contactValue, 'default', type)) {
        setModalOpen(ModalType.EXISTING);
        return;
      }

      setModalOpen(ModalType.DISCLAIMER);
    },
  });

  const getContactValue = (type: ChannelType) =>
    type === ChannelType.EMAIL
      ? formik.values[contactType]
      : internationalPhonePrefix + formik.values[contactType];

  const handleChangeTouched = async (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    formik.handleChange(event);
    await handleTouched(event.target.id, true);
  };

  const handleTouched = async (id: string, touched: boolean) => {
    await formik.setFieldTouched(id, touched, false);
  };

  const handleEditConfirm = async (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      await formik.setFieldValue(contactType, value, true);
    }
  };

  const handleCodeModalClose = () => {
    codeModalRef.current?.updateError({ title: '', content: '' }, false);
    setModalOpen(null);
  };

  const deleteConfirmHandler = () => {
    setShowDeleteModal(false);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: type,
      })
    )
      .unwrap()
      .then(() => {
        void handleTouched(contactType, false);
        PFEventStrategyFactory.triggerEvent(
          type === ChannelType.EMAIL
            ? PFEventsType.SEND_REMOVE_EMAIL_SUCCESS
            : PFEventsType.SEND_REMOVE_SMS_SUCCESS,
          'default'
        );
      })
      .catch(() => {});
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(
        type === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_UX_CONVERSION
          : PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
        'default'
      );
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      senderName: 'default',
      channelType: type,
      value: getContactValue(type),
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

        PFEventStrategyFactory.triggerEvent(
          type === ChannelType.SMS
            ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
            : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
          'default'
        );

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(
              `courtesy-contacts.${type === ChannelType.SMS ? 'sms' : 'email'}-added-successfully`,
              {
                ns: 'recapiti',
              }
            ),
          })
        );
        // chiudere la code modal
        setModalOpen(null);
        // nel caso siamo in modifica (property value defined), bisogna passare alla modalità noEdit del componente DigitalContactElem
        // return;
      })
      .catch(() => {});
  };

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContactElem component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: '100%' }}
        data-testid={`courtesyContacts-${contactType}`}
      >
        <Typography id={`${contactType}-label`} variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
          {t(`courtesy-contacts.${contactType}-added`, { ns: 'recapiti' })}
        </Typography>
        {value ? (
          <DigitalContactElem
            senderId="default"
            contactType={type}
            ref={digitalElemRef}
            inputProps={{
              id: contactType,
              name: contactType,
              label: t(`courtesy-contacts.link-${contactType}-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values[contactType],
              onChange: handleChangeTouched,
              error:
                (formik.touched[contactType] || formik.values[contactType].length > 0) &&
                Boolean(formik.errors[contactType]),
              helperText:
                (formik.touched[contactType] || formik.values[contactType].length > 0) &&
                formik.errors[contactType],
            }}
            saveDisabled={!formik.isValid}
            onConfirm={handleEditConfirm}
            resetModifyValue={() => handleEditConfirm('cancelled')}
            onDelete={() => setShowDeleteModal(true)}
          />
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id={contactType}
              name={contactType}
              aria-labelledby={`${contactType}-label`}
              value={formik.values[contactType]}
              onChange={handleChangeTouched}
              error={formik.touched[contactType] && Boolean(formik.errors[contactType])}
              helperText={formik.touched[contactType] && formik.errors[contactType]}
              inputProps={{ sx: { height: '14px' } }}
              placeholder={t(`courtesy-contacts.link-${contactType}-placeholder`, {
                ns: 'recapiti',
              })}
              fullWidth
              InputProps={
                type === ChannelType.SMS
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                      ),
                    }
                  : {}
              }
              sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            />

            <Button
              id={`courtesy-${contactType}-button`}
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid={`courtesy-${contactType}-button`}
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
            >
              {t(`courtesy-contacts.${contactType}-add`, { ns: 'recapiti' })}
            </Button>
          </Stack>
        )}
      </form>

      <DeleteDialog
        showModal={showDeleteModal}
        removeModalTitle={t(
          `courtesy-contacts.${blockDelete ? 'block-' : ''}remove-${contactType}-title`,
          { ns: 'recapiti' }
        )}
        removeModalBody={t(
          `courtesy-contacts.${blockDelete ? 'block-' : ''}remove-${contactType}-message`,
          {
            value: formik.values[contactType],
            ns: 'recapiti',
          }
        )}
        handleModalClose={() => setShowDeleteModal(false)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />

      <ExistingContactDialog
        isConfirmationModalVisible={modalOpen === ModalType.EXISTING}
        value={formik.values[contactType]}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />

      {modalOpen === ModalType.DISCLAIMER && (
        <DisclaimerModal
          onConfirm={() => {
            setModalOpen(null);
            handleCodeVerification();
          }}
          onCancel={() => setModalOpen(null)}
          confirmLabel={t('button.conferma')}
          checkboxLabel={t('button.capito')}
          content={t(`alert-dialog-${type}`, { ns: 'recapiti' })}
        />
      )}

      <CodeModal
        title={
          t(`courtesy-contacts.${labelType}-verify`, { ns: 'recapiti' }) +
          ` ${formik.values[contactType]}`
        }
        subtitle={<Trans i18nKey={`courtesy-contacts.${labelType}-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`courtesy-contacts.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`courtesy-contacts.${labelType}-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleCodeVerification(undefined)}
              sx={{ verticalAlign: 'unset', display: 'inline' }}
            >
              <Typography
                display="inline"
                color="primary"
                variant="body2"
                sx={{ textDecoration: 'underline' }}
              >
                {t(`courtesy-contacts.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </ButtonNaked>
          </>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={handleCodeModalClose}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        ref={codeModalRef}
      />
    </>
  );
};

export default CourtesyContactItem;
