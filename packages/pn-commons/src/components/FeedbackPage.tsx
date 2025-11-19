import * as React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { IllusCompleted, IllusError } from '@pagopa/mui-italia';

type FeedbackPageProps = {
  /** Visual outcome to render a suitable illustration */
  outcome: 'success' | 'error';
  /** Main heading text */
  title: string;
  /** Optional description text */
  description?: string;
  action: {
    /** CTA label */
    text: string;
    /** CTA callback */
    onClick: () => void;
  };
};

const FeedbackPage: React.FC<FeedbackPageProps> = ({ outcome, title, description, action }) => (
  <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
    <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
      {outcome === 'success' ? <IllusCompleted /> : <IllusError />}
      <Typography variant="h4" color="text.primary" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body1" color="text.primary">
          {description}
        </Typography>
      ) : null}
      <Button
        id="actionButton"
        variant="contained"
        sx={{ mt: 4 }}
        onClick={action.onClick}
        data-testid="feedback-cta"
      >
        {action.text}
      </Button>
    </Box>
  </Box>
);

export default FeedbackPage;
