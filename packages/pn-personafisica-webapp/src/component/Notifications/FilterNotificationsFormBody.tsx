import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import currentLocale from 'date-fns/locale/it';
import { Grid, TextField, TextFieldProps } from '@mui/material';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  CustomDatePicker,
  DatePickerTypes,
  DATE_FORMAT,
  tenYearsAgo,
  today,
  useIsMobile,
  formatIun
} from '@pagopa-pn/pn-commons';

type Props = {
  formikInstance: {
    values: FormikValues;
    setFieldTouched: (
      field: string,
      touched?: boolean,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    handleChange: (e: ChangeEvent<any>) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
  };
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
};

const FilterNotificationsFormBody = ({
  formikInstance,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) => {
  const { t } = useTranslation(['notifiche']);
  const isMobile = useIsMobile();

  const handleChangeTouched = async (e: ChangeEvent) => {
    if (e.target.id === 'iunMatch') {
      const newInput = formatIun(formikInstance.values.iunMatch, (e.nativeEvent as any).data);
      if (newInput) {
        await formikInstance.setFieldValue('iunMatch', newInput);
      } else {
        formikInstance.handleChange(e);
      }
    } else {
      formikInstance.handleChange(e);
    }
    await formikInstance.setFieldTouched(e.target.id, true, false);
  };

  return (
    <Fragment>
      <Grid item lg xs={12}>
        <TextField
          id="iunMatch"
          value={formikInstance.values.iunMatch}
          onChange={handleChangeTouched}
          label={t('filters.iun', { ns: 'notifiche' })}
          name="iunMatch"
          error={formikInstance.touched.iunMatch && Boolean(formikInstance.errors.iunMatch)}
          helperText={formikInstance.touched.iunMatch && formikInstance.errors.iunMatch}
          fullWidth
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          size="small"
          inputProps={{ maxLength: 25 }}
        />
      </Grid>
      <Grid item lg={2} xs={12}>
        <LocalizationProvider
          id="startDate"
          name="startDate"
          dateAdapter={AdapterDateFns}
          adapterLocale={currentLocale}
        >
          <CustomDatePicker
            label={t('filters.data_da', { ns: 'notifiche' })}
            inputFormat={DATE_FORMAT}
            value={startDate}
            onChange={(value: DatePickerTypes) => {
              formikInstance
                .setFieldValue('startDate', value || tenYearsAgo)
                .then(() => {
                  setStartDate(value);
                })
                .catch(() => 'error');
            }}
            renderInput={(params) => (
              <TextField
                id="startDate"
                name="startDate"
                {...params}
                fullWidth
                sx={{ marginBottom: isMobile ? '20px' : '0' }}
                size="small"
                aria-label="Data inizio ricerca" // aria-label for (TextField + Button) Group
                inputProps={{
                  ...params.inputProps,
                  inputMode: 'text',
                  'aria-label': 'Inserisci la data iniziale della ricerca',
                  type: 'text',
                }}
              />
            )}
            disableFuture={true}
            maxDate={endDate ? endDate : undefined}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item lg={2} xs={12}>
        <LocalizationProvider
          id="endDate"
          name="endDate"
          dateAdapter={AdapterDateFns}
          adapterLocale={currentLocale}
        >
          <CustomDatePicker
            label={t('filters.data_a', { ns: 'notifiche' })}
            inputFormat={DATE_FORMAT}
            value={endDate}
            onChange={(value: DatePickerTypes) => {
              formikInstance
                .setFieldValue('endDate', value || today)
                .then(() => {
                  setEndDate(value);
                })
                .catch(() => 'error');
            }}
            renderInput={(params: TextFieldProps) => (
              <TextField
                id="endDate"
                name="endDate"
                {...params}
                fullWidth
                sx={{ marginBottom: isMobile ? '20px' : '0' }}
                size="small"
                aria-label="Data fine ricerca" // aria-label for (TextField + Button) Group
                inputProps={{
                  ...params.inputProps,
                  inputMode: 'text',
                  'aria-label': 'inserisci la data finale della ricerca',
                  type: 'text',
                }}
              />
            )}
            disableFuture={true}
            minDate={startDate ? startDate : undefined}
          />
        </LocalizationProvider>
      </Grid>
    </Fragment>
  );
};

export default FilterNotificationsFormBody;
