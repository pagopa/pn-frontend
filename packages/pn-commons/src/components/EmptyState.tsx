import { ReactNode } from 'react';
import { Typography, Box } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

type Props = {
  /** Callback to be called when performing an empty action */
  emptyActionCallback: () => void;
  /** Empty message for no result */
  emptyMessage?: ReactNode;
  /** Empty action label */
  emptyActionLabel?: string;
  /** Disable sad emoticon */
  disableSentimentDissatisfied?: boolean;
  /** Secondary Message */
  secondaryMessage?: Message;
};

interface Message {
  emptyMessage?: ReactNode;
  emptyActionLabel?: string;
  emptyActionCallback?: () => void;
}

function EmptyState({
  emptyActionCallback,
  emptyMessage = 'I filtri che hai aggiunto non hanno dato nessun risultato.',
  emptyActionLabel = 'Rimuovi filtri',
  disableSentimentDissatisfied = false,
  secondaryMessage = {
    emptyMessage: '',
    emptyActionLabel: '',
  },
}: Props) {
  return (
    <Box
      component="div"
      display="block"
      sx={{
        textAlign: 'center',
        margin: '16px 0',
        padding: '16px',
        backgroundColor: 'background.paper',
      }}
    >
      {!disableSentimentDissatisfied && (
        <SentimentDissatisfied sx={{ verticalAlign: 'middle', margin: '0 20px' }} />
      )}
      <Typography variant="body2" sx={{ display: 'inline' }}>
        {emptyMessage}
      </Typography>
      &nbsp;
      <Typography
        color="primary"
        variant="body2"
        fontWeight={'bold'}
        data-testid="callToActionFirst"
        sx={{
          cursor: 'pointer',
          display: 'inline',
        }}
        onClick={emptyActionCallback}
      >
        {emptyActionLabel}
      </Typography>
      &nbsp;
      <Typography variant="body2" sx={{ display: 'inline' }}>
        {secondaryMessage.emptyMessage}
      </Typography>
      &nbsp;
      <Typography
        color="primary"
        variant="body2"
        fontWeight={'bold'}
        data-testid="callToActionSecond"
        sx={{
          cursor: 'pointer',
          display: 'inline',
        }}
        onClick={secondaryMessage.emptyActionCallback}
      >
        {secondaryMessage.emptyActionLabel}
      </Typography>
    </Box>
  );
}

export default EmptyState;
