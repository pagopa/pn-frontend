import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import PeopleIcon from '@mui/icons-material/People';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CourtesyPage,
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  EventCreatedDelegationType,
  PnAutocomplete,
  PnBreadcrumb,
  RecipientType,
  TitleBox,
  dataRegex,
  isToday,
  searchStringLimitReachedText,
  useIsMobile,
  useSearchStringChangeInput,
} from '@pagopa-pn/pn-commons';
import { IllusCompleted } from '@pagopa/mui-italia';

import VerificationCodeComponent from '../components/Deleghe/VerificationCodeComponent';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import DropDownPartyMenuItem from '../components/Party/DropDownParty';
import { PFEventsType } from '../models/PFEventsType';
import { Party } from '../models/party';
import * as routes from '../navigation/routes.const';
import { NewDelegationFormProps } from '../redux/delegation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createDelegation, getAllEntities } from '../redux/newDelegation/actions';
import { resetNewDelegation } from '../redux/newDelegation/reducers';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';
import { generateVCode } from '../utility/delegation.utility';

const getError = <TTouch, TError>(
  fieldTouched: FormikTouched<TTouch> | boolean | undefined,
  fieldError: undefined | string | FormikErrors<TError> | Array<string>
) => Boolean(fieldTouched) && fieldError && String(fieldError);

