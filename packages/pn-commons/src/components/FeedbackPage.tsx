import { FC, ReactNode } from 'react';

import { Box, Button, Typography } from '@mui/material';
import { IllusCompleted, IllusError } from '@pagopa/mui-italia';

type FeedbackPageProps = {
  /** Visual outcome to render a suitable illustration */
  outcome: 'success' | 'error';
  /** Main heading text */
  title: string;
  /** Optional description content  */
  description?: string | ReactNode;
  action?: {
    /** CTA label */
    text: string;
    /** CTA callback */
    onClick: () => void;
  };
  slotProps?: {
    icon?: ReactNode;
  };
};

const FeedbackPage: FC<FeedbackPageProps> = ({
  outcome,
  title,
  description,
  action,
  slotProps,
}) => {
  const getDescription = () => {
    if (!description) {
      return null;
    }
    if (typeof description === 'string') {
      return (
        <Typography variant="body1" color="text.primary">
          {description}
        </Typography>
      );
    }
    return description;
  };

  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        {slotProps?.icon ?? (outcome === 'success' ? <IllusCompleted /> : <IllusError />)}
        <Typography variant="h4" color="text.primary" sx={{ mt: 2, mb: 1 }}>
          {title}
        </Typography>
        {getDescription()}
        {action && (
          <Button
            id="actionButton"
            variant="contained"
            sx={{ mt: 4 }}
            onClick={action.onClick}
            data-testid="feedback-cta"
          >
            {action.text}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackPage;
