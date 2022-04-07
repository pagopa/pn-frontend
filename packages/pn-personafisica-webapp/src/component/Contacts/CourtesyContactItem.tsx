import { Close } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import { CourtesyChannelType } from '../../models/contacts';
import { createOrUpdateCourtesyAddress } from '../../redux/contact/actions';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

export enum CourtesyFieldType {
  EMAIL = 'email',
  PHONE = 'phone',
}

interface Props {
  recipientId: string;
  type: CourtesyFieldType;
  value: string;
  isVerified: boolean;
}

const CourtesyContactItem: React.FC<Props> = ({ recipientId, type, value, isVerified }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'recapiti']);

  const digitalDomicileType = type === CourtesyFieldType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS;
  const { setProps, handleCodeVerification } = useDigitalContactsCodeVerificationContext();
  const [isEditMode, SetIsEditMode] = useState(!isVerified);

  const emailValidationSchema = yup.object().shape({
    field: yup
      .string()
      .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const phoneValidationSchema = yup.object().shape({
    field: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(/^\d{9,10}$/, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
  });

  const formik = useFormik({
    initialValues: {
      field: value,
    },
    validationSchema:
      type === CourtesyFieldType.EMAIL ? emailValidationSchema : phoneValidationSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    void formik.validateForm();
  }, []);

  const enteredValueChanged = () => value !== formik.values.field;

  const saveDataHandler = () => {
    if (formik.isValid) {
      if (isVerified && !enteredValueChanged()) {
        SetIsEditMode(false);
      } else {
        handleAssociation();
      }
    }
  };

  const handleChangeTouched = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    void formik.setFieldTouched(event.target.id, true, false);
    formik.handleChange(event);
  };

  const handleAssociation = () => {
    setProps({
      title: t(`courtesy-contacts.${type}-verify`, { ns: 'recapiti' }) + ` ${formik.values.field}`,
      subtitle: <Trans i18nKey={`courtesy-contacts.${type}-verify-descr`} ns="recapiti" />,
      initialValues: new Array(5).fill(''),
      codeSectionTitle: t(`courtesy-contacts.insert-code`, { ns: 'recapiti' }),
      codeSectionAdditional: (
        <Box>
          <Typography variant="body2" display="inline">
            {t(`courtesy-contacts.${type}-new-code`, { ns: 'recapiti' })}&nbsp;
          </Typography>
          <Typography
            variant="body2"
            display="inline"
            color="primary"
            onClick={() => handleCodeVerification(undefined, true)}
            sx={{ cursor: 'pointer' }}
          >
            {t(`courtesy-contacts.new-code-link`, { ns: 'recapiti' })}.
          </Typography>
        </Box>
      ),
      cancelLabel: t('button.annulla'),
      confirmLabel: t('button.conferma'),
      errorMessage: t(`courtesy-contacts.wrong-code`, { ns: 'recapiti' }),
      recipientId,
      senderId: 'default',
      digitalDomicileType,
      value: formik.values.field,
      successMessage: t(`courtesy-contacts.${type}-added-successfully`, { ns: 'recapiti' }),
      actionToBeDispatched: createOrUpdateCourtesyAddress,
    });
  };

  if (isVerified && !isEditMode) {
    return (
      <Fragment>
        <Grid item lg={7} xs={8}>
          {!isMobile && (
            <IconButton aria-label="Elimina">
              <Close />
            </IconButton>
          )}
          <Typography variant="body2" display="inline">
            {value}&nbsp;
          </Typography>
        </Grid>
        {!isMobile && (
          <Grid item lg={5} xs={4}>
            <Button variant="text" fullWidth>
              Modifica
            </Button>
          </Grid>
        )}
        {isMobile && (
          <Grid item lg={5} xs={12}>
            <ButtonNaked color="primary" sx={{ marginRight: '10px' }}>
              {t('button.rimuovi')}
            </ButtonNaked>
            <ButtonNaked color="primary">{t('button.modifica')}</ButtonNaked>
          </Grid>
        )}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Grid item lg={7} xs={12}>
          <TextField
            id="field"
            name="field"
            value={formik.values.field}
            onChange={handleChangeTouched}
            error={formik.touched.field && Boolean(formik.errors.field)}
            helperText={formik.touched.field && formik.errors.field}
            inputProps={{ sx: { height: '12px' } }}
            placeholder={t(`courtesy-contacts.link-${type}-placeholder`, {
              ns: 'recapiti',
            })}
            fullWidth
          />
        </Grid>
        <Grid item lg={5} xs={12} alignItems="right">
          <Button variant="outlined" onClick={saveDataHandler} disabled={!formik.isValid} fullWidth>
            {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
          </Button>
        </Grid>
      </Fragment>
    );
  }
};

export default CourtesyContactItem;
