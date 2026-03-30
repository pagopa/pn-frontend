import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import { Box, SxProps, Theme, Typography } from '@mui/material';

type InlineErrorMessageProps = {
  message: string;
  sx?: SxProps<Theme>;
  color?: string;
};

const InlineErrorMessage: React.FC<InlineErrorMessageProps> = ({
  message,
  sx,
  color = '#D13333',
}) => (
  <Box
    role="alert"
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      color,
      ...sx,
    }}
  >
    <ReportRoundedIcon
      aria-hidden
      sx={{
        fontSize: 16,
        color,
        flexShrink: 0,
      }}
    />
    <Typography
      variant="caption"
      sx={{
        color,
        lineHeight: 1.2,
      }}
    >
      {message}
    </Typography>
  </Box>
);

export default InlineErrorMessage;
