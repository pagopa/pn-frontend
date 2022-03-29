import { ChangeEvent, Fragment, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import DigitalContactsButton from './DigitalContactsButton';

type Props = {
  recipientId: string;
};

const InsertDigitalContact = ({ recipientId }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const buttonRef = useRef();

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
      is: LegalChannelType.PEC,
      then: yup
        .string()
        .required(t('digital-contacts.valid-pec', { ns: 'recapiti' }))
        .email(t('digital-contacts.valid-pec', { ns: 'recapiti' })),
    }),
  });

  const formik = useFormik({
    initialValues: {
      digitalDomicileType: LegalChannelType.PEC,
      pec: '',
    },
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: () => {
      (buttonRef.current as any).handleAddressCreation();
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
    <Fragment>
      <form onSubmit={formik.handleSubmit}>
        <DigitalContactsCard
          title={t('digital-contacts.subtitle', { ns: 'recapiti' })}
          subtitle={t('digital-contacts.description', { ns: 'recapiti' })}
          actions={
            <DigitalContactsButton
              recipientId={recipientId}
              digitalDomicileType={formik.values.digitalDomicileType}
              pec={formik.values.pec}
              ref={buttonRef}
              successMessage={t('digital-contacts.pec-added', { ns: 'recapiti' })}
            >
              <Button
                variant="contained"
                sx={{ marginLeft: 'auto' }}
                type="submit"
                disabled={!formik.isValid}
              >
                {t('button.associa')}
              </Button>
            </DigitalContactsButton>
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
                value={LegalChannelType.PEC}
                control={<Radio aria-label={t('digital-contacts.link-pec', { ns: 'recapiti' })} />}
                label={
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={3}>
                      <Typography color="text.primary" fontWeight={400} fontSize={16}>
                        {t('digital-contacts.link-pec', { ns: 'recapiti' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        id="pec"
                        placeholder={t('digital-contacts.link-pec-placeholder', { ns: 'recapiti' })}
                        fullWidth
                        name="pec"
                        value={formik.values.pec}
                        onChange={handleChangeTouched}
                        error={formik.touched.pec && Boolean(formik.errors.pec)}
                        helperText={formik.touched.pec && formik.errors.pec}
                        disabled={formik.values.digitalDomicileType !== LegalChannelType.PEC}
                        inputProps={{ sx: { height: '12px' } }}
                      />
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
                value={LegalChannelType.IOPEC}
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
    </Fragment>
  );
};

export default InsertDigitalContact;
