import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  DisclaimerModal,
  ErrorMessage,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  contactAlreadyExists,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import ExistingContactDialog from './ExistingContactDialog';

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

const SmsContactItem: React.FC<Props> = ({
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
  const digitalElemRef = useRef<{ editContact: () => void; toggleEdit: () => void }>({
    editContact: () => {},
    toggleEdit: () => {},
  });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const dispatch = useAppDispatch();
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  // value contains the prefix
  const contactValue = value.replace(internationalPhonePrefix, '');

  const validationSchema = yup.object().shape({
    [`${senderId}_sms`]: phoneValidationSchema(t),
  });

  const initialValues = {
    [`${senderId}_sms`]: contactValue ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: () => {
      // first check if contact already exists
      if (
        contactAlreadyExists(
          digitalAddresses,
          formik.values[`${senderId}_sms`],
          senderId,
          ChannelType.SMS
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
          setModalOpen(ModalType.CODE);
          return;
        }

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
    void dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId,
        channelType: ChannelType.SMS,
      })
    );
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (modalOpen === null) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
      }
      return false;
    },
    [modalOpen]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

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
      <form onSubmit={formik.handleSubmit} data-testid={`${senderId}_smsContact`}>
        {senderId === 'default' && (
          <Typography id="sms-label" variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
            {t(`courtesy-contacts.sms-added`, { ns: 'recapiti' })}
          </Typography>
        )}
        {value ? (
          <DigitalContactElem
            senderId={senderId}
            contactType={ChannelType.SMS}
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
            editManagedFromOutside
          />
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id={`${senderId}_sms`}
              name={`${senderId}_sms`}
              value={formik.values[`${senderId}_sms`]}
              onChange={handleChangeTouched}
              error={formik.touched[`${senderId}_sms`] && Boolean(formik.errors[`${senderId}_sms`])}
              helperText={formik.touched[`${senderId}_sms`] && formik.errors[`${senderId}_sms`]}
              inputProps={{ sx: { height: '14px' } }}
              placeholder={t(`courtesy-contacts.link-sms-placeholder`, {
                ns: 'recapiti',
              })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                ),
              }}
              sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            />

            <Button
              id="courtesy-sms-button"
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid="courtesy-sms-button"
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
            >
              {t(`courtesy-contacts.sms-add`, { ns: 'recapiti' })}
            </Button>
          </Stack>
        )}
      </form>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values[`${senderId}_sms`]}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />
      <DisclaimerModal
        open={modalOpen === ModalType.DISCLAIMER}
        onConfirm={() => {
          setModalOpen(null);
          handleCodeVerification();
        }}
        onCancel={() => setModalOpen(null)}
        confirmLabel={t('button.conferma')}
        checkboxLabel={t('button.capito')}
        content={t(`alert-dialog-sms`, { ns: 'recapiti' })}
      />
      <CodeModal
        title={
          t(`courtesy-contacts.sms-verify`, { ns: 'recapiti' }) +
          ` ${formik.values[senderId + '_sms']}`
        }
        subtitle={<Trans i18nKey="courtesy-contacts.sms-verify-descr" ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`courtesy-contacts.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`courtesy-contacts.sms-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleCodeVerification()}
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
        cancelCallback={handleCancelCode}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        ref={codeModalRef}
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
    </>
  );
};

export default SmsContactItem;
