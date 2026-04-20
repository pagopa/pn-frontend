import { useTranslation } from 'react-i18next';

import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { IllusOnboardingChoice } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  onSelectSend: () => void;
  onSelectPec: () => void;
  isPecActivating: boolean;
};

const ChooseDigitalDomicileStep: React.FC<Props> = ({
  onSelectSend,
  onSelectPec,
  isPecActivating,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  if (isPecActivating) {
    return (
      <Stack data-testid="chose-digital-domicile-step">
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography fontSize="18px" fontWeight={700} mb={1}>
            {t('onboarding.digital-domicile.choice.pec-activating.title')}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {t('onboarding.digital-domicile.choice.pec-activating.description')}
          </Typography>

          <Chip
            label={t('onboarding.digital-domicile.choice.pec-activating.badge')}
            color="warning"
            sx={{ width: 'fit-content', '& .MuiChip-label': { fontSize: '12px' } }}
          />
        </Box>
        <IllusOnboardingChoice />
      </Stack>
    );
  }

  return (
    <Stack data-testid="chose-digital-domicile-step">
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography fontSize="18px" fontWeight={700} mb={1}>
          {t('onboarding.digital-domicile.choice.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {t('onboarding.digital-domicile.choice.description')}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={onSelectSend}
          data-testid="select-send-button"
        >
          {t('onboarding.digital-domicile.choice.cta')}
        </Button>

        <Divider sx={{ my: 2 }} />

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
      </Box>
      <IllusOnboardingChoice />
    </Stack>
  );
};

export default ChooseDigitalDomicileStep;
