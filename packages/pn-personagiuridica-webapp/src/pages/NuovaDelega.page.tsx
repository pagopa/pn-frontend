import currentLocale from 'date-fns/locale/it';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
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
  MenuItem,
  Stack,
  Paper,
  Autocomplete,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { IllusCompleted } from '@pagopa/mui-italia';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  CourtesyPage,
  CustomDatePicker,
  DatePickerTypes,
  DATE_FORMAT,
  TitleBox,
  useIsMobile,
  PnBreadcrumb,
  isToday,
  dataRegex,
  searchStringLimitReachedText,
  useSearchStringChangeInput,
  RecipientType,
} from '@pagopa-pn/pn-commons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createDelegation, getAllEntities } from '../redux/newDelegation/actions';
import { resetNewDelegation } from '../redux/newDelegation/reducers';
import { RootState } from '../redux/store';
import * as routes from '../navigation/routes.const';
import VerificationCodeComponent from '../component/Deleghe/VerificationCodeComponent';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import { generateVCode } from '../utils/delegation.utility';
import DropDownPartyMenuItem from '../component/Party/DropDownParty';
import { Party } from '../models/party';
import { TrackEventType } from '../utils/events';
import { trackEventByType } from '../utils/mixpanel';
import { NewDelegationFormProps } from '../models/Deleghe';
import { getConfiguration } from '../services/configuration.service';

const renderOption = (props: any, option: Party) => (
  <MenuItem {...props} value={option.id} key={option.id}>
    <DropDownPartyMenuItem name={option.name} />
  </MenuItem>
);

const getOptionLabel = (option: Party) => option.name || '';

const getError = (fieldTouched: boolean | undefined, fieldError: string | undefined) =>
  fieldTouched && fieldError;

