import { SubmitHandler, useForm, Controller } from "react-hook-form";
import {
  Box, Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { CustomDatePicker, dataRegex, DATE_FORMAT, today, useIsMobile } from "@pagopa-pn/pn-commons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import currentLocale from "date-fns/locale/it";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { NewDelegationFormProps } from "../../redux/delegation/types";
import { createDelegation, getAllEntities } from "../../redux/newDelegation/actions";
import { trackEventByType } from "../../utils/mixpanel";
import { TrackEventType } from "../../utils/events";
import DropDownPartyMenuItem from "../Party/DropDownParty";
import VerificationCodeComponent from "../Deleghe/VerificationCodeComponent";
import { generateVCode } from "../../utils/delegation.utility";
import ErrorDeleghe from "../Deleghe/ErrorDeleghe";

const NewDelegationForm = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const isMobile = useIsMobile();
  const widthValue = isMobile ? 12 : 4;
  const { entities } = useAppSelector((state: RootState) => state.newDelegationState);
  const dispatch = useAppDispatch();

  const isToday = (date: Date | null): boolean => (
    date?.getDate() === today.getDate() &&
    date?.getMonth() === today.getMonth() &&
    date?.getFullYear() === today.getFullYear()
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const validationSchema = yup.object({
    selectPersonaFisicaOrPersonaGiuridica: yup
      .string()
      .required(t('nuovaDelega.validation.email.required')),
    codiceFiscale: yup
      .string()
      .required(t('nuovaDelega.validation.fiscalCode.required'))
      .matches(dataRegex.fiscalCode, t('nuovaDelega.validation.fiscalCode.wrong')),
    nome: yup.string().required(t('nuovaDelega.validation.name.required')),
    cognome: yup.string().required(t('nuovaDelega.validation.surname.required')),
    enteSelect: yup.object({ name: yup.string(), uniqueIdentifier: yup.string() }).required(),
    expirationDate: yup
      .mixed()
      .required(t('nuovaDelega.validation.expirationDate.required'))
      .test('validDate', t('nuovaDelega.validation.expirationDate.wrong'), value => value?.getTime() >= tomorrow.getTime())
  });

  const {
    getValues,
    setValue,
    register,
    control,
    handleSubmit,
  } = useForm<NewDelegationFormProps>({
    defaultValues: {
      selectPersonaFisicaOrPersonaGiuridica: 'pf',
      codiceFiscale: '',
      nome: '',
      cognome: '',
      selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
      expirationDate: tomorrow,
      enteSelect: {
        name: '',
        uniqueIdentifier: '',
      },
      verificationCode: generateVCode(),
    },
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  console.log(getValues());

  const [loadAllEntities, setLoadAllEntities] = useState(false);

  const onSubmit: SubmitHandler<NewDelegationFormProps> = (values) => {
    void dispatch(createDelegation(values));
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_ACTION);
  };

  const handleGetAllEntities = () => {
    if(!loadAllEntities) {
      setLoadAllEntities(true);
    }
  };

  useEffect(() => {
    if (loadAllEntities) {
      void dispatch(getAllEntities());
    }
  }, [loadAllEntities]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl sx={{ width: '100%' }}>
        <RadioGroup
          aria-labelledby="radio-buttons-group-pf-pg"
          defaultValue="pf"
          {...register("selectPersonaFisicaOrPersonaGiuridica")}
        >
          <Grid
            container
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              direction: {
                xs: 'column',
                lg: 'row'
              },
            }}
          >
            <Grid item xs={isMobile ? 12 : 3}>
              <FormControlLabel
                value="pf"
                control={<Radio />}
                name={'selectPersonaFisicaOrPersonaGiuridica'}
                label={t('nuovaDelega.form.naturalPerson')}
              />
            </Grid>
            <Grid
              item
              xs={widthValue}
              sx={{
                m: {
                  xs: 0,
                  lg: null,
                }
              }}
            >
              <Controller
                name="nome"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    sx={{ margin: 'auto' }}
                    id="nome"
                    type="text"
                    label={t('nuovaDelega.form.firstName')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={widthValue}
              sx={{
                  m: {
                    xs: 0,
                    lg: null,
                  }
              }}
            >
              <Controller
                name="cognome"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    sx={{ margin: 'auto' }}
                    id="cognome"
                    type="text"
                    label={t('nuovaDelega.form.lastName')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            value="pg"
            control={<Radio />}
            name={'selectPersonaFisicaOrPersonaGiuridica'}
            label={t('nuovaDelega.form.legalPerson')}
            disabled
          />
        </RadioGroup>
      </FormControl>
      <Controller
        name="codiceFiscale"
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <TextField
            sx={{ marginTop: 4 }}
            id="codiceFiscale"
            type="text"
            label={t('nuovaDelega.form.fiscalCode')}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            error={Boolean(error?.message)}
            helperText={error?.message}
            fullWidth
          />
        )}
      />
      <Typography sx={{ marginTop: 4, fontWeight: 'bold' }}>
        {t('nuovaDelega.form.viewFrom')}
      </Typography>
      <FormControl sx={{ width: '100%' }}>
        <RadioGroup
          aria-labelledby="radio-buttons-group-pf-pg"
          defaultValue="tuttiGliEnti"
          {...register("selectTuttiEntiOrSelezionati")}
          onChange={(event) => {
            if(event.currentTarget.value === 'entiSelezionati') {
              handleGetAllEntities();
            }
          }}
        >
          <FormControlLabel
            value="tuttiGliEnti"
            control={<Radio />}
            {...register("selectTuttiEntiOrSelezionati")}
            label={t('nuovaDelega.form.allEntities')}
          />
          <Grid
            container
            direction={{
              xs: "column", lg: "row"
            }}
          >
            <Grid item xs={isMobile ? 12 : 6}>
              <FormControlLabel
                value="entiSelezionati"
                control={<Radio />}
                data-testid="radioSelectedEntities"
                {...register("selectTuttiEntiOrSelezionati")}
                label={t('nuovaDelega.form.onlySelected')}
              />
            </Grid>
            <Grid item xs={isMobile ? 12 : 6} m={{ xs: 0, lg: null}}>
              {getValues("selectTuttiEntiOrSelezionati") === 'entiSelezionati' && (
                <FormControl fullWidth>
                  <InputLabel id="ente-select">{t('nuovaDelega.form.selectEntities')}</InputLabel>
                  <Controller
                    name="enteSelect"
                    control={control}
                    render={({
                      field: { value },
                    }) => (
                      <Select
                        labelId="ente-select"
                        id="ente-select"
                        {...register("enteSelect.uniqueIdentifier")}
                        value={value.uniqueIdentifier}
                        label={t('nuovaDelega.form.selectEntities')}
                        onChange={(event: SelectChangeEvent<string>) => {
                          setValue('enteSelect', {
                            name: event.target.name,
                            uniqueIdentifier: event.target.value,
                          });
                        }}
                      >
                       {entities && entities.map((entity) => (
                        <MenuItem value={entity.id ?? ''} key={entity.id ?? ''}>
                          <DropDownPartyMenuItem name={entity.name} />
                        </MenuItem>
                       ))}
                      </Select>
                      )}
                    />
                </FormControl>
              )}
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>
      <Box sx={{ marginTop: '1rem', width: '100%' }}>
        <FormControl fullWidth>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={currentLocale}
          >
            <Controller
              name="expirationDate"
              control={control}
              render={({field: { onChange, onBlur, value }, fieldState: { error }}) => (
              <CustomDatePicker
                label={t('nuovaDelega.form.endDate')}
                inputFormat={DATE_FORMAT}
                minDate={tomorrow}
                onChange={onChange}
                value={value}
                shouldDisableDate={isToday}
                renderInput={(params) => (
                  <TextField
                    id="expirationDate"
                    name="expirationDate"
                    {...params}
                    aria-label="Data termine delega" // aria-label for (TextField + Button) Group
                    inputProps={{
                      ...params.inputProps,
                      inputMode: 'text',
                      'aria-label': 'Inserisci la data di termine della delega',
                      type: 'text',
                    }}
                    onBlur={onBlur}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                  />
                )}
              />
            )}
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
        <VerificationCodeComponent code={getValues("verificationCode")} />
      </Stack>
      <Divider sx={{ marginTop: '1rem' }} />
      <Grid container sx={{ marginTop: '1rem' }}>
        <Grid item xs={12} sx={{ margin: 'auto' }}>
          <Button
            sx={{ marginTop: '1rem', margin: 'auto' }}
            type={'submit'}
            variant={'contained'}
            data-testid="createButton"
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
    </form>
  );
};

export default NewDelegationForm;
