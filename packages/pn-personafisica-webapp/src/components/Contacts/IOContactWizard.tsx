import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Avatar, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { IllusAppIoLogo, IllusSendLogo } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  goToNextStep: () => void;
  handleConfirmIOActivation: () => void;
  handleSkipOrExitClick: () => void;
};

const IOContactWizard: React.FC<Props> = ({ handleConfirmIOActivation, handleSkipOrExitClick }) => {
  const { t } = useTranslation('recapiti');

  const sercqSendIoList: Array<string> = t('legal-contacts.sercq-send-wizard.step_2.io-list', {
    defaultValue: [],
    ns: 'recapiti',
  });

  return (
    <Stack useFlexGap spacing={2} data-testid="ioContactWizard">
      <Typography fontSize="22px" fontWeight={700}>
        {t('legal-contacts.sercq-send-wizard.step_2.title')}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent={{ xs: 'center', lg: 'flex-start' }}
        data-testid="ioContactIllustration"
      >
        <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
          <IllusAppIoLogo />
        </Avatar>
        <CompareArrowsIcon sx={{ width: '24px', height: '24px', mx: 1, color: 'text.secondary' }} />
        <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
          <IllusSendLogo />
        </Avatar>
      </Stack>

      <Typography fontSize="16px">
        {t('legal-contacts.sercq-send-wizard.step_2.content')}
      </Typography>

      <List dense sx={{ p: 0, mx: 3, pb: 1, listStyleType: 'square' }}>
        {sercqSendIoList.map((item, index) => (
          <ListItem key={index} sx={{ display: 'list-item' }} disablePadding>
            <ListItemText disableTypography>
              <Typography variant="body2" fontSize="16px">
                <Trans i18nKey={item} t={(s: string) => s} />
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        onClick={handleConfirmIOActivation}
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        data-testid="confirmButton"
      >
        {t('legal-contacts.sercq-send-wizard.step_2.confirm')}
      </Button>
      <ButtonNaked
        onClick={handleSkipOrExitClick}
        color="primary"
        fullWidth
        data-testid="confirmButton"
      >
        {t('legal-contacts.sercq-send-wizard.step_2.skip-io')}
      </ButtonNaked>
    </Stack>
  );
};

export default IOContactWizard;
