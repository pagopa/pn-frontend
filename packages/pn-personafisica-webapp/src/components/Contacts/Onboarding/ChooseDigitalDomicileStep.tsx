import { useTranslation } from 'react-i18next';

import { Box, Divider, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { MIButton, MIChip } from '@pagopa/mui-italia';

import OnboardingImage from './OnboardingImage';

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
  const isMobile = useIsMobile();
  const { t } = useTranslation(['recapiti', 'common']);

  if (isPecActivating) {
    return (
      <Stack data-testid="chose-digital-domicile-step">
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography fontSize="18px" fontWeight={700} mb={1}>
            {t('onboarding.digital-domicile.choice.pec-activating.title')}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {t('onboarding.digital-domicile.choice.pec-activating.description')}
          </Typography>

          <MIChip
            label={t('onboarding.digital-domicile.choice.pec-activating.badge')}
            color="warning"
            sx={{ width: 'fit-content', '& .MuiChip-label': { fontSize: '12px' } }}
          />
        </Box>
        <OnboardingImage
          src="/imgs/onboarding-choice.webp"
          decorative
          height={isMobile ? '160px' : '276px'}
        />
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
        <MIButton
          fullWidth={isMobile}
          variant="contained"
          onClick={onSelectSend}
          data-testid="select-send-button"
        >
          {t('onboarding.digital-domicile.choice.cta')}
        </MIButton>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {t('onboarding.digital-domicile.choice.pec.description')}
          </Typography>

          <MIButton variant="text" onClick={onSelectPec} data-testid="select-pec-button">
            {t('onboarding.digital-domicile.choice.pec.cta')}
          </MIButton>
        </Box>
      </Box>
      <OnboardingImage
        src="/imgs/onboarding-choice.webp"
        decorative
        height={isMobile ? '160px' : '276px'}
      />
    </Stack>
  );
};

export default ChooseDigitalDomicileStep;
