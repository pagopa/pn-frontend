import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Paper, Typography } from '@mui/material';
import { SectionHeading } from '@pagopa-pn/pn-commons';

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

  return (
    <Fragment>
      {!noPaper && (
        <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
          {title && <SectionHeading>{title}</SectionHeading>}
          {subtitle && <Typography variant="body1">{subtitle}</Typography>}
          <Box sx={{ marginTop: '20px' }}>{children}</Box>
        </Paper>
      )}
      {noPaper && <Box>{children}</Box>}
      <Box
        display="flex"
        flexDirection="row-reverse"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: '40px', marginBottom: '20px' }}
      >
        <Button
          variant="contained"
          type="submit"
          disabled={isContinueDisabled}
          data-testid="step-submit"
        >
          {submitLabel ? submitLabel : t('button.continue')}
        </Button>
        {previousStepLabel && (
          <Button
            variant="outlined"
            type="button"
            onClick={previousStepOnClick}
            data-testid="previous-step"
          >
            {previousStepLabel}
          </Button>
        )}
      </Box>
    </Fragment>
  );
};

export default NewNotificationCard;
