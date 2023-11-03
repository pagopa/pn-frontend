import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Paper, Typography } from '@mui/material';
import { SectionHeading, useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title?: string;
  subtitle?: string;
  noPaper?: boolean;
  submitLabel?: string;
  previousStepLabel?: string;
  previousStepOnClick?: () => void;
};

const NewNotificationCard = ({
  children,
  isContinueDisabled,
  title,
  subtitle,
  noPaper = false,
  submitLabel,
  previousStepLabel,
  previousStepOnClick,
}: Props) => {
  const { t } = useTranslation(['common', 'notifiche']);
  const isMobile = useIsMobile();

  return (
    <Fragment>
      {!noPaper && (
        <Paper sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
          {title && <SectionHeading data-testid="title">{title}</SectionHeading>}
          {subtitle && (
            <Typography data-testid="subtitle" variant="body1">
              {subtitle}
            </Typography>
          )}
          <Box sx={{ marginTop: '20px' }}>{children}</Box>
        </Paper>
      )}
      {noPaper && <Box>{children}</Box>}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row-reverse'}
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: '40px', marginBottom: '20px' }}
      >
        <Button
          id="step-submit"
          variant="contained"
          type="submit"
          disabled={isContinueDisabled}
          data-testid="step-submit"
          fullWidth={isMobile}
        >
          {submitLabel || t('button.continue')}
        </Button>
        {previousStepLabel && (
          <Button
            id="previous-step"
            variant="outlined"
            type="button"
            onClick={previousStepOnClick}
            data-testid="previous-step"
            fullWidth={isMobile}
            sx={{ marginTop: isMobile ? 2 : 0 }}
          >
            {previousStepLabel}
          </Button>
        )}
      </Box>
    </Fragment>
  );
};

export default NewNotificationCard;
