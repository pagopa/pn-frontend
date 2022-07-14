import { Fragment } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import DownloadIcon from '@mui/icons-material/Download';
import { ButtonNaked } from '@pagopa/mui-italia';
import { NotificationDetailDocument } from '../../types/NotificationDetail';
type Props = {
  title: string;
  documents: Array<NotificationDetailDocument>;
  clickHandler: (documentIndex: string | undefined) => void;
  documentsAvailable?: boolean;
  downloadFilesMessage?: string;
  downloadFilesLink?: string;
};

/**
 * Notification detail documents
 * @param title title to show
 * @param documents data to show
 * @param clickHandler function called when user clicks on the download button
 * @param documentsAvailable flag that allows download file or not (after 120 days)
 * @param downloadFilesMessage disclaimer to show about downloadable acts
 * @param downloadFilesLink text to bring to
 */

const NotificationDetailDocuments = ({
  title,
  documents,
  clickHandler,
  documentsAvailable = true,
  downloadFilesMessage,
  downloadFilesLink
}: Props) => (
  <Fragment>
    <Grid
      key={'files-section'}
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid key={'detail-documents-title'} item sx={{ mb: 3 }}>
        <Typography
          color="text.primary"
          variant="overline"
          fontWeight={700}
          textTransform="uppercase"
          fontSize={14}
        >
          {title}
        </Typography>
      </Grid>
      {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
      {/* !documentsAvailable &&
        <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti i Documenti</Button>
        </Grid>
      */}
    </Grid>
    <Grid key={'detail-documents-message'} item>
      <Stack direction="row">
        {downloadFilesMessage && (
          <Typography variant="body2" sx={{ mb: 3 }}>
            {downloadFilesMessage}
          </Typography>
        )}
        {/*downloadFilesLink &&
          <Typography onClick={() => console.log('link')}>{downloadFilesLink}</Typography>
        */}
      </Stack>
    </Grid>
    <Grid key={'download-files-section'} item>
      {documents && documents.map((d) => (
        <Box key={d.digests.sha256}>
          {!documentsAvailable ? (
          <Typography sx={{ display: 'flex', alignItems: 'center' }}><AttachFileIcon sx={{ mr: 1 }} fontSize='inherit' color="inherit" />{d.title || d.ref.key}</Typography>) : (
          <ButtonNaked
            data-testid="documentButton"
            color={'primary'}
            startIcon={<AttachFileIcon />}
            onClick={() => clickHandler(d.docIdx)}
          >
            {d.title || d.ref.key}
            <Typography sx={{ fontWeight: 600, ml: 1 }}>
              {''} {/* TODO: integrate specific dimension of file */}
            </Typography>
          </ButtonNaked>
          )}
        </Box>
      ))}
    </Grid>
  </Fragment>
);

export default NotificationDetailDocuments;
