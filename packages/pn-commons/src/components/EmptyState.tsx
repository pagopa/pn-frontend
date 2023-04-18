import { ReactNode } from 'react';
import { Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { KnownSentiment } from '../types';
import { iconForKnownSentiment } from '../types/EmptyState';

type Props = {
  /** Callback to be called when performing an empty action */
  emptyActionCallback?: (e: any, source?: string) => void;
  /** Empty message for no result */
  emptyMessage?: ReactNode;
  /** Empty action label */
  emptyActionLabel?: string;
  /** Indication for which emoticon to show */
  sentimentIcon?: KnownSentiment | SvgIconComponent;
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
  sentimentIcon = KnownSentiment.DISSATISFIED,
  secondaryMessage = {
    emptyMessage: '',
    emptyActionLabel: '',
  },
}: Props) {
  const FinalIcon =
    typeof sentimentIcon === 'string' ? iconForKnownSentiment(sentimentIcon) : sentimentIcon;

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
      {FinalIcon && (
        <FinalIcon sx={{ verticalAlign: 'middle', mr: '20px', mb: '2px', fontSize: '1.25rem' }} />
      )}
      <Typography variant="body2" sx={{ display: 'inline' }}>
        {emptyMessage}
      </Typography>
      {emptyActionCallback && (
        <>
          &nbsp;
          <ButtonNaked
            data-testid="callToActionFirst"
            onClick={emptyActionCallback}
            sx={{ verticalAlign: 'unset' }}
          >
            <Typography color="primary" variant="body2" fontWeight={'bold'}>
              {emptyActionLabel}
            </Typography>
          </ButtonNaked>
        </>
      )}
      {secondaryMessage.emptyMessage && (
        <>
          &nbsp;
          <Typography variant="body2" sx={{ display: 'inline' }}>
            {secondaryMessage.emptyMessage}
          </Typography>
        </>
      )}
      {secondaryMessage.emptyActionLabel && (
        <>
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
        </>
      )}
    </Box>
  );
}

export default EmptyState;
