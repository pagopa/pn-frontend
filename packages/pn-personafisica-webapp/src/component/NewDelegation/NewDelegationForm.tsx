import { SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
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
import { CustomDatePicker, DATE_FORMAT, DatePickerTypes, today, useIsMobile } from "@pagopa-pn/pn-commons";
import { useTranslation } from "react-i18next";
import {useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import currentLocale from "date-fns/locale/it";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { NewDelegationFormProps } from "../../redux/delegation/types";
import {createDelegation, getAllEntities} from "../../redux/newDelegation/actions";
import { trackEventByType } from "../../utils/mixpanel";
import { TrackEventType } from "../../utils/events";
import DropDownPartyMenuItem from "../Party/DropDownParty";
import VerificationCodeComponent from "../Deleghe/VerificationCodeComponent";
import {generateVCode} from "../../utils/delegation.utility";

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

  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors, touchedFields }
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
  }
  });

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

  console.log('entis', getValues("selectTuttiEntiOrSelezionati"));

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
              <TextField
                sx={{ margin: 'auto' }}
                id="nome"
                label={t('nuovaDelega.form.firstName')}
                {...register("nome")}
                error={touchedFields.nome && Boolean(errors.nome)}
                helperText={touchedFields.nome && errors.nome}
                fullWidth
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
              <TextField
                sx={{ margin: 'auto', mt: isMobile ? 1 : 0 }}
                id="cognome"
                {...register("cognome")}
                label={t('nuovaDelega.form.lastName')}
                error={touchedFields.cognome && Boolean(errors.cognome)}
                helperText={touchedFields.cognome && errors.cognome}
                fullWidth
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
      <TextField
        sx={{ marginTop: '2rem' }}
        id="codiceFiscale"
        {...register("codiceFiscale")}
        label={t('nuovaDelega.form.fiscalCode')}
        error={touchedFields.codiceFiscale && Boolean(errors.codiceFiscale)}
        helperText={touchedFields.codiceFiscale && errors.codiceFiscale}
        fullWidth
      />
      <Typography sx={{ marginTop: '2rem', fontWeight: 'bold' }}>
        {t('nuovaDelega.form.viewFrom')}
      </Typography>
      {/* <FormControl sx={{ width: '100%' }}>
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
                  <Select
                    labelId="ente-select"
                    id="ente-select"
                    {...register("enteSelect.uniqueIdentifier")}
                    label={t('nuovaDelega.form.selectEntities')}
                    onChange={(event: SelectChangeEvent<string>) => {
                      setValue('enteSelect', {
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
      </FormControl> */}
      <Box sx={{ marginTop: '1rem', width: '100%' }}>
        <FormControl fullWidth>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={currentLocale}
          >
            <CustomDatePicker
              label={t('nuovaDelega.form.endDate')}
              inputFormat={DATE_FORMAT}
              value={new Date(getValues("expirationDate"))}
              minDate={tomorrow}
              onChange={(value: DatePickerTypes) => {
                // setFieldTouched('expirationDate', true, false);
                // setFieldValue('expirationDate', value);
              }}
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
                  error={touchedFields.expirationDate && Boolean(errors.expirationDate)}
                  helperText={touchedFields.expirationDate && errors.expirationDate}
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
        <VerificationCodeComponent code={getValues("verificationCode")} />
      </Stack>
      <Divider sx={{ marginTop: '1rem' }} />
    </form>
  );
};

export default NewDelegationForm;