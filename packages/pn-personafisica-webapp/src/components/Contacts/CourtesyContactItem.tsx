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
  DELETE = 'delete',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const CourtesyContactItem = ({ type, value, blockDelete }: Props) => {
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

  const contactType = type.toLowerCase();

  const emailValidationSch = yup.object().shape({
    email: emailValidationSchema(t),
  });

  const phoneValidationSch = yup.object().shape({
    sms: phoneValidationSchema(t, !!value),
  });

  const initialValues = {
    [contactType]: value ?? '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: type === ChannelType.EMAIL ? emailValidationSch : phoneValidationSch,
    validateOnMount: true,
    enableReinitialize: true,
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

  const getContactValue = (type: ChannelType) => {
    if (type === ChannelType.EMAIL) {
      return formik.values.email;
    }
    return type === ChannelType.SMS && value
      ? formik.values.sms
      : internationalPhonePrefix + formik.values.sms;
  };

  const handleChangeTouched = async (event: ChangeEvent) => {
    formik.handleChange(event);
    await formik.setFieldTouched(event.target.id, true, false);
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
      channelType: type,
      value: getContactValue(type),
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        PFEventStrategyFactory.triggerEvent(
          type === ChannelType.SMS
            ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
            : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
          'default'
        );

        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.${contactType}-added-successfully`, {
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
    await formik.setFieldTouched(contactType, false, false);
    await formik.setFieldValue(contactType, initialValues[contactType], true);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: type,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(
          type === ChannelType.EMAIL
            ? PFEventsType.SEND_REMOVE_EMAIL_SUCCESS
            : PFEventsType.SEND_REMOVE_SMS_SUCCESS,
          'default'
        );
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
        PFEventStrategyFactory.triggerEvent(
          type === ChannelType.SMS
            ? PFEventsType.SEND_ADD_SMS_CODE_ERROR
            : PFEventsType.SEND_ADD_EMAIL_CODE_ERROR
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
      <form onSubmit={formik.handleSubmit} data-testid={`courtesyContacts-${contactType}`}>
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
              onChange: (e) => void handleChangeTouched(e),
              error:
                (formik.touched[contactType] || formik.values[contactType].length > 0) &&
                Boolean(formik.errors[contactType]),
              helperText:
                (formik.touched[contactType] || formik.values[contactType].length > 0) &&
                formik.errors[contactType],
            }}
            saveDisabled={!formik.isValid}
            onDelete={() => setModalOpen(ModalType.DELETE)}
            onEditCancel={() => formik.resetForm({ values: initialValues })}
            editManagedFromOutside
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
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values[contactType]}
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
        content={t(`alert-dialog-${type}`, { ns: 'recapiti' })}
      />
      <CodeModal
        title={
          t(`courtesy-contacts.${contactType}-verify`, { ns: 'recapiti' }) +
          ` ${formik.values[contactType]}`
        }
        subtitle={<Trans i18nKey={`courtesy-contacts.${contactType}-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`courtesy-contacts.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`courtesy-contacts.${contactType}-new-code`, { ns: 'recapiti' })}
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
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
    </>
  );
};

export default CourtesyContactItem;
