import { useTranslation } from 'react-i18next';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  onSelectSend: () => void;
  onSelectPec: () => void;
};

const ChooseDigitalDomicileStep: React.FC<Props> = ({ onSelectSend, onSelectPec }) => {
  const { t } = useTranslation(['recapiti', 'common']);

  return (
    <Stack data-testid="chose-digital-domicile-step">
      <Typography fontSize="22px" fontWeight={700} mb={1}>
        {t('onboarding.digital-domicile.choice.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('onboarding.digital-domicile.choice.description')}
      </Typography>

      <Button fullWidth variant="contained" onClick={onSelectSend} data-testid="select-send-button">
        {t('onboarding.digital-domicile.choice.cta')}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {t('onboarding.digital-domicile.choice.pec.description')}
        </Typography>

        <ButtonNaked
          color="primary"
          size="medium"
          onClick={onSelectPec}
          data-testid="select-pec-button"
          sx={{ fontWeight: 700 }}
        >
          {t('onboarding.digital-domicile.choice.pec.cta')}
        </ButtonNaked>
      </Box>
      {/* TODO: img here if/when available */}
    </Stack>
  );
};

export default ChooseDigitalDomicileStep;
