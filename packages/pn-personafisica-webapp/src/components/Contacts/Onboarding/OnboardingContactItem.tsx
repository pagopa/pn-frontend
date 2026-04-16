import { FocusEventHandler, ReactNode } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, ButtonProps, Stack, TextField, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type EntryModeProps = {
  mode: 'entry';
  title?: string;
  label: string;
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
    } = props;

    return (
      <Stack spacing={1}>
        {title && (
          <Typography fontSize="16px" fontWeight={700}>
            {title}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {label}
        </Typography>

        <TextField
          fullWidth
          size="small"
          label={inputLabel}
          value={value}
          onChange={(e) => void onChange(e.target.value)}
          onBlur={onBlur}
          error={Boolean(touched && error)}
          helperText={touched ? error : ' '}
        />

        <Button fullWidth variant={buttonVariant} color="primary" onClick={() => void onSubmit()}>
          {buttonLabel}
        </Button>

        {footer ?? null}

        {collapse && (
          <ButtonNaked
            color="primary"
            size="medium"
            onClick={collapse.onClick}
            sx={{ alignSelf: 'center', fontWeight: 700 }}
          >
            {collapse.label}
          </ButtonNaked>
        )}
      </Stack>
    );
  }

  const { introText, description, label, value, secondaryContent, icon, action } = props;

  return (
    <Stack spacing={2}>
      {introText && (
        <Typography variant="body2" color="text.secondary">
          {introText}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {label}
        </Typography>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon ?? <CheckIcon color="disabled" aria-hidden="true" />}
        <Box>
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          {value && (
            <Typography fontSize="16px" fontWeight={600}>
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
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {action.label}
        </ButtonNaked>
      )}
    </Stack>
  );
};

export default OnboardingContactItem;
