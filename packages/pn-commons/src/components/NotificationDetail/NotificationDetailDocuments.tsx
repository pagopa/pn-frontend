import { Fragment } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { NotificationDetailDocument } from '../../types/Notifications';

type Props = {
  title: string;
  documents: Array<NotificationDetailDocument>;
  clickHandler: (documentIndex: number) => void;
};

const NotificationDetailDocuments = ({ title, documents, clickHandler }: Props) => {

  return (
    <Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
            {title}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli Atti</Button>
        </Grid> */}
      </Grid>
      {documents.map((d, i) => (
        <Button data-testid="documentButton" key={d.digests.sha256} startIcon={<AttachFileIcon />} onClick={() => clickHandler(i)}>
          {d.title}
        </Button>
      ))}
    </Fragment>
  );
};

export default NotificationDetailDocuments;
