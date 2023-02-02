import { ReactNode } from 'react';
import { Button, Grid, SxProps, Typography } from '@mui/material';

type Props = {
  titleSx: SxProps;
  title: string;
  subTitle: ReactNode;
  content?: ReactNode;
  closeButtonLabel: string;
  closeModalHandler: () => void;
  actionButtonLabel?: string;
  actionHandler?: () => void;
};

const ApiKeyModal = ({
  titleSx,
  title,
  subTitle,
  content,
  closeButtonLabel,
  closeModalHandler,
  actionButtonLabel,
  actionHandler,
}: Props) => (
  <>
    <Typography variant="h5" sx={titleSx}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ marginBottom: 3 }}>
      {subTitle}
    </Typography>
    {content}
    <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
      <Button data-testid="close-modal-button" variant="outlined" onClick={closeModalHandler} sx={{ mr: actionButtonLabel ? 2 : 0 }}>
        {closeButtonLabel}
      </Button>
      {actionButtonLabel && (
        <Button data-testid="action-modal-button" variant="contained" onClick={actionHandler}>
          {actionButtonLabel}
        </Button>
      )}
    </Grid>
  </>
);

export default ApiKeyModal;
