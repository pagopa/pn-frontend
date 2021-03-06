import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';

import * as routes from '../../../navigation/routes.const';

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title?: string;
  noPaper?: boolean;
};

const NewNotificationCard = ({ children, isContinueDisabled, title, noPaper = false }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'notifiche']);

  const handleGoBack = () => {
    navigate(routes.DASHBOARD);
  };

  return (
    <Fragment>
      {!noPaper && (
        <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
          {title && <Typography variant="h6">{title}</Typography>}
          <Box sx={{ marginTop: '20px' }}>{children}</Box>
        </Paper>
      )}
      {noPaper && <Box>{children}</Box>}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: '40px', marginBottom: '20px' }}
      >
        <Button variant="outlined" type="button" onClick={handleGoBack}>
        {t('new-notification.back-to-notifications', {ns: 'notifiche'})}
        </Button>
        <Button variant="contained" type="submit" disabled={isContinueDisabled}>
          {t('button.continue')}
        </Button>
      </Box>
    </Fragment>
  );
};

export default NewNotificationCard;
