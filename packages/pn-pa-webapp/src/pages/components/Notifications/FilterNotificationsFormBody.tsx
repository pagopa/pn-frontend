import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, FormikState, FormikTouched, FormikValues } from 'formik';
import currentLocale from 'date-fns/locale/it';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MenuItem, TextField } from '@mui/material';
import {
  CustomDatePicker,
  DatePickerTypes,
  DATE_FORMAT,
  formatIun,
  getNotificationAllowedStatus,
  useIsMobile,
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
    resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
  };
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
};

const searchForValues = [
  { value: '0', label: 'Codice Fiscale' },
  { value: '1', label: 'Codice IUN' },
];

const localizedNotificationStatus = getNotificationAllowedStatus();

const FilterNotificationsFormBody = ({
  formikInstance,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['notifiche']);

  const searchForHandleChange = (e: ChangeEvent) => {
    const value = (e.target as any).value;
    if (value === '0') {
      formikInstance.resetForm({
        values: { ...formikInstance.values, iunMatch: '', searchFor: '0' },
      });
    } else if (value === '1') {
      formikInstance.resetForm({
        values: { ...formikInstance.values, recipientId: '', searchFor: '1' },
      });
    }
  };

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
      <TextField
        id="searchFor"
        label={t('filters.search-for')}
        name="searchFor"
        value={formikInstance.values.searchFor}
        onChange={searchForHandleChange}
        select
        size="small"
        fullWidth={isMobile}
        sx={{ marginBottom: isMobile ? '20px' : '0' }}
      >
        {searchForValues.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {formikInstance.values.searchFor === '' || formikInstance.values.searchFor === '0' ? (
        <TextField
          id="recipientId"
          value={formikInstance.values.recipientId}
          onChange={handleChangeTouched}
          label={t('filters.fiscal-code')}
          name="recipientId"
          error={formikInstance.touched.recipientId && Boolean(formikInstance.errors.recipientId)}
          helperText={formikInstance.touched.recipientId && formikInstance.errors.recipientId}
          disabled={!formikInstance.values.searchFor}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
      ) : (
        <TextField
          id="iunMatch"
          value={formikInstance.values.iunMatch}
          onChange={handleChangeTouched}
          label={t('filters.iun')}
          name="iunMatch"
          error={formikInstance.touched.iunMatch && Boolean(formikInstance.errors.iunMatch)}
          helperText={formikInstance.touched.iunMatch && formikInstance.errors.iunMatch}
          disabled={!formikInstance.values.searchFor}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
      )}
      <LocalizationProvider
        id="startDate"
        name="startDate"
        dateAdapter={AdapterDateFns}
        adapterLocale={currentLocale}
      >
        <CustomDatePicker
          label={t('filters.data_da')}
          inputFormat={DATE_FORMAT}
          value={startDate}
          onChange={(value: DatePickerTypes) => {
            void formikInstance.setFieldValue('startDate', value).then(() => {
              setStartDate(value);
            });
          }}
          renderInput={(params) => (
            <TextField
              id="startDate"
              name="startDate"
              size="small"
              {...params}
              aria-label={t('filters.data_da-aria-label')} // aria-label for (TextField + Button) Group
              inputProps={{
                ...params.inputProps,
                inputMode: 'text',
                'aria-label': t('filters.data_da-input-aria-label'),
                type: 'text',
                placeholder: 'gg/mm/aaaa',
              }}
              fullWidth={isMobile}
              sx={{ marginBottom: isMobile ? '20px' : '0' }}
            />
          )}
          disableFuture={true}
          maxDate={endDate ? endDate : undefined}
        />
      </LocalizationProvider>
      <LocalizationProvider
        id="endDate"
        name="endDate"
        dateAdapter={AdapterDateFns}
        onChange={formikInstance.handleChange}
        adapterLocale={currentLocale}
      >
        <CustomDatePicker
          label={t('filters.data_a')}
          inputFormat={DATE_FORMAT}
          value={endDate}
          onChange={(value: DatePickerTypes) => {
            void formikInstance.setFieldValue('endDate', value).then(() => {
              setEndDate(value);
            });
          }}
          renderInput={(params) => (
            <TextField
              id="endDate"
              name="endDate"
              size="small"
              {...params}
              aria-label={t('filters.data_a-aria-label')} // aria-label for (TextField + Button) Group
              inputProps={{
                ...params.inputProps,
                inputMode: 'text',
                'aria-label': t('filters.data_a-input-aria-label'),
                type: 'text',
                placeholder: 'gg/mm/aaaa',
              }}
              fullWidth={isMobile}
              sx={{ marginBottom: isMobile ? '20px' : '0' }}
            />
          )}
          disableFuture={true}
          minDate={startDate ? startDate : undefined}
        />
      </LocalizationProvider>
      <TextField
        id="status"
        name="status"
        label={t('filters.status')}
        select
        onChange={formikInstance.handleChange}
        value={formikInstance.values.status}
        size="small"
        fullWidth={isMobile}
        sx={{ marginBottom: isMobile ? '20px' : '0' }}
      >
        {localizedNotificationStatus.map((status) => (
          <MenuItem key={status.value} value={status.value}>
            {status.label}
          </MenuItem>
        ))}
      </TextField>
    </Fragment>
  );
};

export default FilterNotificationsFormBody;
