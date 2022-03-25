import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import DigitalContactsCard from './DigitalContactsCard';

const InsertDigitalContact = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  const descriptionBox = [
    { id: 'save-money', label: t('digital-contacts.save-money', { ns: 'recapiti' }) },
    { id: 'avoid-waste', label: t('digital-contacts.avoid-waste', { ns: 'recapiti' }) },
    {
      id: 'fast-notification',
      label: t('digital-contacts.fast-notification', { ns: 'recapiti' }),
    },
  ];

  const validationSchema = yup.object({
    digitalDomicileType: yup.string().required(),
    pec: yup.string().when('digitalDomicileType', {
      is: 'pec',
      then: yup.string()
        .required(t('digital-contacts.valid-pec', { ns: 'recapiti' }))
        .email(t('digital-contacts.valid-pec', { ns: 'recapiti' }))
    })
  });

  const formik = useFormik({
    initialValues: {
      digitalDomicileType: 'pec',
      pec: ''
    },
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: values => {
      console.log(values);
    },
  });

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <DigitalContactsCard
        title={t('digital-contacts.subtitle', { ns: 'recapiti' })}
        subtitle={t('digital-contacts.description', { ns: 'recapiti' })}
        actions={
          <Button variant="contained" sx={{ marginLeft: 'auto' }} type="submit" disabled={!formik.isValid}>
            {t('button.associa')}
          </Button>
        }
      >
        <List sx={{ margin: '20px 0' }}>
          {descriptionBox.map((d) => (
            <ListItem key={d.id}>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText>
                <Typography color="text.primary" fontWeight={400} fontSize={16}>
                  {d.label}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
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
              value="pec"
              control={<Radio aria-label={t('digital-contacts.link-pec', { ns: 'recapiti' })} />}
              label={
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={3}>
                    <Typography color="text.primary" fontWeight={400} fontSize={16}>
                      {t('digital-contacts.link-pec', { ns: 'recapiti' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <OutlinedInput
                      id="pec"
                      placeholder={t('digital-contacts.link-pec-placeholder', { ns: 'recapiti' })}
                      fullWidth
                      sx={{ height: '40px' }}
                      name="pec"
                      value={formik.values.pec}
                      onChange={handleChangeTouched}
                      error={formik.touched.pec && Boolean(formik.errors.pec)}
                      disabled={formik.values.digitalDomicileType !== 'pec'}
                    />
                    {formik.touched.pec && Boolean(formik.errors.pec) && <FormHelperText error>{formik.errors.pec}</FormHelperText>}
                  </Grid>
                </Grid>
              }
              sx={{ '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
            <FormControlLabel
              control={<Radio aria-label={t('digital-contacts.link-io', { ns: 'recapiti' })} />}
              label={
                <Typography color="text.disabled" fontWeight={400} fontSize={16}>
                  {t('digital-contacts.link-io', { ns: 'recapiti' })}
                </Typography>
              }
              value="io"
              disabled
            />
          </RadioGroup>
        </FormControl>
        <Divider />
        <Box sx={{ marginTop: '20px' }}>
          <Typography color="text.primary" fontWeight={400} fontSize={16}>
            {t('digital-contacts.io-disclaimer', { ns: 'recapiti' })}
          </Typography>
        </Box>
      </DigitalContactsCard>
    </form>
  );
};

export default InsertDigitalContact;
