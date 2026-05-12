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
import { SxProps, Theme } from '@mui/material/styles';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

type CommonSlotProps = {
  container?: {
    sx?: SxProps<Theme>;
  };
};

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
  slotProps?: CommonSlotProps;
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
  slotProps?: CommonSlotProps;
};

type Props = EntryModeProps | ViewModeProps;

const EntryMode: React.FC<Omit<EntryModeProps, 'mode'>> = ({
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
  slotProps,
}) => {
  const isMobile = useIsMobile();

  const submitButton = (
    <Button
      fullWidth={isMobile}
      sx={isMobile ? { mt: 2 } : { height: '43px', fontWeight: 700, flexShrink: 0 }}
      variant={buttonVariant}
      color="primary"
      onClick={() => void onSubmit()}
    >
      {buttonLabel}
    </Button>
  );

  return (
    <Stack sx={slotProps?.container?.sx}>
      {title && (
        <Typography fontSize="16px" fontWeight={700}>
          {title}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" mb={2}>
        {label ?? null}
      </Typography>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 0 : 2}
        alignItems={isMobile ? 'stretch' : 'flex-start'}
      >
        <TextField
          fullWidth
          size="small"
          label={inputLabel}
          value={value}
          onChange={(e) => void onChange(e.target.value)}
          onBlur={onBlur}
          InputProps={{
            startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
          }}
          error={touched && Boolean(error)}
          helperText={touched && error}
        />
        {!isMobile && submitButton}
      </Stack>

      {footer ?? null}

      {isMobile && submitButton}

      {collapse && (
        <ButtonNaked
          color="primary"
          size="medium"
          onClick={collapse.onClick}
          sx={{ alignSelf: isMobile ? 'center' : 'flex-start', fontWeight: 700, mt: 2 }}
        >
          {collapse.label}
        </ButtonNaked>
      )}
    </Stack>
  );
};

const ViewMode: React.FC<Omit<ViewModeProps, 'mode'>> = ({
  introText,
  description,
  label,
  value,
  secondaryContent,
  icon,
  action,
  slotProps,
}) => (
  <Stack sx={slotProps?.container?.sx}>
    {introText && (
      <Typography fontSize="16px" fontWeight={700} sx={{ mb: 1 }}>
        {introText}
      </Typography>
    )}

    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
    )}

    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon ?? <CheckIcon color="disabled" fontSize="small" aria-hidden="true" />}
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
        sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
      >
        {action.label}
      </ButtonNaked>
    )}
  </Stack>
);

const OnboardingContactItem: React.FC<Props> = (props) =>
  props.mode === 'entry' ? <EntryMode {...props} /> : <ViewMode {...props} />;

export default OnboardingContactItem;
