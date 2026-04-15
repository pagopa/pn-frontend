import { FocusEventHandler, ReactNode } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type EntryModeProps = {
  mode: 'entry';
  title?: string;
  label: string;
  inputLabel: string;
  value: string;
  buttonLabel: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void | Promise<void>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSubmit: () => void | Promise<void>;
  collapseLabel?: string;
  onCollapse?: () => void;
  footer?: ReactNode;
};

type ViewModeProps = {
  mode: 'view';
  introText?: ReactNode;
  label?: string;
  value: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
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
      error,
      touched,
      onChange,
      onBlur,
      onSubmit,
      collapseLabel,
      onCollapse,
      footer,
    } = props;

    return (
      <Stack spacing={2}>
        {title && (
          <Typography fontSize="16px" fontWeight={700}>
            {title}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
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

        <Button fullWidth variant="outlined" onClick={() => void onSubmit()}>
          {buttonLabel}
        </Button>

        {footer && (
          <Typography variant="body2" color="text.secondary">
            {footer}
          </Typography>
        )}

        {collapseLabel && onCollapse && (
          <ButtonNaked
            color="primary"
            size="medium"
            onClick={onCollapse}
            sx={{ alignSelf: 'center', fontWeight: 700 }}
          >
            {collapseLabel}
          </ButtonNaked>
        )}
      </Stack>
    );
  }

  const { introText, label, value, icon, actionLabel, onAction } = props;

  return (
    <Stack spacing={2}>
      {introText && (
        <Typography variant="body2" color="text.secondary">
          {introText}
        </Typography>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon ?? <CheckIcon color="disabled" fontSize="small" aria-hidden="true" />}
        <Box>
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          <Typography variant="body1" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Stack>

      {actionLabel && onAction && (
        <ButtonNaked
          color="primary"
          size="medium"
          onClick={onAction}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {actionLabel}
        </ButtonNaked>
      )}
    </Stack>
  );
};

export default OnboardingContactItem;
