import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title: string;
  content: ReactNode;
  submitLabel?: string;
  previousStepLabel?: string;
  onContinueClick: () => void;
  onBackClick?: () => void;
};

const NewPublicKeyCard: React.FC<Props> = ({
  children,
  isContinueDisabled,
  title,
  content,
  submitLabel,
  previousStepLabel,
  onContinueClick,
  onBackClick,
}) => {
  const { t } = useTranslation(['common']);
  const isMobile = useIsMobile();

  return (
    <>
      <Paper sx={{ p: 3, mt: 3 }} elevation={0}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, m: 0, p: 0 }} data-testid="title">
          {title}
        </Typography>
        {content}
        <Box>{children}</Box>
      </Paper>
      <Stack
        direction={{ xs: 'column', lg: 'row-reverse' }}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 3, mb: 5 }}
      >
        <Button
          id="step-submit"
          variant="contained"
          onClick={onContinueClick}
          disabled={isContinueDisabled}
          data-testid="step-submit"
          fullWidth={isMobile}
        >
          {submitLabel ?? t('button.end')}
        </Button>
        {previousStepLabel && (
          <Button
            id="previous-step"
            variant="outlined"
            type="button"
            onClick={onBackClick}
            data-testid="previous-step"
            fullWidth={isMobile}
            sx={{ mt: { xs: 2, lg: 0 } }}
          >
            {previousStepLabel}
          </Button>
        )}
      </Stack>
    </>
  );
};

export default NewPublicKeyCard;
