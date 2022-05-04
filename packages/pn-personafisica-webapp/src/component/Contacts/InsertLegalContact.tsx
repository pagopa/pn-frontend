import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';

import { LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import LegalContactsDisclosure from './LegalContactsDisclosure';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

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
        .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
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
        avatar={<IllusEmailValidation />}
        actions={
          <Button
            variant="contained"
            sx={{ marginLeft: 'auto' }}
            type="submit"
            disabled={!formik.isValid}
          >
            {t('button.associa')}
          </Button>
        }
      >
        <LegalContactsDisclosure />
        <Divider />
        <FormControl sx={{ margin: '20px 0', width: '100%' }}>
          <RadioGroup
            id="digitalDomicileType"
            aria-labelledby="digital-domicile"
            value={formik.values.digitalDomicileType}
            name="digitalDomicileType"
            onChange={handleChangeTouched}
          >
            <FormControlLabel
              data-testid="digitalDomicileTypeRadio"
              value={LegalChannelType.PEC}
              control={<Radio aria-label={t('legal-contacts.link-pec', { ns: 'recapiti' })} />}
              label={
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={3}>
                    <Typography color="text.primary" fontWeight={400} fontSize={16}>
                      {t('legal-contacts.link-pec', { ns: 'recapiti' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="pec"
                      placeholder={t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' })}
                      fullWidth
                      name="pec"
                      value={formik.values.pec}
                      onChange={handleChangeTouched}
                      error={formik.touched.pec && Boolean(formik.errors.pec)}
                      helperText={formik.touched.pec && formik.errors.pec}
                      disabled={formik.values.digitalDomicileType !== LegalChannelType.PEC}
                      size="small"
                    />
                  </Grid>
                </Grid>
              }
              sx={{ '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
            <FormControlLabel
              data-testid="digitalDomicileTypeRadio"
              control={<Radio aria-label={t('legal-contacts.link-io', { ns: 'recapiti' })} />}
              label={
                <Typography color="text.disabled" fontWeight={400} fontSize={16}>
                  {t('legal-contacts.link-io', { ns: 'recapiti' })}
                </Typography>
              }
              value={LegalChannelType.IOPEC}
              disabled
            />
          </RadioGroup>
        </FormControl>
        <Divider />
        <Box sx={{ marginTop: '20px' }}>
          <Typography color="text.primary" fontWeight={400} fontSize={16}>
            {t('legal-contacts.io-disclaimer', { ns: 'recapiti' })}
          </Typography>
        </Box>
      </DigitalContactsCard>
    </form>
  );
};

export default InsertLegalContact;
