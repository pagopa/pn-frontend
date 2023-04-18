import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, FormikState, FormikTouched, FormikValues } from 'formik';
import currentLocale from 'date-fns/locale/it';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ListItemText, MenuItem, TextField } from '@mui/material';
import {
  CustomDatePicker,
  DatePickerTypes,
  DATE_FORMAT,
  formatIun,
  getNotificationAllowedStatus,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';

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

  const handleChangeTouched = async (e: ChangeEvent) => {
    if (e.target.id === 'iunMatch') {
      const originalEvent = e.target as HTMLInputElement;
      const cursorPosition = originalEvent.selectionStart || 0;
      const newInput = formatIun(originalEvent.value);
      const newCursorPosition =
        cursorPosition +
        (originalEvent.value.length !== newInput?.length &&
        cursorPosition >= originalEvent.value.length
          ? 1
          : 0);

      await formikInstance.setFieldValue('iunMatch', newInput);

      originalEvent.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      formikInstance.handleChange(e);
    }
    trackEventByType(TrackEventType.NOTIFICATION_FILTER_TYPE, { target: e.target.id });
    await formikInstance.setFieldTouched(e.target.id, true, false);
  };

  const handleChangeNotificationStatus = (e: ChangeEvent) => {
    formikInstance.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_FILTER_NOTIFICATION_STATE);
  };

  return (
    <Fragment>
      <TextField
        id="recipientId"
        value={formikInstance.values.recipientId}
        onChange={handleChangeTouched}
        label={t('filters.fiscal-code-tax-code')}
        name="recipientId"
        error={formikInstance.touched.recipientId && Boolean(formikInstance.errors.recipientId)}
        helperText={formikInstance.touched.recipientId && formikInstance.errors.recipientId}
        size="small"
        fullWidth={isMobile}
        sx={{ marginBottom: isMobile ? '20px' : '0' }}
      />
      <TextField
        id="iunMatch"
        value={formikInstance.values.iunMatch}
        onChange={handleChangeTouched}
        label={t('filters.iun')}
        name="iunMatch"
        error={formikInstance.touched.iunMatch && Boolean(formikInstance.errors.iunMatch)}
        helperText={formikInstance.touched.iunMatch && formikInstance.errors.iunMatch}
        size="small"
        fullWidth={isMobile}
        sx={{ marginBottom: isMobile ? '20px' : '0' }}
        inputProps={{ maxLength: 25 }}
      />
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
            const value2 = value || tenYearsAgo;
            void formikInstance.setFieldValue('startDate', value2).then(() => {
              setStartDate(value2);
              trackEventByType(TrackEventType.NOTIFICATION_FILTER_DATE, { source: 'from date' });
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
          minDate={tenYearsAgo}
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
            const value2 = value || today;
            void formikInstance.setFieldValue('endDate', value2).then(() => {
              trackEventByType(TrackEventType.NOTIFICATION_FILTER_DATE, { source: 'to date' });
              setEndDate(value2);
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
          minDate={startDate ? startDate : tenYearsAgo}
        />
      </LocalizationProvider>
      <TextField
        id="status"
        data-testid="notificationStatus"
        name="status"
        label={t('filters.status')}
        select
        onChange={handleChangeNotificationStatus}
        value={formikInstance.values.status}
        size="small"
        fullWidth={isMobile}
        sx={{
          marginBottom: isMobile ? '20px' : '0',
          '& .MuiInputBase-root': {
            pr: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {localizedNotificationStatus.map((status) => (
          <MenuItem key={status.value} value={status.value}>
            <ListItemText>{status.label}</ListItemText>
          </MenuItem>
        ))}
      </TextField>
    </Fragment>
  );
};

export default FilterNotificationsFormBody;
