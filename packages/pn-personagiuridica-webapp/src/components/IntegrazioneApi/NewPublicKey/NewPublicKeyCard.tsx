import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Paper } from '@mui/material';
import { SectionHeading, useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title?: string;
  content?: JSX.Element;
  noPaper?: boolean;
  submitLabel?: string;
  previousStepLabel?: string;
  previousStepOnClick?: () => void;
};

const NewPublicKeyCard = ({
  children,
  isContinueDisabled,
  title,
  content,
  noPaper = false,
  submitLabel,
  previousStepLabel,
  previousStepOnClick,
}: Props) => {
  const { t } = useTranslation(['integrazioneApi']);
  const isMobile = useIsMobile();

  return (
    <Fragment>
      {!noPaper && (
        <Paper sx={{ p: 3, mt: 5 }} elevation={0}>
          {title && <SectionHeading data-testid="title">{title}</SectionHeading>}
          {content}
          <Box sx={{ mt: 3 }}>{children}</Box>
        </Paper>
      )}
      {noPaper && <Box>{children}</Box>}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row-reverse'}
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: '40px', mb: 3 }}
      >
        <Button
          id="step-submit"
          variant="contained"
          type="submit"
          disabled={isContinueDisabled}
          data-testid="step-submit"
          fullWidth={isMobile}
        >
          {submitLabel || t('new-public-key.button.end')}
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

export default NewPublicKeyCard;
