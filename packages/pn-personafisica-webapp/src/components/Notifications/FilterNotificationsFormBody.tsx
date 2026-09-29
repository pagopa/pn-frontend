import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import {
  Box,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material';
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
  showCommunicationType: boolean;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterNotificationsFormBody = ({ formikInstance, showCommunicationType }: Props) => {
  const { t, i18n } = useTranslation(['notifiche']);
  const isMobile = useIsMobile();
  const communicationTypeLabels = {
    LEGAL: t('filters.communication-type-options.legal'),
    INFORMAL: t('filters.communication-type-options.informal'),
  };

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

  const communicationTypeIcon = () =>
    formikInstance.values.communicationType
      ? () => (
          <IconButton
            size="small"
            aria-label={t('button.clear-field', { ns: 'common' })}
            onClick={(e) => {
              e.stopPropagation();
              void formikInstance.setFieldValue('communicationType', '', false);
            }}
            sx={{
              pointerEvents: 'auto',
              position: 'absolute',
              right: 8,
            }}
          >
            <ClearRoundedIcon fontSize="small" />
          </IconButton>
        )
      : undefined;

  return (
    <Fragment>
      {showCommunicationType && (
        <Grid item lg xs={12}>
          <TextField
            id="communicationType"
            data-testid="communicationType"
            name="communicationType"
            label={t('filters.communication-type')}
            select
            value={formikInstance.values.communicationType}
            onChange={(e) => {
              void formikInstance.setFieldValue('communicationType', e.target.value, false);
            }}
            SelectProps={{
              renderValue: (value) =>
                value === 'LEGAL' ? (
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedRounded sx={{ color: 'primary.main', fontSize: '16px' }} />
                    {communicationTypeLabels.LEGAL}
                  </Box>
                ) : (
                  communicationTypeLabels[value as keyof typeof communicationTypeLabels] || ''
                ),
              IconComponent: communicationTypeIcon(),
            }}
            fullWidth
            sx={{ marginBottom: isMobile ? '20px' : '0' }}
            size="small"
          >
            <MenuItem value="LEGAL">
              <ListItemIcon>
                <VerifiedRounded sx={{ color: 'primary.main', fontSize: '16px' }} />
              </ListItemIcon>
              <ListItemText>{communicationTypeLabels.LEGAL}</ListItemText>
            </MenuItem>
            <MenuItem value="INFORMAL">
              <ListItemText>{communicationTypeLabels.INFORMAL}</ListItemText>
            </MenuItem>
          </TextField>
        </Grid>
      )}
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
            formikInstance.errors.iunMatch &&
            String(formikInstance.errors.iunMatch)
          }
          fullWidth
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          size="small"
          inputProps={{ maxLength: 25 }}
        />
      </Grid>
      <Grid item lg={showCommunicationType ? 1.75 : 2} xs={12}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filters.data_da', { ns: 'notifiche' })}
          format={DATE_FORMAT}
          value={formikInstance.values.startDate ?? null}
          onChange={(value: DatePickerTypes) => {
            void formikInstance.setFieldValue('startDate', value || tenYearsAgo);
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
              },
              error: Boolean(formikInstance.errors.startDate),
              helperText:
                formikInstance.errors.startDate && String(formikInstance.errors.startDate),
            },
          }}
          disableFuture={true}
          minDate={tenYearsAgo}
          maxDate={formikInstance.values.endDate ?? null}
        />
      </Grid>
      <Grid item lg={showCommunicationType ? 1.75 : 2} xs={12}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filters.data_a', { ns: 'notifiche' })}
          format={DATE_FORMAT}
          value={formikInstance.values.endDate ?? null}
          onChange={(value: DatePickerTypes) => {
            void formikInstance.setFieldValue('endDate', value || today);
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
              },
              error: Boolean(formikInstance.errors.endDate),
              helperText: formikInstance.errors.endDate && String(formikInstance.errors.endDate),
            },
          }}
          disableFuture={true}
          minDate={formikInstance.values.startDate ?? tenYearsAgo}
          maxDate={today}
        />
      </Grid>
    </Fragment>
  );
};

export default FilterNotificationsFormBody;
