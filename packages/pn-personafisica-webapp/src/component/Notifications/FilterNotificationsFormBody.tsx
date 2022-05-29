import currentLocale from 'date-fns/locale/it';
import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, TextFieldProps } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CustomDatePicker, DATE_FORMAT, useIsMobile } from '@pagopa-pn/pn-commons';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';

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

  const handleChangeTouched = (e: ChangeEvent) => {
    void formikInstance.setFieldTouched(e.target.id, true, false);
    formikInstance.handleChange(e);
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
        />
      </Grid>
      <Grid item lg={2} xs={12}>
        <LocalizationProvider
          id="startDate"
          name="startDate"
          value={formikInstance.values.startDate}
          dateAdapter={DateAdapter}
          locale={currentLocale}
        >
          <CustomDatePicker
            label={t('filters.data_da', { ns: 'notifiche' })}
            inputFormat={DATE_FORMAT}
            value={startDate}
            onChange={(value: Date | null) => {
              formikInstance
                .setFieldValue('startDate', value)
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
          value={formikInstance.values.endDate}
          dateAdapter={DateAdapter}
          onChange={formikInstance.handleChange}
          locale={currentLocale}
        >
          <CustomDatePicker
            label={t('filters.data_a', { ns: 'notifiche' })}
            inputFormat={DATE_FORMAT}
            value={endDate}
            onChange={(value: Date | null) => {
              formikInstance
                .setFieldValue('endDate', value)
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
