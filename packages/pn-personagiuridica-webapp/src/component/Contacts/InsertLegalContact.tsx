import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { dataRegex } from '@pagopa-pn/pn-commons';

import { LegalChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import DigitalContactsCard from './DigitalContactsCard';

type Props = {
  recipientId: string;
};

const InsertLegalContact = ({ recipientId }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const validationSchema = yup.object({
    digitalDomicileType: yup.string().required(),
    pec: yup.string().when('digitalDomicileType', {
      is: LegalChannelType.PEC,
      then: yup
        .string()
        .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
        .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    }),
  });

  const formik = useFormik({
    initialValues: {
      digitalDomicileType: LegalChannelType.PEC,
      pec: '',
    },
    validateOnMount: true,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {
      initValidation(formik.values.digitalDomicileType, formik.values.pec, recipientId, 'default');
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DigitalContactsCard
        sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
        title={t('legal-contacts.subtitle', { ns: 'recapiti' })}
        subtitle={t('legal-contacts.description', { ns: 'recapiti' })}
        avatar={<IllusEmailValidation size={60} />}
      >
        <Grid container spacing={2} direction="row" mt={3}>
          <Grid item lg={4} sm={4} xs={12}>
            <TextField
              id="pec"
              placeholder={t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' })}
              fullWidth
              name="pec"
              inputProps={{ sx: { height: '14px' } }}
              value={formik.values.pec}
              onChange={handleChangeTouched}
              error={formik.touched.pec && Boolean(formik.errors.pec)}
              helperText={formik.touched.pec && formik.errors.pec}
              disabled={formik.values.digitalDomicileType !== LegalChannelType.PEC}
            />
          </Grid>
          <Grid item lg={2} sm={2} xs={12} alignItems="right">
            <Button
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid="add contact"
            >
              {t('button.conferma')}
              {/* {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })} */}
            </Button>
          </Grid>
        </Grid>
        <Alert
          tabIndex={0}
          aria-label={t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}
          sx={{ mt: 4 }}
          severity="info"
        >
          <Typography
            role="banner"
            component="span"
            variant="body1"
            data-testid="legal contact disclaimer"
          >
            {t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}{' '}
          </Typography>
          {/** 
           * Waiting for FAQs
          <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant="body1">
            {t('legal-contacts.disclaimer-link', { ns: 'recapiti' })}
          </Link>
           * */}
        </Alert>
      </DigitalContactsCard>
    </form>
  );
};

export default InsertLegalContact;
