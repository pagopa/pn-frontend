import { Fragment } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import DownloadIcon from '@mui/icons-material/Download';
import { ButtonNaked } from '@pagopa/mui-italia';
import { NotificationDetailDocument, NotificationDetailOtherDocument } from '../../types';
type Props = {
  title: string;
  documents: Array<NotificationDetailDocument> | undefined;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
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
  documents = [],
  clickHandler,
  documentsAvailable = true,
  downloadFilesMessage,
}: // TODO: remove comment when link ready downloadFilesLink
Props) => {
  const mapOtherDocuments = (documents: Array<NotificationDetailDocument>) =>
    documents.map((d) => {
      const document = {
        key: d.digests && d.digests.sha256 ? d.digests.sha256 : d.documentId,
        name: d.title || d.ref.key,
        downloadHandler: d.documentId
          ? ({
              documentId: d.documentId,
              documentType: d.documentType,
            } as NotificationDetailOtherDocument)
          : d.docIdx,
      };
      return (
        <Box key={document.key}>
          {!documentsAvailable ? (
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachFileIcon sx={{ mr: 1 }} fontSize="inherit" color="inherit" />
              {d.title || d.ref.key}
            </Typography>
          ) : (
            <ButtonNaked
              data-testid="documentButton"
              color={'primary'}
              startIcon={<AttachFileIcon />}
              onClick={() => clickHandler(document.downloadHandler)}
            >
              <Box
                sx={{
                  textOverflow: 'ellipsis',
                  maxWidth: {
                    xs: '15rem',
                    sm: '20rem',
                    md: '30rem',
                    lg: '24rem',
                    xl: '34rem'
                  },
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {document.name}
              </Box>
              <Typography sx={{ fontWeight: 600, ml: 1 }}>
                {''} {/* TODO: integrate specific dimension of file */}
              </Typography>
            </ButtonNaked>
          )}
        </Box>
      );
    });

  return (
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
          {/* TODO: remove comment when link ready downloadFilesLink &&
          <Typography onClick={() => console.log('link')}>{downloadFilesLink}</Typography>
        */}
        </Stack>
      </Grid>
      <Grid key={'download-files-section'} item>
        {documents && mapOtherDocuments(documents)}
      </Grid>
    </Fragment>
  );
};

export default NotificationDetailDocuments;
