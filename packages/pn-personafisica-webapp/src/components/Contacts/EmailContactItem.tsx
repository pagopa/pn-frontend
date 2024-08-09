import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  DisclaimerModal,
  ErrorMessage,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, emailValidationSchema } from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import ExistingContactDialog from './ExistingContactDialog';

interface Props {
  value: string;
  blockDelete?: boolean;
}

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
}

const EmailContactItem = ({ value, blockDelete }: Props) => {
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

  const validationSchema = yup.object().shape({
    email: emailValidationSchema(t),
  });

  const initialValues = {
    email: value ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_START, 'default');
      // first check if contact already exists
      if (
        contactAlreadyExists(digitalAddresses, formik.values.email, 'default', ChannelType.EMAIL)
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      setModalOpen(ModalType.DISCLAIMER);
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION, 'default');
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.EMAIL,
      value: formik.values.email,
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
        // chiudere la code modal
        setModalOpen(null);
        // nel caso siamo in modifica (property value defined), bisogna passare alla modalità noEdit del componente DigitalContactElem
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
    await formik.setFieldTouched('email', false, false);
    await formik.setFieldValue('email', initialValues.email, true);
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
      })
      .catch(() => {});
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
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR);
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
      <form onSubmit={formik.handleSubmit} data-testid="courtesyContacts-email">
        <Typography id="email-label" variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
          {t(`courtesy-contacts.email-added`, { ns: 'recapiti' })}
        </Typography>
        {value ? (
          <DigitalContactElem
            senderId="default"
            contactType={ChannelType.EMAIL}
            ref={digitalElemRef}
            inputProps={{
              id: 'email',
              name: 'email',
              label: t(`courtesy-contacts.link-email-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values.email,
              onChange: (e) => void handleChangeTouched(e),
              error: formik.touched.email && Boolean(formik.errors.email),
              helperText: formik.touched.email && formik.errors.email,
            }}
            saveDisabled={!formik.isValid}
            onDelete={() => setModalOpen(ModalType.DELETE)}
            onEditCancel={() => formik.resetForm({ values: initialValues })}
            editManagedFromOutside
          />
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id="email"
              name="email"
              value={formik.values.email}
              onChange={handleChangeTouched}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              inputProps={{ sx: { height: '14px' } }}
              placeholder={t(`courtesy-contacts.link-email-placeholder`, { ns: 'recapiti' })}
              fullWidth
              sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            />

            <Button
              id="courtesy-email-button"
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid="courtesy-email-button"
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
            >
              {t(`courtesy-contacts.email-add`, { ns: 'recapiti' })}
            </Button>
          </Stack>
        )}
      </form>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values.email}
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
        content={t(`alert-dialog-email`, { ns: 'recapiti' })}
      />
      <CodeModal
        title={t(`courtesy-contacts.email-verify`, { ns: 'recapiti' }) + ` ${formik.values.email}`}
        subtitle={<Trans i18nKey={`courtesy-contacts.email-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`courtesy-contacts.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`courtesy-contacts.email-new-code`, { ns: 'recapiti' })}
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
        removeModalTitle={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-email-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`courtesy-contacts.${blockDelete ? 'block-' : ''}remove-email-message`, {
          value: formik.values.email,
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
    </>
  );
};

export default EmailContactItem;
