import { useTranslation } from 'react-i18next';

import { InputAdornment, TextField } from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

export const ShowCodesInput = ({ value, label }: { value: string; label: string }) => {
  const { t } = useTranslation(['integrazioneApi']);

  return (
    <TextField
      value={value}
      fullWidth
      label={t(label)}
      InputProps={{
        readOnly: true,
        sx: { p: 0 },
        endAdornment: (
          <InputAdornment position="end">
            <CopyToClipboardButton
              value={() => value}
              tooltipTitle={t('api-key-copied')}
              color="primary"
            />
          </InputAdornment>
        ),
      }}
    />
  );
};
