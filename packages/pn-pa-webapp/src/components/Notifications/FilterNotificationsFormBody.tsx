import { FormikErrors, FormikState, FormikTouched, FormikValues } from 'formik';
import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemText, MenuItem, TextField } from '@mui/material';
import {
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  formatIun,
  getNotificationAllowedStatus,
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
    resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void;
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
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation(['notifiche']);
  const localizedNotificationStatus = getNotificationAllowedStatus();
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

  const handleChangeNotificationStatus = async (e: ChangeEvent) => {
    await formikInstance.setFieldValue(
      (e.target as HTMLSelectElement).name,
      (e.target as HTMLSelectElement).value,
      false
    );
  };

  return (
    <Fragment>
      <TextField
        id="recipientId"
        value={formikInstance.values.recipientId}
        onChange={handleChangeTouched}
        onPaste={handlePaste}
        label={t('filters.fiscal-code-tax-code')}
        name="recipientId"
        error={formikInstance.touched.recipientId && Boolean(formikInstance.errors.recipientId)}
        helperText={
          formikInstance.touched.recipientId &&
          formikInstance.errors.recipientId &&
          String(formikInstance.errors.recipientId)
        }
        size="small"
        fullWidth={isMobile}
        sx={{ mb: isMobile ? '20px' : 0 }}
      />
      <TextField
        id="iunMatch"
        value={formikInstance.values.iunMatch}
        onChange={handleChangeTouched}
        onPaste={handlePaste}
        label={t('filters.iun')}
        name="iunMatch"
        error={formikInstance.touched.iunMatch && Boolean(formikInstance.errors.iunMatch)}
        helperText={
          formikInstance.touched.iunMatch &&
          formikInstance.errors.iunMatch &&
          String(formikInstance.errors.iunMatch)
        }
        size="small"
        fullWidth={isMobile}
        sx={{ mb: isMobile ? '20px' : 0 }}
        inputProps={{ maxLength: 25 }}
      />
      <CustomDatePicker
        language={i18n.language}
        label={t('filters.data_da')}
        format={DATE_FORMAT}
        value={startDate}
        onChange={(value: DatePickerTypes) => {
          void formikInstance.setFieldValue('startDate', value || tenYearsAgo).then(() => {
            setStartDate(value);
          });
        }}
        slotProps={{
          textField: {
            id: 'startDate',
            name: 'startDate',
            size: 'small',
            inputProps: {
              inputMode: 'text',
              type: 'text',
              'aria-label': t('filters.data_da-input-aria-label'),
            },
            fullWidth: isMobile,
            sx: { mb: isMobile ? '20px' : '0' },
          },
        }}
        disableFuture={true}
        minDate={tenYearsAgo}
        maxDate={endDate ?? undefined}
      />
      <CustomDatePicker
        language={i18n.language}
        label={t('filters.data_a')}
        format={DATE_FORMAT}
        value={endDate}
        onChange={(value: DatePickerTypes) => {
          void formikInstance.setFieldValue('endDate', value || today).then(() => {
            setEndDate(value);
          });
        }}
        slotProps={{
          textField: {
            id: 'endDate',
            name: 'endDate',
            size: 'small',
            inputProps: {
              inputMode: 'text',
              type: 'text',
              'aria-label': t('filters.data_a-input-aria-label'),
            },
            fullWidth: isMobile,
            sx: { mb: isMobile ? '20px' : 0 },
          },
        }}
        disableFuture={true}
        minDate={startDate ?? tenYearsAgo}
      />
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
          mb: isMobile ? '20px' : 0,
          '& .MuiInputBase-root': {
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
