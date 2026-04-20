import { FocusEventHandler, ReactNode } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  ButtonProps,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type EntryModeProps = {
  mode: 'entry';
  title?: string;
  label?: string;
  inputLabel: string;
  value: string;
  buttonLabel: string;
  buttonVariant?: ButtonProps['variant'];
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void | Promise<void>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSubmit: () => void | Promise<void>;
  collapse?: {
    label: string;
    onClick: () => void;
  };
  footer?: ReactNode;
  prefix?: string | ReactNode;
};

type ViewModeProps = {
  mode: 'view';
  introText?: ReactNode;
  description?: ReactNode;
  label?: string;
  value?: ReactNode;
  secondaryContent?: ReactNode;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type Props = EntryModeProps | ViewModeProps;

const OnboardingContactItem: React.FC<Props> = (props) => {
  if (props.mode === 'entry') {
    const {
      title,
      label,
      inputLabel,
      value,
      buttonLabel,
      buttonVariant = 'contained',
      error,
      touched,
      onChange,
      onBlur,
      onSubmit,
      collapse,
      footer,
      prefix,
    } = props;

    return (
      <Stack>
        {title && (
          <Typography fontSize="16px" fontWeight={700} sx={{ mb: 1 }}>
            {title}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {label ?? null}
        </Typography>

        <TextField
          fullWidth
          size="small"
          label={inputLabel}
          value={value}
          onChange={(e) => void onChange(e.target.value)}
          InputProps={{
            startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
          }}
          onBlur={onBlur}
          error={Boolean(touched && error)}
          helperText={touched ? error : ' '}
        />

        {footer ?? null}

        <Button
          fullWidth
          sx={{ mt: 2 }}
          variant={buttonVariant}
          color="primary"
          onClick={() => void onSubmit()}
        >
          {buttonLabel}
        </Button>

        {collapse && (
          <ButtonNaked
            color="primary"
            size="medium"
            onClick={collapse.onClick}
            sx={{ alignSelf: 'center', fontWeight: 700, mt: 1 }}
          >
            {collapse.label}
          </ButtonNaked>
        )}
      </Stack>
    );
  }

  const { introText, description, label, value, secondaryContent, icon, action } = props;

  return (
    <Stack>
      {introText && (
        <Typography variant="body2" fontSize="16px" fontWeight={700} sx={{ mb: 1 }}>
          {introText}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon ?? <CheckIcon color="disabled" aria-hidden="true" />}
        <Box>
          {label && (
            <Typography variant="body2" fontSize="14px" color="text.secondary">
              {label}
            </Typography>
          )}
          {value && (
            <Typography variant="body2" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
              {value}
            </Typography>
          )}
          {secondaryContent ?? null}
        </Box>
      </Stack>

      {action && (
        <ButtonNaked
          color="primary"
          size="medium"
          onClick={action.onClick}
          sx={{ alignSelf: 'flex-start', fontWeight: 700, mt: 2 }}
        >
          {action.label}
        </ButtonNaked>
      )}
    </Stack>
  );
};

export default OnboardingContactItem;
