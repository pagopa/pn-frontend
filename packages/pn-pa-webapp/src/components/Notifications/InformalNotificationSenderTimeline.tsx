import { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { DraftsOutlined, InfoRounded, MarkEmailReadOutlined } from '@mui/icons-material';
import { Divider, Stack, SvgIconProps, Typography } from '@mui/material';
import {
  MailOffRounded,
  NotificationTimelineEventDate,
  OutgoingEmailRounded,
  SearchCheckRounded,
} from '@pagopa-pn/pn-commons';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import {
  BffInformalNotificationTimelineStatusHistoryV1,
  CommunicationOutcomes,
  InformalNotificationStatusV1,
} from '../../generated-client/informal-notifications';
import { getInformalTimelineSteps } from '../../utility/informalNotificationTimeline.utility';
import InformalNotificationTimelineChannelStep from './InformalNotificationTimelineChannelStep';

type Props = {
  statusHistory: Array<BffInformalNotificationTimelineStatusHistoryV1>;
  communicationOutcomes: CommunicationOutcomes;
};

type TimelineItemPresentation = {
  statusKey: string;
  icon: ComponentType<SvgIconProps>;
  variant?: 'warning' | 'error' | 'success' | 'info' | 'normal';
};

const TIMELINE_ITEM_PRESENTATION: Partial<
  Record<InformalNotificationStatusV1, TimelineItemPresentation>
> = {
  ACCEPTED: {
    statusKey: 'accepted',
    icon: SearchCheckRounded,
  },
  PROCESSING: {
    statusKey: 'processing',
    icon: OutgoingEmailRounded,
  },
  COMPLETED_REACHED: {
    statusKey: 'completed',
    icon: SearchCheckRounded,
  },
  COMPLETED_UNREACHED: {
    statusKey: 'completed',
    icon: SearchCheckRounded,
  },
  UNDELIVERABLE: {
    statusKey: 'undeliverable',
    icon: MailOffRounded,
    variant: 'error',
  },
};

const InformalTimelineItemDescription = ({
  description,
  date,
}: {
  description?: string;
  date?: string;
}) => {
  const { i18n } = useTranslation();

  return (
    <Typography fontSize="14px" lineHeight="20px" sx={{ mt: 0.5 }}>
      {description}

      {date && (
        <>
          &nbsp;
          <NotificationTimelineEventDate date={date} language={i18n.language} />
        </>
      )}
    </Typography>
  );
};

const InformalNotificationSenderTimeline = ({ statusHistory, communicationOutcomes }: Props) => {
  const { t } = useTranslation('campaigns');

  const filedDate = statusHistory.find(
    (item) => item.status === InformalNotificationStatusV1.Accepted
  )?.activeFrom;

  return (
    <MITimeline>
      {communicationOutcomes.viewed && (
        <MITimelineItem
          variant="success"
          icon={DraftsOutlined}
          title={t('informal.timeline.outcome.viewed.title')}
        >
          {t('informal.timeline.outcome.viewed.description')}
        </MITimelineItem>
      )}

      {!communicationOutcomes.viewed && communicationOutcomes.delivered && (
        <MITimelineItem
          variant="success"
          icon={MarkEmailReadOutlined}
          title={t('informal.timeline.outcome.delivered.title')}
        >
          {t('informal.timeline.outcome.delivered.description')}
        </MITimelineItem>
      )}

      {statusHistory.map((item) => {
        const presentation = TIMELINE_ITEM_PRESENTATION[item.status];

        return (
          <MITimelineItem
            key={`${item.status}-${item.activeFrom}`}
            variant={presentation?.variant ?? 'normal'}
            icon={presentation?.icon ?? InfoRounded}
            title={presentation && t(`informal.status.${presentation.statusKey}.label`)}
          >
            {item.status !== InformalNotificationStatusV1.Processing ? (
              <InformalTimelineItemDescription
                description={
                  presentation && t(`informal.status.${presentation.statusKey}.description`)
                }
                date={
                  item.status === InformalNotificationStatusV1.Accepted
                    ? item.activeFrom
                    : undefined
                }
              />
            ) : (
              <Stack spacing={1.5} divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                {getInformalTimelineSteps(item.steps).map((step, stepIndex) => (
                  <InformalNotificationTimelineChannelStep
                    key={`step-${step.channel}-${stepIndex}`}
                    step={step}
                    filedDate={filedDate}
                  />
                ))}
              </Stack>
            )}
          </MITimelineItem>
        );
      })}
    </MITimeline>
  );
};

export default InformalNotificationSenderTimeline;
