import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';


const NuovaDelega = () => {
  const { t } = useTranslation(['notifiche']);


  return (
    <Box style={{ padding: '20px' }}>
        form nuova delega
    </Box>
  );
};

export default NuovaDelega;
