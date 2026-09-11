import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Stack } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { LegalFactId, TimelineCategory } from '../../../models/NotificationDetail';
import { NotificationTimelineEvent } from '../../../models/NotificationTimeline';
import { getLegalFactLabel } from '../../../utility/notification.utility';

type Props = {
  event: NotificationTimelineEvent;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads: boolean;
  withIcon?: boolean;
  testId?: 'download-legalfact' | 'download-legalfact-micro';
};

const TimelineLegalFacts = ({
  event,
  clickHandler,
  disableDownloads,
  withIcon = false,
  testId = 'download-legalfact-micro',
}: Props) => {
  if (!event.legalFactsIds?.length) {
    return null;
  }

  return (
    <Stack component="span" alignItems="flex-start">
      {event.legalFactsIds.map((legalFact) => (
        <ButtonNaked
          key={legalFact.key}
          fontSize={14}
          color="primary"
          startIcon={withIcon ? <AttachFileIcon /> : undefined}
          onClick={() => clickHandler(legalFact)}
          data-testid={testId}
          disabled={event.category !== TimelineCategory.NOTIFICATION_CANCELLED && disableDownloads}
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          {getLegalFactLabel(event, legalFact.category, legalFact.key || '')}
        </ButtonNaked>
      ))}
    </Stack>
  );
};

export default TimelineLegalFacts;
