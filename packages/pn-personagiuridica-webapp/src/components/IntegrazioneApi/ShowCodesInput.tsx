import { useTranslation } from 'react-i18next';

import { InputAdornment, TextField } from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

type Props = {
  name: string;
  value: string;
  label: string;
};

export const ShowCodesInput: React.FC<Props> = ({ name, value, label }) => {
  const { t } = useTranslation(['integrazioneApi']);

  return (
    <TextField
      name={name}
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
