import { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import DownloadIcon from '@mui/icons-material/Download';
import { ButtonNaked } from '@pagopa/mui-italia';
import { NotificationDetailDocument } from '../../types/NotificationDetail';
type Props = {
  title: string;
  documents: Array<NotificationDetailDocument>;
  clickHandler: (documentIndex: number) => void;
  documentsAvailable: boolean;
  downloadFilesMessage?: string;
};

/**
 * Notification detail documents
 * @param title title to show
 * @param documents data to show
 * @param clickHandler function called when user clicks on the download button
 * @param documentsAvailable flag that allows download file or not (after 120 days)
 */

const NotificationDetailDocuments = ({
  title,
  documents,
  clickHandler,
  documentsAvailable = false,
  downloadFilesMessage,
}: Props) => (
  <Fragment>
    <Grid
      key={'files-section'}
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid key={'detail-documents-title'} item>
        <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
          {title}
        </Typography>
      </Grid>
      {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
      {/* !documentsAvailable &&
        <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli Atti</Button>
        </Grid>
      */}
    </Grid>
    <Grid key={'detail-documents-message'} item>
      {downloadFilesMessage && <Typography variant="body1">{downloadFilesMessage}</Typography>}
    </Grid>
    <Grid sx={{ mt: 1 }} key={'download-files-section'} />
    {documents.map((d, i) =>
      !documentsAvailable ? (
        <Typography key={d.digests.sha256}>{d.title}</Typography>
      ) : (
        <ButtonNaked
          data-testid="documentButton"
          key={d.digests.sha256}
          color={'primary'}
          startIcon={<AttachFileIcon />}
          onClick={() => clickHandler(i)}
        >
          {d.title}
          <Typography sx={{ fontWeight: 600, ml: '10px' }}>
            {'650 KB'} {/* TODO: integrate specific dimension of file */}
          </Typography>
        </ButtonNaked>
      )
    )}
  </Fragment>
);

export default NotificationDetailDocuments;
