import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import { Box, FormHelperText, SxProps, Theme, Typography } from '@mui/material';

type InlineErrorMessageProps = {
  id: string;
  message: string;
  sx?: SxProps<Theme>;
};

const InlineErrorMessage: React.FC<InlineErrorMessageProps> = ({ message, sx, id }) => (
  <FormHelperText
    error
    component={Box}
    id={id}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      mt: 1,
      ...sx,
    }}
  >
    <ReportRoundedIcon
      sx={{
        fontSize: 16,
        color: 'error.main',
      }}
    />
    <Typography
      variant="caption"
      sx={{
        color: 'error.main',
        lineHeight: 1.2,
      }}
    >
      {message}
    </Typography>
  </FormHelperText>
);

export default InlineErrorMessage;
