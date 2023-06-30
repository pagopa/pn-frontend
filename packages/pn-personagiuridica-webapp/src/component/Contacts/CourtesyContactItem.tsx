import { Button, Grid, TextField, InputAdornment, Typography } from '@mui/material';

import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { dataRegex } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType } from '../../models/contacts';
import { internationalPhonePrefix } from '../../utils/contacts.utility';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import DigitalContactElem from './DigitalContactElem';

export enum CourtesyFieldType {
  EMAIL = 'email',
  PHONE = 'phone',
}

interface Props {
  recipientId: string;
  type: CourtesyFieldType;
  value: string;
  blockDelete?: boolean;
}

const CourtesyContactItem = ({ recipientId, type, value, blockDelete }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const [phoneRegex, setPhoneRegex] = useState(dataRegex.phoneNumber);
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });

  const digitalDomicileType = useMemo(
    () => (type === CourtesyFieldType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS),
    []
  );

  const emailValidationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
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
        phone: yup
          .string()
          .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
          .matches(phoneRegex, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
      }),
    [phoneRegex]
  );

  const formik = useFormik({
    initialValues: {
      [type]: '',
    },
    validateOnMount: true,
    validationSchema:
      type === CourtesyFieldType.EMAIL ? emailValidationSchema : phoneValidationSchema,
    onSubmit: () => {
      const contactValue =
        type === CourtesyFieldType.EMAIL
          ? formik.values[type]
          : internationalPhonePrefix + formik.values[type];
      initValidation(digitalDomicileType, contactValue, recipientId, 'default');
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
      await formik.setFieldValue(type, value, true);
    }
  };

  // the regex for the phone number should
  // - not include Italy intl. prefix +39 when the SMS courtesy address is *inserted*
  // - include Italy intl. prefix +39 when the SMS courtesy address is *modified*
  // we detect the insertion vs. modification behavior based on the presence or absence
  // of the value prop, so that we change the regex to be applied to the phone number field
  useEffect(() => {
    // the change of the phone regex must actually await that the field value is set
    // to avoid a subtle bug
    const changeValue = async () => {
      await formik.setFieldValue(type, value, true);
      setPhoneRegex(value ? dataRegex.phoneNumberWithItalyPrefix : dataRegex.phoneNumber);
    };
    void changeValue();
  }, [value]);

  // if the phoneRegex changes from its initial value of phoneRegExp to phoneRegExpWithItalyPrefix
  // then we re-run the Formik validation on the field' value
  useEffect(() => {
    if (phoneRegex === dataRegex.phoneNumberWithItalyPrefix) {
      void formik.validateField(type);
    }
  }, [phoneRegex]);

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContactElem component includes the "update" button)
   */
  if (value) {
    return (
      <form
        style={{ width: '100%' }}
        onSubmit={(e) => {
          e.preventDefault();
          digitalElemRef.current.editContact();
        }}
      >
        <Typography variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
          {t(`courtesy-contacts.${type}-added`, { ns: 'recapiti' })}
        </Typography>
        <DigitalContactElem
          recipientId={recipientId}
          senderId="default"
          contactType={digitalDomicileType}
          removeModalTitle={
            blockDelete
              ? t(`courtesy-contacts.block-remove-${type}-title`, { ns: 'recapiti' })
              : t(`courtesy-contacts.remove-${type}-title`, { ns: 'recapiti' })
          }
          removeModalBody={
            blockDelete
              ? t(`courtesy-contacts.block-remove-${type}-message`, { ns: 'recapiti' })
              : t(`courtesy-contacts.remove-${type}-message`, {
                  value: formik.values[type],
                  ns: 'recapiti',
                })
          }
          value={formik.values[type]}
          ref={digitalElemRef}
          fields={[
            {
              id: `value-${type}`,
              component: (
                <TextField
                  id={type}
                  fullWidth
                  name={type}
                  label={t(`courtesy-contacts.link-${type}-placeholder`, {
                    ns: 'recapiti',
                  })}
                  variant="outlined"
                  size="small"
                  value={formik.values[type]}
                  onChange={handleChangeTouched}
                  error={
                    (formik.touched[type] || formik.values[type].length > 0) &&
                    Boolean(formik.errors[type])
                  }
                  helperText={
                    (formik.touched[type] || formik.values[type].length > 0) && formik.errors[type]
                  }
                />
              ),
              isEditable: true,
              size: 'auto',
            },
          ]}
          saveDisabled={!formik.isValid}
          onConfirmClick={handleEditConfirm}
          blockDelete={blockDelete}
          resetModifyValue={() => handleEditConfirm('cancelled')}
          onDeleteCbk={() => void handleTouched(type, false)}
        />
      </form>
    );
  }

  /*
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
      <Typography id={`${type}-label`} variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
        {t(`courtesy-contacts.${type}-added`, { ns: 'recapiti' })}
      </Typography>
      <Grid container spacing={2} direction="row">
        <Grid item lg={8} sm={8} xs={12}>
          <TextField
            id={type}
            name={type}
            aria-labelledby={`${type}-label`}
            value={formik.values[type]}
            onChange={handleChangeTouched}
            error={formik.touched[type] && Boolean(formik.errors[type])}
            helperText={formik.touched[type] && formik.errors[type]}
            inputProps={{ sx: { height: '14px' }, 'data-testid': `courtesy-contact-${type}` }}
            placeholder={
              type !== CourtesyFieldType.PHONE
                ? t(`courtesy-contacts.link-${type}-placeholder`, {
                    ns: 'recapiti',
                  })
                : ''
            }
            fullWidth
            type={type === CourtesyFieldType.EMAIL ? 'mail' : 'tel'}
            InputProps={
              type === CourtesyFieldType.PHONE
                ? {
                    startAdornment: (
                      <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                    ),
                  }
                : {}
            }
          />
        </Grid>
        <Grid item lg={4} sm={4} xs={12} alignItems="right">
          <Button
            variant="outlined"
            disabled={!formik.isValid}
            fullWidth
            type="submit"
            data-testid={`add ${type}`}
          >
            {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CourtesyContactItem;
