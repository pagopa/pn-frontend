import { useTranslation } from 'react-i18next';

import { Box, Stack, Typography } from '@mui/material';
import { NotificationTimelineEventDate } from '@pagopa-pn/pn-commons';
import { Tag, themeNext } from '@pagopa/mui-italia';

import { BffInformalNotificationTimelineGroup } from '../../generated-client/informal-notifications';
import {
  INFORMAL_CHANNEL_ICON,
  IO_TAG_ICON,
  InformalTimelineEventView,
  getChannelLabelKey,
  getInformalTimelineEvents,
} from '../../utility/informalNotificationTimeline.utility';

type Props = {
  step: BffInformalNotificationTimelineGroup;
  filedDate?: string;
};

const InformalNotificationTimelineChannelStep: React.FC<Props> = ({ step, filedDate }) => {
  const { t, i18n } = useTranslation('campaigns');

  const events = getInformalTimelineEvents(step, filedDate);

  const ChannelIcon = INFORMAL_CHANNEL_ICON[step.channel];

  const getEventLabel = ({ key, values, raw }: InformalTimelineEventView) =>
    raw ? key : t(`informal.timeline.event.${key}`, values);

  return (
    <Stack direction="column" spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        minWidth={0}
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
      >
        <ChannelIcon sx={{ fontSize: '24px', flexShrink: 0 }} />
        <Typography
          fontWeight={600}
          fontSize="14px"
          lineHeight="20px"
          sx={{ overflowWrap: 'anywhere' }}
        >
          {t(getChannelLabelKey(step.channel))}
        </Typography>
      </Stack>
      {events.length > 0 && (
        <Box
          component="ul"
          data-testid="timeline-group-body"
          sx={{
            listStyleType: 'disc',
            pl: { xs: 3, sm: 5 },
            my: 1,
            display: 'grid',
            rowGap: 1,
          }}
        >
          {events.map((event) => (
            <Stack
              component="li"
              key={event.id}
              sx={{ overflowWrap: 'anywhere', display: 'list-item', py: 1 }}
            >
              {event.tag && (
                // on mobile the tag goes on its own line, above the copy
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'flex', sm: 'inline-flex' },
                    width: 'fit-content',
                    verticalAlign: 'middle',
                    mr: 1,
                    mb: { xs: 0.5, sm: 0 },
                  }}
                >
                  <Tag
                    variant="default"
                    icon={IO_TAG_ICON[event.tag]}
                    value={t(`informal.detail.send-by-channel.status.${event.tag.toLowerCase()}`)}
                    slotProps={{
                      icon: { color: themeNext.colors.success[700] },
                    }}
                  />
                </Box>
              )}
              <Typography component="span" fontWeight={600} fontSize="14px" lineHeight="20px">
                {getEventLabel(event)}
              </Typography>
              {event.date && (
                <>
                  &nbsp;
                  <NotificationTimelineEventDate date={event.date} language={i18n.language} />
                </>
              )}
            </Stack>
          ))}
        </Box>
      )}
    </Stack>
  );
};

export default InformalNotificationTimelineChannelStep;
