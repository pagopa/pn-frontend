import React from 'react';
import { Box, Typography } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';

const UnderConstruction: React.FC = () => (
  <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
    <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
      <AdbIcon sx={{ height: '6em', width: '6em' }} />
      <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
        Work in progress
      </Typography>
    </Box>
  </Box>
);

export default UnderConstruction;
