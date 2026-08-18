import { useId, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';

import {
  LegalFactId,
  NotificationDetailRecipient,
  ReworkedStatus,
} from '../../../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineGroup,
} from '../../../models/NotificationTimeline';
import NotificationTimelineEventItem from './NotificationTimelineEventItem';
import { getTimelineGroupHeader } from './timelineGroupHeader.config';

type Props = {
  group: NotificationTimelineGroup;
  allEvents: Array<NotificationTimelineEvent>;
  recipients: Array<NotificationDetailRecipient>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads: boolean;
  language: string;
  hasMultipleAttempts?: boolean;
};

const NotificationTimelineGroupItem = ({
  group,
  allEvents,
  recipients,
  clickHandler,
  disableDownloads,
  language,
  hasMultipleAttempts = false,
}: Props) => {
  const generatedId = useId();
  const [expanded, setExpanded] = useState(false);

  const headerId = `timeline-group-header-${generatedId}`;
  const panelId = `timeline-group-panel-${generatedId}`;
  const { channel, icon: ChannelIcon, detail } = getTimelineGroupHeader(group, hasMultipleAttempts);
  const headerLabel = detail ? `${channel} · ${detail}` : channel;

  const hasReworkedItems = group.events.some(
    (event) => event.reworkedStatus === ReworkedStatus.VALID
  );

  return (
    <Box width="100%" data-testid="timeline-group">
      <ButtonBase
        id={headerId}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
        data-testid="timeline-group-header"
        sx={{
          width: '100%',
          gap: 1,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          textAlign: 'left',
          borderRadius: 1,
        }}
      >
        <Stack component="span" direction="row" spacing={1} alignItems="center">
          <ChannelIcon
            fontSize="small"
            sx={{ fontSize: '24px' }}
            data-testid="timeline-group-icon"
          />
          <Typography component="span" variant="body2" fontWeight={600}>
            {headerLabel}
          </Typography>
          {!!hasReworkedItems && <Tag variant="warning" value="Uno o piu eventi rettificati" />}
        </Stack>
        {expanded ? (
          <KeyboardArrowUpOutlinedIcon color="primary" />
        ) : (
          <KeyboardArrowDownOutlinedIcon color="primary" />
        )}
      </ButtonBase>

      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <Box
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          component="ul"
          data-testid="timeline-group-body"
          sx={{ listStyleType: 'disc', pl: 10, my: 1, display: 'grid', rowGap: 1 }}
        >
          {group.events.map((event) => (
            <NotificationTimelineEventItem
              key={event.elementId}
              event={event}
              allEvents={allEvents}
              recipients={recipients}
              clickHandler={clickHandler}
              disableDownloads={disableDownloads}
              language={language}
              asBullet
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default NotificationTimelineGroupItem;
