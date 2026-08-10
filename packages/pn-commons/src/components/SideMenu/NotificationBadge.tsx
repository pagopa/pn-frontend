import { Box, Typography, useTheme } from '@mui/material';

type Props = {
  numberOfNotification: number;
};

const NotificationBadge: React.FC<Props> = ({ numberOfNotification }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '23px',
        height: '18px',
        borderRadius: '56px',
        padding: '3px, 8px, 3px, 8px',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ color: 'white', fontSize: '12px' }} data-testid="notifications">
        {numberOfNotification !== 0 && <>{numberOfNotification}</>}
      </Typography>
    </Box>
  );
};

export default NotificationBadge;
