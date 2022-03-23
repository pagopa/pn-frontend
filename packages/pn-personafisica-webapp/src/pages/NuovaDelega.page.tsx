import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Stack,
  Breadcrumbs,
} from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { CourtesyPage, fiscalCodeRegex, TitleBox } from '@pagopa-pn/pn-commons';
import PeopleIcon from '@mui/icons-material/People';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  createDelegation,
  CreateDelegationProps,
  resetNewDelegation,
} from '../redux/newDelegation/actions';
import { RootState } from '../redux/store';
import * as routes from '../navigation/routes.const';
import StyledLink from '../component/StyledLink/StyledLink';
import DropDownEntiMenuItem from './components/Deleghe/DropDownEnti';
import ErrorDeleghe from './components/Deleghe/ErrorDeleghe';
import VerificationCodeComponent from './components/Deleghe/VerificationCodeComponent';

const generateVCode = () =>
  Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');

const validationSchema = yup.object({
  selectPersonaFisicaOrPersonaGiuridica: yup.string().required('Email is required'),
  codiceFiscale: yup
    .string()
    .required('Il Codice Fiscale è obbligatorio')
    .matches(fiscalCodeRegex, 'Il codice fiscale inserito non è corretto'),
  email: yup.string().required('Email obbligatoria').email('Email non formattata correttamente'),
  nome: yup.string().required('Il nome è obbligatorio'),
  cognome: yup.string().required('Il cognome è obbligatorio'),
  enteSelect: yup.string(),
});

