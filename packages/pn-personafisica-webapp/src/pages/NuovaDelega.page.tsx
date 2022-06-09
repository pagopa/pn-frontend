import currentLocale from 'date-fns/locale/it';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
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
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';
import {
  CourtesyPage,
  CustomDatePicker,
  DATE_FORMAT,
  fiscalCodeRegex,
  PnBreadcrumb,
  TitleBox,
} from '@pagopa-pn/pn-commons';
import PeopleIcon from '@mui/icons-material/People';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  createDelegation,
  getAllEntities,
  resetNewDelegation,
} from '../redux/newDelegation/actions';
import { RootState } from '../redux/store';
import * as routes from '../navigation/routes.const';
import DropDownPartyMenuItem from '../component/Party/DropDownParty';
import ErrorDeleghe from '../component/Deleghe/ErrorDeleghe';
import VerificationCodeComponent from '../component/Deleghe/VerificationCodeComponent';
import { generateVCode } from '../utils/delegation.utility';
import { NewDelegationFormProps } from '../redux/delegation/types';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
  direction: {
    ['@media only screen and (max-width: 576px)']: {
      direction: 'column',
    },
    ['@media only screen and (min-width: 577px) and (max-width: 992px)']: {
      direction: 'row',
    },
  },
  margin: {
    ['@media only screen and (max-width: 576px)']: {
      margin: 0,
    },
    ['@media only screen and (min-width: 577px) and (max-width: 992px)']: {
      direction: 'auto',
    },
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}));

