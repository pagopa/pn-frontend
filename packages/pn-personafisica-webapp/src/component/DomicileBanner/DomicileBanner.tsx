import { Alert, Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../navigation/routes.const';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const DomicileBanner = () => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const legalDomicile = useAppSelector((state: RootState) => state.generalInfoState.legalDomicile);
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

  useEffect(() => {
    if (legalDomicile && legalDomicile.length > 0) {
      setOpen(false);
    }
  }, [legalDomicile]);

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
