import { ReactNode } from 'react';
import { Button, Grid, SxProps, Typography } from '@mui/material';

export type ApiKeyModalProps = {
  titleSx: SxProps;
  title: string;
  subTitle?: ReactNode;
  subTitleAtBottom?: boolean;
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
  subTitleAtBottom = false,
  content,
  closeButtonLabel,
  closeModalHandler,
  actionButtonLabel,
  actionHandler,
}: ApiKeyModalProps) => (
  <>
    <Typography variant="h5" sx={titleSx}>
      {title}
    </Typography>
    {subTitle && !subTitleAtBottom && (
      <Typography data-testid="subtitle-top" variant="body1" sx={{ marginBottom: 3 }}>
        {subTitle}
      </Typography>
    )}
    {content}
    {subTitle && subTitleAtBottom && (
      <Typography data-testid="subtitle-bottom" variant="body1" sx={{ my: 3 }}>
        {subTitle}
      </Typography>
    )}
    <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
      <Button
        data-testid="close-modal-button"
        variant="outlined"
        onClick={closeModalHandler}
        sx={{ mr: actionButtonLabel ? 2 : 0 }}
      >
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
