import { useFormik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType } from '../../models/contacts';
import { deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  emailValidationSchema,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

interface Props {
  type: ChannelType.EMAIL | ChannelType.SMS;
  value: string;
  blockDelete?: boolean;
}

const CourtesyContactItem = ({ type, value, blockDelete }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const contactType = type.toLowerCase();
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useAppDispatch();

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
      const contactValue =
        type === ChannelType.EMAIL
          ? formik.values[contactType]
          : internationalPhonePrefix + formik.values[contactType];
      if (value) {
        digitalElemRef.current.editContact();
      } else {
        initValidation(type, contactValue, 'default');
      }
    },
  });

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
    </>
  );
};

export default CourtesyContactItem;
