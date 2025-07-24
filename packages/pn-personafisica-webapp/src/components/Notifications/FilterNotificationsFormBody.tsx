import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { FormHelperText, Grid, TextField } from '@mui/material';
import {
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  formatIun,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

type Props = {
  formikInstance: {
    values: FormikValues;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    handleChange: (e: ChangeEvent<any>) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
    setErrors: (errors: FormikErrors<FormikValues>) => void;
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
  const { t, i18n } = useTranslation(['notifiche']);
  const isMobile = useIsMobile();

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const trimmedValue = e.clipboardData.getData('text').trim();
    // eslint-disable-next-line functional/immutable-data
    (e.target as HTMLInputElement).value = trimmedValue;
    await formikInstance.setFieldValue((e.target as HTMLInputElement).id, trimmedValue, false);
  };

  const handleChangeTouched = async (e: ChangeEvent) => {
    if (formikInstance.errors) {
      formikInstance.setErrors({
        ...formikInstance.errors,
        [e.target.id]: undefined,
      });
    }

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

      await formikInstance.setFieldValue('iunMatch', newInput, false);

      originalEvent.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      await formikInstance.setFieldValue(e.target.id, (e.target as HTMLInputElement).value, false);
    }
  };

  return (
    <Fragment>
      <Grid item lg xs={12}>
        <TextField
          id="iunMatch"
          value={formikInstance.values.iunMatch}
          onChange={handleChangeTouched}
          onPaste={handlePaste}
          label={t('filters.iun', { ns: 'notifiche' })}
          name="iunMatch"
          error={formikInstance.touched.iunMatch && Boolean(formikInstance.errors.iunMatch)}
          helperText={
            formikInstance.touched.iunMatch &&
            formikInstance.errors.iunMatch && (
              <FormHelperText error aria-live="assertive">
                {String(formikInstance.errors.iunMatch)}
              </FormHelperText>
            )
          }
          fullWidth
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          size="small"
          inputProps={{ maxLength: 25 }}
        />
      </Grid>
      <Grid item lg={2} xs={12}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filters.data_da', { ns: 'notifiche' })}
          format={DATE_FORMAT}
          value={startDate}
          onChange={(value: DatePickerTypes) => {
            formikInstance
              .setFieldValue('startDate', value || tenYearsAgo)
              .then(() => {
                setStartDate(value);
              })
              .catch(() => 'error');
          }}
          slotProps={{
            textField: {
              id: 'startDate',
              name: 'startDate',
              fullWidth: true,
              sx: { marginBottom: isMobile ? '20px' : '0' },
              size: 'small',
              inputProps: {
                inputMode: 'text',
                'aria-label': t('filters.data_da-input-aria-label'),
                type: 'text',
                'data-testid': 'input(start date)',
              },
              helperText: (
                <FormHelperText sx={{ ml: 0 }} error aria-live="assertive" component="span">
                  {!!formikInstance.errors.startDate &&
                    t('filters.errors.data_a', { ns: 'notifiche' })}
                </FormHelperText>
              ),
            },
          }}
          disableFuture={true}
          minDate={tenYearsAgo}
          maxDate={endDate ?? undefined}
        />
      </Grid>
      <Grid item lg={2} xs={12}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filters.data_a', { ns: 'notifiche' })}
          format={DATE_FORMAT}
          value={endDate}
          onChange={(value: DatePickerTypes) => {
            formikInstance
              .setFieldValue('endDate', value || today)
              .then(() => {
                setEndDate(value);
              })
              .catch(() => 'error');
          }}
          slotProps={{
            textField: {
              id: 'endDate',
              name: 'endDate',
              fullWidth: true,
              sx: { marginBottom: isMobile ? '20px' : '0' },
              size: 'small',
              inputProps: {
                inputMode: 'text',
                'aria-label': t('filters.data_a-input-aria-label'),
                type: 'text',
                'data-testid': 'input(end date)',
              },
              helperText: (
                <FormHelperText sx={{ ml: 0 }} error aria-live="assertive" component="span">
                  {!!formikInstance.errors.endDate &&
                    t('filters.errors.data_a', { ns: 'notifiche' })}
                </FormHelperText>
              ),
            },
          }}
          disableFuture={true}
          minDate={startDate ?? tenYearsAgo}
        />
      </Grid>
    </Fragment>
  );
};

export default FilterNotificationsFormBody;
