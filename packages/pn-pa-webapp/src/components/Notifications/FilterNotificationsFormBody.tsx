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

type FormikInst = Props['formikInstance'];

type DatePickerFieldProps = {
  language: string;
  label: string;
  id: 'startDate' | 'endDate';
  ariaLabel: string;
  isMobile: boolean;
  mb: string | number;
  value: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  formikInstance: FormikInst;
  setLocalDate: (value: Date | null) => void;
  errorMsg?: string;
};

const DatePickerField: React.FC<Readonly<DatePickerFieldProps>> = ({
  language,
  label,
  id,
  ariaLabel,
  isMobile,
  mb,
  value,
  minDate,
  maxDate,
  disableFuture,
  formikInstance,
  setLocalDate,
  errorMsg,
}) => (
  <CustomDatePicker
    language={language}
    label={label}
    format={DATE_FORMAT}
    value={value}
    onChange={(v: DatePickerTypes) => {
      void formikInstance.setFieldValue(id, v ?? null, false).then(() => {
        setLocalDate(v);
        if (errorMsg) {
          const errors = formikInstance.errors || {};
          if (errors.startDate === errorMsg || errors.endDate === errorMsg) {
            formikInstance.setErrors({ ...errors, startDate: undefined, endDate: undefined });
          }
        }
      });
    }}
    slotProps={{
      textField: {
        id,
        name: id,
        size: 'small',
        inputProps: {
          inputMode: 'text',
          type: 'text',
          'aria-label': ariaLabel,
        },
        fullWidth: isMobile,
        sx: { mb },
        ...(errorMsg ? { error: true, helperText: errorMsg } : {}),
      },
    }}
    disableFuture={disableFuture}
    minDate={minDate ?? undefined}
    maxDate={maxDate ?? undefined}
  />
);

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

  const mb = isMobile ? '20px' : 0;

  const rangeErrorMsg =
    t('filters.errors.max-six-months', { ns: 'notifiche' }) || 'Intervallo massimo: 6 mesi';

  const showRangeError =
    formikInstance.errors?.startDate === rangeErrorMsg ||
    formikInstance.errors?.endDate === rangeErrorMsg;

  const errorMsg = showRangeError ? rangeErrorMsg : undefined;

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
        sx={{ mb }}
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
        sx={{ mb }}
        inputProps={{ maxLength: 25 }}
      />

      <DatePickerField
        language={i18n.language}
        label={t('filters.data_da')}
        id="startDate"
        ariaLabel={t('filters.data_da-input-aria-label')}
        isMobile={isMobile}
        mb={mb}
        value={startDate}
        minDate={tenYearsAgo}
        maxDate={endDate ?? null}
        disableFuture={true}
        formikInstance={formikInstance}
        setLocalDate={setStartDate}
        errorMsg={errorMsg}
      />

      <DatePickerField
        language={i18n.language}
        label={t('filters.data_a')}
        id="endDate"
        ariaLabel={t('filters.data_a-input-aria-label')}
        isMobile={isMobile}
        mb={mb}
        value={endDate}
        minDate={startDate ?? tenYearsAgo}
        maxDate={null}
        disableFuture={true}
        formikInstance={formikInstance}
        setLocalDate={setEndDate}
        errorMsg={errorMsg}
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
          mb,
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