const NuovaDelega = () => {
  const { t, i18n } = useTranslation(['deleghe', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { entities, created } = useAppSelector((state: RootState) => state.newDelegationState);
  const handleSearchStringChangeInput = useSearchStringChangeInput();
  const [senderInputValue, setSenderInputValue] = useState('');
  const [createdDelegation, setCreatedDelegation] = useState<
    EventCreatedDelegationType | undefined
  >(undefined);

  useEffect(() => {
    if (createdDelegation && created) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_MANDATE_UX_SUCCESS,
        createdDelegation
      );
    }
  }, [createdDelegation, created]);

  const handleSubmit = (values: NewDelegationFormProps) => {
    setCreatedDelegation({
      person_type: values.selectPersonaFisicaOrPersonaGiuridica,
      mandate_type:
        values.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? 'all' : 'selected_party',
    });

    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_MANDATE_UX_CONVERSION, {
      selectPersonaFisicaOrPersonaGiuridica: values.selectPersonaFisicaOrPersonaGiuridica,
      selectTuttiEntiOrSelezionati: values.selectTuttiEntiOrSelezionati,
    });
    void dispatch(createDelegation(values));
  };
  const handleDelegationsClick = () => {
    navigate(routes.DELEGHE);
  };
  const { DELEGATIONS_TO_PG_ENABLED } = getConfiguration();
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
      .required(t('required-field', { ns: 'common' })),
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
          .matches(dataRegex.pIva, t('nuovaDelega.validation.fiscalCode.wrong-pg')),
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
    enti: yup.array().when('selectTuttiEntiOrSelezionati', {
      is: 'entiSelezionati',
      then: yup.array().min(1, t('nuovaDelega.validation.entiSelected.required')),
    }),
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
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_MANDATE_DATA_INPUT);
  }, []);

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

  const renderOption = (props: any, option: Party) => (
    <MenuItem {...props} value={option.id} key={option.id}>
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  // handling of search string for sender
  const entitySearchLabel = (searchString: string): string =>
    `${t('nuovaDelega.form.selectEntities')}${searchStringLimitReachedText(searchString)}`;
  const handleChangeInput = (newInputValue: string) =>
    handleSearchStringChangeInput(newInputValue, setSenderInputValue);

  const getOptionLabel = (option: Party) => option.name || '';

  const handleGoBackAction = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_MANDATE_BACK);
    navigate(routes.DELEGHE);
  };

  const breadcrumbs = (
    <Fragment>
      <PnBreadcrumb
        goBackAction={handleGoBackAction}
        linkRoute={routes.DELEGHE}
        linkLabel={
          <Fragment>
            <PeopleIcon sx={{ mr: 0.5 }} />
            {t('nuovaDelega.title')}
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
              <Paper sx={{ padding: '24px', marginBottom: '20px' }} elevation={0}>
                <Typography sx={{ fontWeight: 'bold' }} id="personType">
                  {t('nuovaDelega.form.personType')}
                </Typography>
                <Typography variant="body2" fontSize={'14px'} marginTop={1} marginBottom={1}>
                  {t('nuovaDelega.form.personType-content-subtitle')}
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
                              defaultValue={RecipientType.PF}
                              name="selectPersonaFisicaOrPersonaGiuridica"
                              value={values.selectPersonaFisicaOrPersonaGiuridica.toString()}
                              onChange={(event) => {
                                setFieldValue(
                                  'selectPersonaFisicaOrPersonaGiuridica',
                                  event.currentTarget.value
                                );
                              }}
                              aria-labelledby="personType"
                            >
                              <FormControlLabel
                                id="recipient-pf"
                                onClick={() => deleteInput(setFieldValue, setFieldTouched)}
                                value={RecipientType.PF}
                                control={<Radio id="select-pf-radio" />}
                                name={'selectPersonaFisicaOrPersonaGiuridica'}
                                label={t('nuovaDelega.form.naturalPerson')}
                                data-testid="recipientType"
                              />
                              <FormControlLabel
                                id="recipent-pg"
                                onClick={() => deleteInput(setFieldValue, setFieldTouched)}
                                value={RecipientType.PG}
                                control={<Radio id="select-pg-radio" />}
                                name={'selectPersonaFisicaOrPersonaGiuridica'}
                                label={t('nuovaDelega.form.legalPerson')}
                                disabled={!DELEGATIONS_TO_PG_ENABLED}
                                data-testid="recipientType"
                              />
                            </RadioGroup>
                          </Stack>
                          <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            direction={isMobile ? 'column' : 'row'}
                            spacing={1}
                            flex="1 0"
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
                        sx={{ marginTop: isMobile ? 1 : 4 }}
                        id="codiceFiscale"
                        value={values.codiceFiscale.toString()}
                        onChange={(event) => {
                          setFieldValue('codiceFiscale', event.currentTarget.value.toUpperCase());
                        }}
                        label={t('nuovaDelega.form.fiscalCode')}
                        name="codiceFiscale"
                        error={Boolean(getError(touched.codiceFiscale, errors.codiceFiscale))}
                        helperText={getError(touched.codiceFiscale, errors.codiceFiscale)}
                        fullWidth
                      />
                      <Typography
                        fontWeight={'bold'}
                        sx={{ marginTop: '2rem' }}
                        id="selectEntities"
                      >
                        {t('nuovaDelega.form.viewFrom')}
                      </Typography>
                      <Typography variant="body2" fontSize={'14px'} marginTop={1} marginBottom={1}>
                        {t('nuovaDelega.form.viewFrom-content-subtitle')}
                      </Typography>
                      <FormControl sx={{ width: '100%' }}>
                        <Stack>
                          <RadioGroup
                            id="radio-buttons-group-enti"
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
                            aria-labelledby="selectEntities"
                          >
                            <FormControlLabel
                              id="tutti-gli-enti-selezionati"
                              value="tuttiGliEnti"
                              control={<Radio />}
                              name={'selectTuttiEntiOrSelezionati'}
                              label={t('nuovaDelega.form.allEntities')}
                              data-testid="radioSelectedEntities"
                            />

                            <FormControlLabel
                              id="enti-selezionati"
                              value="entiSelezionati"
                              control={<Radio />}
                              data-testid="radioSelectedEntities"
                              name={'selectTuttiEntiOrSelezionati'}
                              label={t('nuovaDelega.form.onlySelected')}
                            />

                            {values.selectTuttiEntiOrSelezionati === 'entiSelezionati' && (
                              <FormControl fullWidth>
                                <PnAutocomplete
                                  id="enti"
                                  data-testid="enti"
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
                                      name="enti"
                                      {...params}
                                      label={entitySearchLabel(senderInputValue)}
                                      error={Boolean(getError(touched.enti, errors.enti))}
                                      helperText={getError(touched.enti, errors.enti)}
                                    />
                                  )}
                                />
                              </FormControl>
                            )}
                          </RadioGroup>
                        </Stack>
                      </FormControl>
                      <br />
                      <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <Typography fontWeight="bold" marginBottom={2}>
                          {t('nuovaDelega.form.date-duration')}
                        </Typography>
                        <FormControl fullWidth>
                          <CustomDatePicker
                            language={i18n.language}
                            label={t('nuovaDelega.form.endDate')}
                            format={DATE_FORMAT}
                            value={values.expirationDate && new Date(values.expirationDate)}
                            minDate={tomorrow}
                            onChange={(value: DatePickerTypes) => {
                              setFieldTouched('expirationDate', true, false);
                              setFieldValue('expirationDate', value);
                            }}
                            shouldDisableDate={isToday}
                            slotProps={{
                              textField: {
                                id: 'expirationDate',
                                name: 'expirationDate',
                                inputProps: {
                                  inputMode: 'text',
                                  'aria-label': t('nuovaDelega.form.endDate-input-aria-label'),
                                  type: 'text',
                                },
                                error: Boolean(
                                  getError(touched.expirationDate, errors.expirationDate)
                                ),
                                helperText: getError(touched.expirationDate, errors.expirationDate),
                              },
                            }}
                            disablePast={true}
                          />
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
                            id="create-button"
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
