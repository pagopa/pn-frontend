import React from 'react';

import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

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

const NotificationDetailBilingualDocuments: React.FC<Props> = ({
  title,
  description,
  action,
  link,
}) => (
  <>
    <Grid
      key="bilingual-section"
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      data-testid="bilingualSection"
    >
      <Grid key="detail-bilingual-documents-title" item sx={{ mb: 3 }}>
        <Typography
          id="notification-detail-bilingual-document-attached"
          color="text.primary"
          variant="overline"
        >
          {title}
        </Typography>
      </Grid>
    </Grid>
    <Grid key="detail-bilingual-documents-message" item data-testid="bilingualDocumentsMessage">
      <Stack direction="row">
        <Typography variant="body2" sx={{ mb: 3 }}>
          {description}
        </Typography>
      </Stack>
    </Grid>
    <Grid key="download-bilingual-files-section" item>
      <ButtonNaked
        id="download-bilingual-files-button"
        data-testid="downloadBilingualFilesButton"
        color={'primary'}
        startIcon={<DescriptionRoundedIcon />}
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
    </Grid>
  </>
);

export default NotificationDetailBilingualDocuments;
