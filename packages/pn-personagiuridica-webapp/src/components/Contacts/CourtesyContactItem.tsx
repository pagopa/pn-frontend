import { useFormik } from 'formik';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { dataRegex } from '@pagopa-pn/pn-commons';

import { AddressType, CourtesyChannelType } from '../../models/contacts';
import { deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import { internationalPhonePrefix } from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

interface Props {
  type: CourtesyChannelType.EMAIL | CourtesyChannelType.SMS;
  value: string;
  blockDelete?: boolean;
}

const CourtesyContactItem = ({ type, value, blockDelete }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const phoneRegex = value ? dataRegex.phoneNumberWithItalyPrefix : dataRegex.phoneNumber;
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useAppDispatch();

  const digitalDomicileType = useMemo(
    () =>
      type === CourtesyChannelType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS,
    []
  );

  const emailValidationSchema = useMemo(
    () =>
      yup.object().shape({
        EMAIL: yup
          .string()
          .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
          .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
          .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
      }),
    []
  );

  // note that phoneValidationSchema depends on the phoneRegex which is different
  // for the insertion and modification cases, check the comment
  // about the useEffect which calls setPhoneRegex below
  const phoneValidationSchema = useMemo(
    () =>
      yup.object().shape({
        SMS: yup
          .string()
          .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
          .matches(phoneRegex, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
      }),
    [phoneRegex]
  );

  const formik = useFormik({
    initialValues: {
      [type]: value ?? '',
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema:
      type === CourtesyChannelType.EMAIL ? emailValidationSchema : phoneValidationSchema,
    onSubmit: () => {
      const contactValue =
        type === CourtesyChannelType.EMAIL
          ? formik.values[type]
          : internationalPhonePrefix + formik.values[type];
      if (value) {
        digitalElemRef.current.editContact();
      } else {
        initValidation(digitalDomicileType, contactValue, 'default');
      }
    },
  });

  const handleChangeTouched = async (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    formik.handleChange(event);
    await handleTouched(event.target.id.toUpperCase(), true);
  };

  const handleTouched = async (id: string, touched: boolean) => {
    await formik.setFieldTouched(id, touched, false);
  };

  const handleEditConfirm = async (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      await formik.setFieldValue(type, value, true);
    }
  };

  const deleteConfirmHandler = () => {
    setShowDeleteModal(false);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: digitalDomicileType,
      })
    )
      .unwrap()
      .then(() => {
        void handleTouched(type, false);
      })
      .catch(() => {});
  };

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContactElem component includes the "update" button)
   */
  /*
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <Typography id={`${type}-label`} variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
          {t(`courtesy-contacts.${type.toLowerCase()}-added`, { ns: 'recapiti' })}
        </Typography>
        {value ? (
          <Box data-testid={`courtesyContacts-${type.toLowerCase()}`}>
            <DigitalContactElem
              senderId="default"
              contactType={digitalDomicileType}
              ref={digitalElemRef}
              inputProps={{
                id: type,
                name: type,
                label: t(`courtesy-contacts.link-${type}-placeholder`, {
                  ns: 'recapiti',
                }),
                value: formik.values[type],
                onChange: (e) => void handleChangeTouched(e),
                error:
                  (formik.touched[type] || formik.values[type].length > 0) &&
                  Boolean(formik.errors[type]),
                helperText:
                  (formik.touched[type] || formik.values[type].length > 0) && formik.errors[type],
              }}
              saveDisabled={!formik.isValid}
              onConfirm={handleEditConfirm}
              resetModifyValue={() => handleEditConfirm('cancelled')}
              onDelete={() => setShowDeleteModal(true)}
            />
          </Box>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id={type.toLowerCase()}
              name={type}
              aria-labelledby={`${type}-label`}
              value={formik.values[type]}
              onChange={handleChangeTouched}
              error={formik.touched[type] && Boolean(formik.errors[type])}
              helperText={formik.touched[type] && formik.errors[type]}
              inputProps={{
                sx: { height: '14px' },
                'data-testid': `courtesy-contact-${type.toLowerCase()}`,
              }}
              placeholder={
                type !== CourtesyChannelType.SMS
                  ? t(`courtesy-contacts.link-${type.toLowerCase()}-placeholder`, {
                      ns: 'recapiti',
                    })
                  : ''
              }
              fullWidth
              type={type === CourtesyChannelType.EMAIL ? 'mail' : 'tel'}
              InputProps={
                type === CourtesyChannelType.SMS
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
              id={`courtesy-${type.toLowerCase()}-button`}
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid={`courtesy-${type.toLowerCase()}-button`}
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
            >
              {t(`courtesy-contacts.${type.toLowerCase()}-add`, { ns: 'recapiti' })}
            </Button>
          </Stack>
        )}
      </form>

      <DeleteDialog
        showModal={showDeleteModal}
        removeModalTitle={t(
          `courtesy-contacts.${blockDelete ? 'block-' : ''}remove-${type.toLowerCase()}-title`,
          { ns: 'recapiti' }
        )}
        removeModalBody={t(
          `courtesy-contacts.${blockDelete ? 'block-' : ''}remove-${type.toLowerCase()}-message`,
          {
            value: formik.values[type],
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
