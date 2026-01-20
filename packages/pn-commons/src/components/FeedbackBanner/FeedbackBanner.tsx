import React, { ReactNode, useId } from 'react';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type Action = {
  text: string;
  href: string;
  target?: '_self' | '_blank';
};

type Props = {
  /** Banner title, visually rendered as heading (Typography h2). */
  title: string;
  /** Banner body content. Accepts plain text or any custom React node. */
  content: string | ReactNode;
  /** Link-based CTA. */
  action: Action;
};

const FeedbackBanner: React.FC<Props> = ({ title, content, action }) => {
  const titleId = useId();
  const ctaId = useId();

  const isBlank = action.target === '_blank';

  return (
    <Alert
      severity="info"
      icon={false}
      aria-labelledby={titleId}
      sx={{
        p: 2,
        borderRadius: 3,
        background: '#E7ECFC',
        border: '1px solid #CED8F9',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box pt={0.5}>
          <EditOutlinedIcon fontSize="small" sx={{ color: '#9DB2F4' }} />
        </Box>
        <Box>
          <Typography id={titleId} component="h2" variant="subtitle1" sx={{ fontSize: '16px' }}>
            {title}
          </Typography>

          {typeof content === 'string' ? (
            <Typography variant="body2" fontSize={14}>
              {content}
            </Typography>
          ) : (
            content
          )}

          <ButtonNaked
            id={ctaId}
            component="a"
            href={action.href}
            target={action.target ?? '_self'}
            rel={isBlank ? 'noopener noreferrer' : undefined}
            aria-labelledby={`${titleId} ${ctaId}`}
            sx={{ mt: 1.5, fontSize: 16, color: '#0B3EE3', '&:visited': { color: '#0B3EE3' } }}
          >
            {action.text}
          </ButtonNaked>
        </Box>
      </Stack>
    </Alert>
  );
};

export default FeedbackBanner;
