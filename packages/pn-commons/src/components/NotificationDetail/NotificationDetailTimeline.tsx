import { Fragment } from 'react';

import { Grid } from '@mui/material';
import { MITimeline, MITimelineItem } from '@pagopa/mui-italia';

import {
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
} from '../../models/NotificationDetail';
import getNotificationDetailTimelineItems from './NotificationDetailTimelineStep';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  isParty?: boolean;
  language?: string;
};

/**
 * This component is responsible for rendering a timeline of notification details.
 * The component's render function returns a JSX structure that includes:
 * A grid container.
 * A timeline of notification details based on the statusHistory prop.
 * @param recipients list of recipients
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param disableDownloads for disable downloads
 * @param isParty for specific render of notification
 * @param language used to translate months in timeline
 */
const NotificationDetailTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  disableDownloads = false,
  isParty = true,
  language = 'it',
}: Props) => {
  const timelineItems = statusHistory.flatMap((timelineStep, index) =>
    getNotificationDetailTimelineItems({
      timelineStep,
      statusHistory,
      recipients,
      clickHandler,
      disableDownloads,
      isParty,
      isFirst: index === 0,
      language,
    })
  );

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-testid="NotificationDetailTimeline"
      ></Grid>
      <MITimeline>
        {timelineItems.map(({ key, content, ...itemProps }) => (
          <MITimelineItem key={key} {...itemProps}>
            {content}
          </MITimelineItem>
        ))}
      </MITimeline>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