const NuovaDelega = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { entities, created } = useAppSelector((state: RootState) => state.newDelegationState);
  const handleSearchStringChangeInput = useSearchStringChangeInput();
  const [senderInputValue, setSenderInputValue] = useState('');
  const { DELEGATIONS_TO_PG_ENABLED } = getConfiguration();

  const handleSubmit = (values: NewDelegationFormProps) => {
    void dispatch(createDelegation(values));
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_ACTION);
  };

  const handleDelegationsClick = () => {
    navigate(routes.DELEGHE);
  };

  // Get tomorrow date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const initialValues = {
    selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
    codiceFiscale: '',
    nome: '',
    cognome: '',
    ragioneSociale: '',
    selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
    expirationDate: tomorrow,
    enti: [],
    verificationCode: generateVCode(),
  };

  const validationSchema = yup.object({
    selectPersonaFisicaOrPersonaGiuridica: yup
      .string()
      .required(t('nuovaDelega.validation.email.required')),
    codiceFiscale: yup
      .string()
      .required(t('nuovaDelega.validation.fiscalCode.required'))
      .when('selectPersonaFisicaOrPersonaGiuridica', {
        is: (val: string) => val === RecipientType.PF,
        then: yup
          .string()
          .matches(dataRegex.fiscalCode, t('nuovaDelega.validation.fiscalCode.wrong')),
        otherwise: yup
          .string()
          .matches(dataRegex.pIvaAndFiscalCode, t('nuovaDelega.validation.fiscalCode.wrong')),
      }),
    nome: yup.string().when('selectPersonaFisicaOrPersonaGiuridica', {
      is: RecipientType.PF,
      then: yup.string().required(t('nuovaDelega.validation.name.required')),
    }),
    cognome: yup.string().when('selectPersonaFisicaOrPersonaGiuridica', {
      is: RecipientType.PF,
      then: yup.string().required(t('nuovaDelega.validation.surname.required')),
    }),
    ragioneSociale: yup.string().when('selectPersonaFisicaOrPersonaGiuridica', {
      is: RecipientType.PG,
      then: yup.string().required(t('nuovaDelega.validation.businessName.required')),
    }),
    enti: yup.array().required(),
    expirationDate: yup
      .mixed()
      .required(t('nuovaDelega.validation.expirationDate.required'))
      .test(
        'validDate',
        t('nuovaDelega.validation.expirationDate.wrong'),
        (value) => value?.getTime() >= tomorrow.getTime()
      ),
  });

  useEffect(() => {
    dispatch(resetNewDelegation());
  }, []);

  const deleteInput = (
    funField: (field: string, setValue: any, validation: boolean | undefined) => void,
    funTouched: (field: string, setValue: boolean, validation: boolean) => void
  ) => {
    funField('nome', initialValues.nome, false);
    funField('cognome', initialValues.cognome, false);
    funField('ragioneSociale', initialValues.ragioneSociale, false);
    funTouched('nome', false, false);
    funTouched('cognome', false, true);
    funTouched('ragioneSociale', false, true);
  };

  useEffect(() => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllEntities({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0 && loadAllEntities) {
      void dispatch(getAllEntities({ blockLoading: true }));
    }
  }, [senderInputValue]);

  const [loadAllEntities, setLoadAllEntities] = useState(false);

  useEffect(() => {
    if (loadAllEntities) {
      void dispatch(getAllEntities({}));
    }
  }, [loadAllEntities]);

  const handleGetAllEntities = () => {
    if (!loadAllEntities) {
      setLoadAllEntities(true);
    }
  };

  // handling of search string for sender
  const entitySearchLabel = (searchString: string): string =>
    `${t('nuovaDelega.form.selectEntities')}${searchStringLimitReachedText(searchString)}`;
  const handleChangeInput = (newInputValue: string) =>
    handleSearchStringChangeInput(newInputValue, setSenderInputValue);

  const breadcrumbs = (
    <Fragment>
      <PnBreadcrumb
        linkRoute={routes.DELEGHE}
        linkLabel={
          <Fragment>
            <PeopleIcon sx={{ mr: 0.5 }} />
            {t('deleghe.title')}
          </Fragment>
        }
        currentLocationLabel={t('nuovaDelega.breadcrumb')}
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
    <LoadingPageWrapper isInitialized>
      {!created && (
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumbs}
          <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
            <Grid item lg={8} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && breadcrumbs}
              <Paper sx={{ padding: '24px', marginBottom: '20px' }}>
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
                  {({ values, setFieldValue, touched, errors, setFieldTouched }) => (
                    <Form>
                      <FormControl sx={{ width: '100%' }}>
                        <Stack direction={isMobile ? 'column' : 'row'}>
                          <Stack justifyContent="center">
                            <RadioGroup
                              aria-labelledby="radio-buttons-group-pf-pg"
                              defaultValue={RecipientType.PF}
                              name="selectPersonaFisicaOrPersonaGiuridica"
                              value={values.selectPersonaFisicaOrPersonaGiuridica.toString()}
                              onChange={(event) => {
                                setFieldValue(
                                  'selectPersonaFisicaOrPersonaGiuridica',
                                  event.currentTarget.value
                                );
                              }}
                            >
                              <FormControlLabel
                                onClick={() => deleteInput(setFieldValue, setFieldTouched)}
                                value={RecipientType.PF}
                                control={<Radio />}
                                name={'selectPersonaFisicaOrPersonaGiuridica'}
                                label={t('nuovaDelega.form.naturalPerson')}
                                data-testid="selectPF"
                              />
                              <FormControlLabel
                                onClick={() => deleteInput(setFieldValue, setFieldTouched)}
                                value={RecipientType.PG}
                                control={<Radio />}
                                name={'selectPersonaFisicaOrPersonaGiuridica'}
                                label={t('nuovaDelega.form.legalPerson')}
                                disabled={!DELEGATIONS_TO_PG_ENABLED}
                                data-testid="selectPG"
                              />
                            </RadioGroup>
                          </Stack>
                          <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            direction={isMobile ? 'column' : 'row'}
                            spacing={1}
                            flex="1 0 100px"
                          >
                            {values.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF && (
                              <TextField
                                sx={{ margin: 'auto' }}
                                id="nome"
                                value={values.nome.toString()}
                                onChange={(event) => {
                                  setFieldValue('nome', event.currentTarget.value);
                                }}
                                label={t('nuovaDelega.form.firstName')}
                                name="nome"
                                error={Boolean(getError(touched.nome, errors.nome))}
                                helperText={getError(touched.nome, errors.nome)}
                                fullWidth
                              />
                            )}

                            {values.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF && (
                              <TextField
                                sx={{ margin: 'auto' }}
                                id="cognome"
                                value={values.cognome.toString()}
                                onChange={(event) => {
                                  setFieldValue('cognome', event.currentTarget.value);
                                }}
                                label={t('nuovaDelega.form.lastName')}
                                name="cognome"
                                error={Boolean(getError(touched.cognome, errors.cognome))}
                                helperText={getError(touched.cognome, errors.cognome)}
                                fullWidth
                              />
                            )}
                            {values.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PG && (
                              <TextField
                                sx={{ margin: 'auto' }}
                                id="ragioneSociale"
                                value={values.ragioneSociale.toString()}
                                onChange={(event) => {
                                  setFieldValue('ragioneSociale', event.currentTarget.value);
                                }}
                                label={t('nuovaDelega.form.businessName')}
                                name="ragioneSociale"
                                error={Boolean(
                                  getError(touched.ragioneSociale, errors.ragioneSociale)
                                )}
                                helperText={getError(touched.ragioneSociale, errors.ragioneSociale)}
                                fullWidth
                              />
                            )}
                          </Stack>
                        </Stack>
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
                        <Stack>
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
                              if (event.currentTarget.value === 'entiSelezionati') {
                                handleGetAllEntities();
                              }
                            }}
                          >
                            <FormControlLabel
                              value="tuttiGliEnti"
                              control={<Radio />}
                              name={'selectTuttiEntiOrSelezionati'}
                              label={t('nuovaDelega.form.allEntities')}
                            />

                            <FormControlLabel
                              value="entiSelezionati"
                              control={<Radio />}
                              data-testid="radioSelectedEntities"
                              name={'selectTuttiEntiOrSelezionati'}
                              label={t('nuovaDelega.form.onlySelected')}
                            />

                            {values.selectTuttiEntiOrSelezionati === 'entiSelezionati' && (
                              <FormControl fullWidth>
                                <Autocomplete
                                  id="enti-select"
                                  data-testid="enti-select"
                                  multiple
                                  options={entities}
                                  fullWidth
                                  autoComplete
                                  getOptionLabel={getOptionLabel}
                                  noOptionsText={t('nuovaDelega.form.party-not-found')}
                                  isOptionEqualToValue={(option, value) =>
                                    option.name === value.name
                                  }
                                  onChange={(_event: any, newValue: Array<Party>) => {
                                    setFieldValue('enti', newValue);
                                  }}
                                  inputValue={senderInputValue}
                                  onInputChange={(_event, newInputValue) =>
                                    handleChangeInput(newInputValue)
                                  }
                                  filterOptions={(e) => e}
                                  renderOption={renderOption}
                                  renderInput={(params) => (
                                    <TextField
                                      name="enti-select"
                                      {...params}
                                      label={entitySearchLabel(senderInputValue)}
                                    />
                                  )}
                                />
                              </FormControl>
                            )}
                          </RadioGroup>
                        </Stack>
                      </FormControl>
                      <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <Typography
                          fontWeight="bold"
                          marginBottom={2}
                        >
                          {t("nuovaDelega.form.date-duration")}
                        </Typography>
                        <FormControl fullWidth>
                          <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            adapterLocale={currentLocale}
                          >
                            <CustomDatePicker
                              label={t('nuovaDelega.form.endDate')}
                              inputFormat={DATE_FORMAT}
                              value={new Date(values.expirationDate)}
                              minDate={tomorrow}
                              onChange={(value: DatePickerTypes) => {
                                setFieldTouched('expirationDate', true, false);
                                setFieldValue('expirationDate', value);
                              }}
                              shouldDisableDate={isToday}
                              renderInput={(params) => (
                                <TextField
                                  id="expirationDate"
                                  name="expirationDate"
                                  data-testid="expirationDate"
                                  {...params}
                                  aria-label="Data termine delega" // aria-label for (TextField + Button) Group
                                  inputProps={{
                                    ...params.inputProps,
                                    inputMode: 'text',
                                    'aria-label': 'Inserisci la data di termine della delega',
                                    type: 'text',
                                  }}
                                  error={touched.expirationDate && Boolean(errors.expirationDate)}
                                  helperText={touched.expirationDate && errors.expirationDate}
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
                      <Stack
                        sx={{ mt: '1rem' }}
                        alignItems="flex-start"
                        justifyContent={'flex-start'}
                      >
                        <Stack>
                          <Button
                            sx={{ marginTop: '1rem', margin: 'auto' }}
                            type={'submit'}
                            variant={'contained'}
                            data-testid="createButton"
                          >
                            {t('nuovaDelega.form.submit')}
                          </Button>
                        </Stack>
                      </Stack>
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
          icon={<IllusCompleted />}
          title={t('nuovaDelega.createdTitle')}
          subtitle={t('nuovaDelega.createdDescription')}
          onClick={handleDelegationsClick}
          onClickLabel={t('nuovaDelega.backToDelegations')}
        />
      )}
    </LoadingPageWrapper>
  );
};

export default NuovaDelega;
