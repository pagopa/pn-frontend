import { Box, Typography } from "@mui/material";
import React from "react";

const NotificationBadge: React.FC<{numberOfNotification: number}> = ({numberOfNotification}) => (
    <Box sx={{
        width: '23px',
        height: '18px',
        borderRadius: '56px',
        padding: '3px, 8px, 3px, 8px',
        backgroundColor: '#0073E6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography sx={{ color: 'white', fontSize: '12px' }}>
          {numberOfNotification !== 0 && <>{numberOfNotification}</>}
        </Typography>
      </Box>
);

export default NotificationBadge;