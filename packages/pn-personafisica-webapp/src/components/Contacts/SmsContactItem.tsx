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

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
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
  blockDelete?: boolean;
}

enum ModalType {
  EXISTING = 'existing',
  DISCLAIMER = 'disclaimer',
  CODE = 'code',
  DELETE = 'delete',
}

const SmsContactItem = ({ value, blockDelete }: Props) => {
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
    sms: phoneValidationSchema(t, !!value),
  });

  const initialValues = {
    sms: value ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, 'default');
      // first check if contact already exists
      if (contactAlreadyExists(digitalAddresses, getContactValue(), 'default', ChannelType.SMS)) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      setModalOpen(ModalType.DISCLAIMER);
    },
  });

  const getContactValue = () =>
    value ? formik.values.sms : internationalPhonePrefix + formik.values.sms;

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, 'default');
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.SMS,
      value: getContactValue(),
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
    await formik.setFieldTouched('sms', false, false);
    await formik.setFieldValue('sms', initialValues.sms, true);
  };

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
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR);
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
      <form onSubmit={formik.handleSubmit} data-testid="courtesyContacts-sms">
        <Typography id="sms-label" variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
          {t(`courtesy-contacts.sms-added`, { ns: 'recapiti' })}
        </Typography>
        {value ? (
          <DigitalContactElem
            senderId="default"
            contactType={ChannelType.SMS}
            ref={digitalElemRef}
            inputProps={{
              id: 'sms',
              name: 'sms',
              label: t(`courtesy-contacts.link-sms-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values.sms,
              onChange: (e) => void handleChangeTouched(e),
              error: formik.touched.sms && Boolean(formik.errors.sms),
              helperText: formik.touched.sms && formik.errors.sms,
            }}
            saveDisabled={!formik.isValid}
            onDelete={() => setModalOpen(ModalType.DELETE)}
            onEditCancel={() => formik.resetForm({ values: initialValues })}
            editManagedFromOutside
          />
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id="sms"
              name="sms"
              value={formik.values.sms}
              onChange={handleChangeTouched}
              error={formik.touched.sms && Boolean(formik.errors.sms)}
              helperText={formik.touched.sms && formik.errors.sms}
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
        value={formik.values.sms}
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
        title={t(`courtesy-contacts.sms-verify`, { ns: 'recapiti' }) + ` ${formik.values.sms}`}
        subtitle={<Trans i18nKey={`courtesy-contacts.sms-verify-descr`} ns="recapiti" />}
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
          value: formik.values.sms,
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
