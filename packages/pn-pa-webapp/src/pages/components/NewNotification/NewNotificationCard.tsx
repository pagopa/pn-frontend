import { Fragment, ReactNode } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

type Props = {
  children: ReactNode;
  isContinueDisabled: boolean;
  title?: string;
  noPaper?: boolean;
  submitLabel?: string;
  previousStepLabel?: string;
  previousStepOnClick?: () => void;
};

const NewNotificationCard = ({
  children,
  isContinueDisabled,
  title,
  noPaper = false,
  submitLabel = 'Continua',
  previousStepLabel,
  previousStepOnClick,
}: Props) => (
  <Fragment>
    {!noPaper && (
      <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
        {title && <Typography variant="h6">{title}</Typography>}
        <Box sx={{ marginTop: '20px' }}>{children}</Box>
      </Paper>
    )}
    {noPaper && <Box>{children}</Box>}
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginTop: '40px', marginBottom: '20px' }}
    >
      {previousStepLabel && (
        <Button variant="outlined" type="button" onClick={previousStepOnClick}>
          {previousStepLabel}
        </Button>
      )}
      <Button variant="contained" type="submit" disabled={isContinueDisabled}>
        {submitLabel}
      </Button>
    </Box>
  </Fragment>
);

export default NewNotificationCard;
