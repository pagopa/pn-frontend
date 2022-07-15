import { Button, Grid, TextField, InputAdornment, Typography } from '@mui/material';

import { ChangeEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CourtesyChannelType } from '../../models/contacts';
import { internationalPhonePrefix, phoneRegExp } from '../../utils/contacts.utility';
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
}

const CourtesyContactItem = ({ recipientId, type, value }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const digitalDomicileType = useMemo(
    () => (type === CourtesyFieldType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS),
    []
  );

  const emailValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const phoneValidationSchema = yup.object().shape({
    phone: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(phoneRegExp, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
  });

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
    await formik.setFieldTouched(event.target.id, true, false);
  };

  const handleEditConfirm = async (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      await formik.setFieldValue(type, value, true);
    }
  };

  useEffect(() => {
    void formik.setFieldValue(type, value, true);
  }, [value]);

  if (value) {
    return (
      <form style={{ width: '100%'}}>
        <Typography variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>{t(`courtesy-contacts.${type}-added`, { ns: 'recapiti' })}</Typography>
        <DigitalContactElem
          recipientId={recipientId}
          senderId="default"
          contactType={digitalDomicileType}
          removeModalTitle={t(`courtesy-contacts.remove-${type}-title`, { ns: 'recapiti' })}
          removeModalBody={t(`courtesy-contacts.remove-${type}-message`, {
            value: formik.values[type],
            ns: 'recapiti',
          })}
          value={formik.values[type]}
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
                  error={formik.touched[type] && Boolean(formik.errors[type])}
                  helperText={formik.touched[type] && formik.errors[type]}
                />
              ),
              isEditable: true,
              size: 'auto',
            },
          ]}
          saveDisabled={!formik.isValid}
          onConfirmClick={handleEditConfirm}
          forceMobileView
        />
      </form>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} style={{ width: '100%'}}>
      <Typography id={`${type}-label`} variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>{t(`courtesy-contacts.${type}-added`, { ns: 'recapiti' })}</Typography>
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
            inputProps={{ sx: { height: '14px' } }}
            placeholder={t(`courtesy-contacts.link-${type}-placeholder`, {
              ns: 'recapiti',
            })}
            fullWidth
            type={type === CourtesyFieldType.EMAIL ? 'mail' : 'tel'}
            InputProps={ type === CourtesyFieldType.PHONE ? {
              startAdornment: (
                <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
              ),
            } : {}}
          />
        </Grid>
        <Grid item lg={4} sm={4} xs={12} alignItems="right">
          <Button variant="outlined" disabled={!formik.isValid} fullWidth type="submit">
            {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CourtesyContactItem;
