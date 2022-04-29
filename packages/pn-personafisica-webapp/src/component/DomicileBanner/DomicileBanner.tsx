import { Alert, Box, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../navigation/routes.const';

const DomicileBanner = () => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const messageIndex = Math.floor(Math.random() * 4);
  const messages = [
    'detail.domicile_1',
    'detail.domicile_2',
    'detail.domicile_3',
    'detail.domicile_4',
  ];

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddDomicile = () => {
    navigate(routes.RECAPITI);
  };

  return open ? (
    <Box mb={2.5}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={handleClose}
        data-testid="addDomicileBanner"
      >
        <Typography>
          {t(messages[messageIndex])}{' '}
          <Link fontWeight={'bold'} onClick={handleAddDomicile}>
            {t('detail.add_domicile')}
          </Link>
        </Typography>
      </Alert>
    </Box>
  ) : (
    <></>
  );
};

export default DomicileBanner;
