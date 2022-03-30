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
import { IllusEmailValidation } from '@pagopa/mui-italia';

import { LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import LegalContactsButton from './LegalContactsButton';

type Props = {
  recipientId: string;
};

const InsertLegalContact = ({ recipientId }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const buttonRef = useRef();

  const descriptionBox = [
    { id: 'save-money', label: t('legal-contacts.save-money', { ns: 'recapiti' }) },
    { id: 'avoid-waste', label: t('legal-contacts.avoid-waste', { ns: 'recapiti' }) },
    {
      id: 'fast-notification',
      label: t('legal-contacts.fast-notification', { ns: 'recapiti' }),
    },
  ];

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
          sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
          title={t('legal-contacts.subtitle', { ns: 'recapiti' })}
          subtitle={t('legal-contacts.description', { ns: 'recapiti' })}
          avatar={<IllusEmailValidation />}
          actions={
            <LegalContactsButton
              recipientId={recipientId}
              digitalDomicileType={formik.values.digitalDomicileType}
              pec={formik.values.pec}
              ref={buttonRef}
              successMessage={t('legal-contacts.pec-added', { ns: 'recapiti' })}
              closeModalOnVerification={false}
            >
              <Button
                variant="contained"
                sx={{ marginLeft: 'auto' }}
                type="submit"
                disabled={!formik.isValid}
              >
                {t('button.associa')}
              </Button>
            </LegalContactsButton>
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
                        inputProps={{ sx: { height: '12px' } }}
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
    </Fragment>
  );
};

export default InsertLegalContact;