const NuovaDelega = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { created } = useAppSelector((state: RootState) => state.newDelegationState);

  const handleSubmit = (values: CreateDelegationProps) => {
    void dispatch(createDelegation(values));
  };

  const handleDelegationsClick = () => {
    dispatch(resetNewDelegation());
    navigate(routes.DELEGHE);
  };

  return (
    <Fragment>
      {!created && (
        <Box mt={3}>
          <Breadcrumbs aria-label="breadcrumb">
            <StyledLink to={routes.DELEGHE}>
              <PeopleIcon sx={{ mr: 0.5 }} />
              {t('Deleghe')}
            </StyledLink>
            <Typography color="text.primary" fontWeight={600}>
              {t('Nuova Delega')}
            </Typography>
          </Breadcrumbs>
          <TitleBox
            title={t('nuovaDelega.title')}
            subTitle={t('nuovaDelega.subtitle')}
            variantTitle="h3"
            variantSubTitle="body1"
          />
          <Typography sx={{mt: '1rem', mb:'1rem'}}>
            Campi Obbligatori *
          </Typography>
          <Card sx={{ padding: '30px', width: '80%', mt: 4 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{t('nuovaDelega.form.personType')}</Typography>
            <Formik
              initialValues={{
                selectPersonaFisicaOrPersonaGiuridica: 'pf',
                codiceFiscale: '',
                email: '',
                nome: '',
                cognome: '',
                selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
                expirationDate: Date.now(),
                enteSelect: '',
                verificationCode: generateVCode(),
              }}
              validationSchema={validationSchema}
              onSubmit={(values: CreateDelegationProps) => {
                handleSubmit(values);
              }}
              validateOnBlur={false}
            >
              {({ values, setFieldValue, touched, errors }) => (
                <Form>
                  <FormControl sx={{ width: '100%' }}>
                    <RadioGroup
                      aria-labelledby="radio-buttons-group-pf-pg"
                      defaultValue="pf"
                      name="selectPersonaFisicaOrPersonaGiuridica"
                      value={values.selectPersonaFisicaOrPersonaGiuridica.toString()}
                      onChange={(event) => {
                        setFieldValue(
                          'selectPersonaFisicaOrPersonaGiuridica',
                          event.currentTarget.value
                        );
                      }}
                    >
                      <Grid container sx={{ width: '100%' }}>
                        <Grid item xs={3}>
                          <FormControlLabel
                            value="pf"
                            control={<Radio />}
                            name={'selectPersonaFisicaOrPersonaGiuridica'}
                            label={t('nuovaDelega.form.naturalPerson') as string}
                          />
                        </Grid>
                        <Grid item xs={4} sx={{ margin: 'auto' }}>
                          <TextField
                            sx={{ margin: 'auto' }}
                            id="nome"
                            value={values.nome.toString()}
                            onChange={(event) => {
                              setFieldValue('nome', event.currentTarget.value);
                            }}
                            label={t('nuovaDelega.form.firstName')}
                            name="nome"
                            error={touched.nome && Boolean(errors.nome)}
                            helperText={touched.nome && errors.nome}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={4} sx={{ margin: 'auto' }}>
                          <TextField
                            sx={{ margin: 'auto' }}
                            id="cognome"
                            value={values.cognome.toString()}
                            onChange={(event) => {
                              setFieldValue('cognome', event.currentTarget.value);
                            }}
                            label={t('nuovaDelega.form.lastName')}
                            name="cognome"
                            error={touched.cognome && Boolean(errors.cognome)}
                            helperText={touched.cognome && errors.cognome}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <FormControlLabel
                        value="pg"
                        control={<Radio />}
                        name={'selectPersonaFisicaOrPersonaGiuridica'}
                        label={t('nuovaDelega.form.legalPerson') as string}
                        disabled
                      />
                    </RadioGroup>
                  </FormControl>
                  <TextField
                    sx={{ marginTop: '2rem' }}
                    id="codiceFiscale"
                    value={values.codiceFiscale.toString()}
                    onChange={(event) => {
                      setFieldValue('codiceFiscale', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.fiscalCode')}
                    name="codiceFiscale"
                    error={touched.codiceFiscale && Boolean(errors.codiceFiscale)}
                    helperText={touched.codiceFiscale && errors.codiceFiscale}
                    fullWidth
                  />
                  <TextField
                    sx={{ marginTop: '1rem' }}
                    id="email"
                    value={values.email.toString()}
                    onChange={(event) => {
                      setFieldValue('email', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.email')}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                  />
                  <Typography fontWeight={'bold'} sx={{ marginTop: '2rem' }}>
                    {t('nuovaDelega.form.viewFrom')}
                  </Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <RadioGroup
                      aria-labelledby="radio-buttons-group-pf-pg"
                      defaultValue="tuttiGliEnti"
                      name="selectTuttiEntiOrSelezionati"
                      value={values.selectTuttiEntiOrSelezionati.toString()}
                      onChange={(event) => {
                        setFieldValue('selectTuttiEntiOrSelezionati', event.currentTarget.value);
                      }}
                    >
                      <FormControlLabel
                        value="tuttiGliEnti"
                        control={<Radio />}
                        name={t('selectTuttiEntiOrSelezionati')}
                        label={t('nuovaDelega.form.allEntities') as string}
                      />
                      <Grid container>
                        <Grid item xs={6}>
                          <FormControlLabel
                            value="entiSelezionati"
                            control={<Radio />}
                            name={'selectTuttiEntiOrSelezionati'}
                            label={t('nuovaDelega.form.onlySelected') as string}
                          />
                        </Grid>
                        <Grid item xs={6} sx={{ margin: 'auto' }}>
                          {values.selectTuttiEntiOrSelezionati === 'entiSelezionati' ? (
                            <FormControl fullWidth>
                              <InputLabel id="ente-select">{t('Seleziona Enti')}</InputLabel>
                              <Select
                                labelId="ente-select"
                                id="ente-select"
                                value={values.enteSelect}
                                label={t('Seleziona Enti')}
                                onChange={(event: SelectChangeEvent<string>) => {
                                  setFieldValue('enteSelect', event.target.value);
                                }}
                              >
                                <MenuItem value={'Bollate'}>
                                  <DropDownEntiMenuItem name="Comune di Bollate" />
                                </MenuItem>
                                <MenuItem value={'Rho'}>
                                  <DropDownEntiMenuItem name="Comune di Rho" />
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                  <br />
                  <Box sx={{ marginTop: '1rem' }}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DesktopDatePicker
                        label={t('nuovaDelega.form.endDate')}
                        inputFormat="DD/MM/yyyy"
                        value={values.expirationDate}
                        onChange={(value: Date | null) => {
                          setFieldValue('expirationDate', value);
                        }}
                        renderInput={(params) => (
                          <TextField id="endDate" name="endDate" {...params} />
                        )}
                        disablePast={true}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Divider sx={{ marginTop: '1rem' }} />
                  <Typography fontWeight={'bold'} sx={{ marginTop: '1rem' }}>
                    {t('nuovaDelega.form.verificationCode')}
                  </Typography>
                  <Grid container>
                    <Grid item xs={8}>
                      <Typography sx={{ marginTop: '1rem' }}>
                        {t('nuovaDelega.form.verificationCodeDescr')}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ margin: 'auto' }}>
                      <VerificationCodeComponent code={values.verificationCode} />
                    </Grid>
                  </Grid>
                  <Divider sx={{ marginTop: '1rem' }} />
                  <Grid container sx={{ marginTop: '1rem' }}>
                    <Grid item xs={4} sx={{ margin: 'auto' }}>
                      <Button
                        sx={{ marginTop: '1rem', margin: 'auto' }}
                        type={'submit'}
                        variant={'contained'}
                      >
                        {t('nuovaDelega.form.submit')}
                      </Button>
                    </Grid>
                    <Grid item xs={8} sx={{ margin: 'auto' }}>
                      <Stack direction="row" alignItems="center" justifyContent="end">
                        <ErrorDeleghe errorType={0} />
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Card>
          <Button variant="outlined" sx={{mt:"1rem", mb:"1rem"}} onClick={()=>navigate("/deleghe")}>Indietro</Button>
        </Box>
      )}
      {created && (
        <CourtesyPage
          icon={<IllusCompleted />}
          title={t('La tua richiesta di delega è stata creata con successo')}
          subtitle={t(
            'Condividi il codice di verifica con la persona delegata: dovrà inserirlo al primo accesso a Piattaforma Notifiche e accettare la tua richiesta.'
          )}
          onClick={handleDelegationsClick}
          onClickLabel={t('Torna alle tue deleghe')}
        />
      )}
    </Fragment>
  );
};

export default NuovaDelega;