const NuovaDelega = () => {
  const classes = useStyles();
  const { t } = useTranslation(['deleghe', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { entities, created } = useAppSelector((state: RootState) => state.newDelegationState);
  const handleSubmit = (values: NewDelegationFormProps) => {
    void dispatch(createDelegation(values));
  };

  const handleDelegationsClick = () => {
    navigate(routes.DELEGHE);
  };

  const initialValues = {
    selectPersonaFisicaOrPersonaGiuridica: 'pf',
    codiceFiscale: '',
    nome: '',
    cognome: '',
    selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
    expirationDate: Date.now(),
    enteSelect: {
      name: '',
      uniqueIdentifier: '',
    },
    verificationCode: generateVCode(),
  };

  const validationSchema = yup.object({
    selectPersonaFisicaOrPersonaGiuridica: yup
      .string()
      .required(t('nuovaDelega.validation.email.required')),
    codiceFiscale: yup
      .string()
      .required(t('nuovaDelega.validation.fiscalCode.required'))
      .matches(fiscalCodeRegex, t('nuovaDelega.validation.fiscalCode.wrong')),
    nome: yup.string().required(t('nuovaDelega.validation.name.required')),
    cognome: yup.string().required(t('nuovaDelega.validation.surname.required')),
    enteSelect: yup.object({ name: yup.string(), uniqueIdentifier: yup.string() }).required(),
  });

  const xsValue = isMobile ? 12 : 4;

  useEffect(() => {
    void dispatch(getAllEntities());
    return () => void dispatch(resetNewDelegation());
  }, []);

  const breadcrumbs = (
    <Fragment>
      <PnBreadcrumb
        goBackLabel={t('button.indietro', { ns: 'common' })}
        linkRoute={routes.DELEGHE}
        linkLabel={
          <Fragment>
            <PeopleIcon sx={{ mr: 0.5 }} />
            {t('nuovaDelega.title')}
          </Fragment>
        }
        currentLocationLabel={t('Nuova Delega')}
      />
      <TitleBox
        title={t('nuovaDelega.title')}
        subTitle={t('nuovaDelega.subtitle')}
        variantTitle="h3"
        variantSubTitle="body1"
        sx={{ pt: '20px' }}
      />
      <Typography sx={{ mt: '1rem', mb: '1rem' }}>
        {t('nuovaDelega.form.mandatoryField')}
      </Typography>
    </Fragment>
  );

  return (
    <Fragment>
      {!created && (
        <Box className={classes.root} sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumbs}
          <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
            <Grid item lg={8} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumbs}
              <Paper sx={{ padding: '24px', marginBottom: '20px' }} className="paperContainer">
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('nuovaDelega.form.personType')}
                </Typography>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values: NewDelegationFormProps) => {
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
                          <Grid
                            container
                            sx={{ width: '100%', justifyContent: 'space-between' }}
                            className={classes.direction}
                          >
                            <Grid item xs={isMobile ? 12 : 3}>
                              <FormControlLabel
                                value="pf"
                                control={<Radio />}
                                name={'selectPersonaFisicaOrPersonaGiuridica'}
                                label={t('nuovaDelega.form.naturalPerson') as string}
                              />
                            </Grid>
                            <Grid item xs={xsValue} className={classes.margin}>
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
                            <Grid item xs={xsValue} className={classes.margin}>
                              <TextField
                                sx={{ margin: 'auto', mt: isMobile ? 1 : 0 }}
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
                            setFieldValue(
                              'selectTuttiEntiOrSelezionati',
                              event.currentTarget.value
                            );
                          }}
                        >
                          <FormControlLabel
                            value="tuttiGliEnti"
                            control={<Radio />}
                            name={t('selectTuttiEntiOrSelezionati')}
                            label={t('nuovaDelega.form.allEntities') as string}
                          />
                          <Grid container className={classes.direction}>
                            <Grid item xs={isMobile ? 12 : 6}>
                              <FormControlLabel
                                value="entiSelezionati"
                                control={<Radio />}
                                name={'selectTuttiEntiOrSelezionati'}
                                label={t('nuovaDelega.form.onlySelected') as string}
                              />
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 6} className={classes.margin}>
                              {values.selectTuttiEntiOrSelezionati === 'entiSelezionati' && (
                                <FormControl fullWidth>
                                  <InputLabel id="ente-select">{t('Seleziona Enti')}</InputLabel>
                                  <Select
                                    labelId="ente-select"
                                    id="ente-select"
                                    value={values.enteSelect.uniqueIdentifier}
                                    label={t('Seleziona Enti')}
                                    onChange={(event: SelectChangeEvent<string>) => {
                                      setFieldValue('enteSelect', {
                                        name: event.target.name,
                                        uniqueIdentifier: event.target.value,
                                      });
                                    }}
                                  >
                                    {entities.map((entity) => (
                                      <MenuItem value={entity.id} key={entity.id}>
                                        <DropDownPartyMenuItem name={entity.name} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      </FormControl>
                      <br />
                      <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={DateAdapter} locale={currentLocale}>
                            <CustomDatePicker
                              label={t('nuovaDelega.form.endDate')}
                              inputFormat={DATE_FORMAT}
                              value={values.expirationDate}
                              onChange={(value: Date | null) => {
                                setFieldValue('expirationDate', value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  id="endDate"
                                  name="endDate"
                                  {...params}
                                  aria-label="Data termine delega" // aria-label for (TextField + Button) Group
                                  inputProps={{
                                    ...params.inputProps,
                                    inputMode: 'text',
                                    'aria-label': 'Inserisci la data di termine della delega',
                                    type: 'text',
                                  }}
                                />
                              )}
                              disablePast={true}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Box>
                      <Divider sx={{ marginTop: '1rem' }} />
                      <Typography fontWeight={'bold'} sx={{ marginTop: '1rem' }}>
                        {t('nuovaDelega.form.verificationCode')}
                      </Typography>
                      <Stack
                        direction={{ xs: 'column', lg: 'row' }}
                        justifyContent={{ sm: 'flex-start' }}
                        spacing={2}
                      >
                        <Typography sx={{ marginTop: '1rem', flexGrow: '1' }}>
                          {t('nuovaDelega.form.verificationCodeDescr')}
                        </Typography>
                        <VerificationCodeComponent code={values.verificationCode} />
                      </Stack>
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
                            <ErrorDeleghe />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      {created && (
        <CourtesyPage
          icon={<CheckCircleOutlineIcon />}
          title={t('nuovaDelega.createdTitle')}
          subtitle={t('nuovaDelega.createdDescription')}
          onClick={handleDelegationsClick}
          onClickLabel={t('nuovaDelega.backToDelegations')}
        />
      )}
    </Fragment>
  );
};

export default NuovaDelega;
