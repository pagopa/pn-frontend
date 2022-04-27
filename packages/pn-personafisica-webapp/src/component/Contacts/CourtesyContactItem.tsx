import { Button, Grid, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CourtesyChannelType } from '../../models/contacts';
import { phoneRegExp } from '../../utils/contacts.utility';
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
  const previousValue = useRef(value);

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

  const initialValues = useMemo(
    () => ({
      [type]: value,
    }),
    [value]
  );

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema:
      type === CourtesyFieldType.EMAIL ? emailValidationSchema : phoneValidationSchema,
    onSubmit: () => {
      initValidation(digitalDomicileType, formik.values[type], recipientId, 'default');
    },
  });

  const handleChangeTouched = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    void formik.setFieldTouched(event.target.id, true, false);
    formik.handleChange(event);
  };

  const handleEditConfirm = (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      formik.resetForm({ values: initialValues });
    }
  };

  useEffect(() => {
    if (value !== previousValue.current && !value) {
      formik.resetForm();
    }
    /* eslint-disable functional/immutable-data */
    previousValue.current = value;
    /* eslint-enable functional/immutable-data */
  }, [value]);

  if (value) {
    return (
      <form style={{ width: '100%', margin: '1rem 0' }}>
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
        />
      </form>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} style={{ width: '100%', margin: '1rem 0' }}>
      <Grid container spacing={2} direction="row">
        <Grid item lg={8} xs={12}>
          <TextField
            id={type}
            name={type}
            value={formik.values[type]}
            onChange={handleChangeTouched}
            error={formik.touched[type] && Boolean(formik.errors[type])}
            helperText={formik.touched[type] && formik.errors[type]}
            inputProps={{ sx: { height: '12px' } }}
            placeholder={t(`courtesy-contacts.link-${type}-placeholder`, {
              ns: 'recapiti',
            })}
            fullWidth
            type={type === CourtesyFieldType.EMAIL ? 'mail' : 'tel'}
          />
        </Grid>
        <Grid item lg={4} xs={12} alignItems="right">
          <Button variant="outlined" disabled={!formik.isValid} fullWidth type="submit">
            {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CourtesyContactItem;
