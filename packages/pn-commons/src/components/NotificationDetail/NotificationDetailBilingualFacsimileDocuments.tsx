import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { ButtonNaked, MIPaper } from '@pagopa/mui-italia';

/**
 *  Notification detail bilingual documents
 *  @param title title to show
 *  @param description description to show
 *  @param action action to show
 */

interface Props {
  title: string;
  description: string;
  action: string;
  link?: string;
}

const NotificationDetailBilingualFacsimileDocuments: React.FC<Props> = ({
  title,
  description,
  action,
  link,
}) => (
  <MIPaper padding={24}>
    <Stack key="bilingual-section" data-testid="bilingualSection" alignItems={'start'}>
      <Typography
        component="h2"
        variant="h6"
        id="notification-detail-bilingual-document-attached"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }} data-testid="bilingualDocumentsMessage">
        {description}
      </Typography>
      <ButtonNaked
        id="download-bilingual-files-button"
        data-testid="downloadBilingualFilesButton"
        color={'primary'}
        onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
        disabled={false}
      >
        <Box
          sx={{
            textOverflow: 'ellipsis',
            maxWidth: {
              xs: '15rem',
              sm: '20rem',
              md: '30rem',
              lg: '24rem',
              xl: '34rem',
            },
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {action}
        </Box>
      </ButtonNaked>
    </Stack>
  </MIPaper>
);

export default NotificationDetailBilingualFacsimileDocuments;
