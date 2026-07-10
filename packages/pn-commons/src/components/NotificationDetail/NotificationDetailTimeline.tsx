import { Fragment, useState } from 'react';

import { Grid } from '@mui/material';
import { TimelineNotification } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import {
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
} from '../../models/NotificationDetail';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';

type Props = {
  recipients: Array<NotificationDetailRecipient>;
  statusHistory: Array<NotificationStatusHistory>;
  clickHandler: (legalFactId: LegalFactId) => void;
  showMoreButtonLabel: string;
  showLessButtonLabel: string;
  disableDownloads?: boolean;
  isParty?: boolean;
  language?: string;
  handleTrackShowMoreLess?: (collapsed: boolean) => void;
};

/**
 * This component is responsible for rendering a timeline of notification details,
 * and it provides options to view the full timeline in a drawer for mobile users.
 * The component's render function returns a JSX structure that includes:
 * A grid container with a title.
 * A timeline of notification details (timelineComponent) based on the statusHistory prop.
 * A custom drawer component (CustomDrawer) that can be opened or closed by clicking an
 * icon. The drawer contains a copy of the timeline content, and its visibility
 * is controlled by the state variable.
 * @param recipients list of recipients
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param disableDownloads for disable downloads
 * @param isParty for specific render of notification
 * @param language used to translate months in timeline
 */
const NotificationDetailTimeline = ({
  recipients,
  statusHistory,
  clickHandler,
  showMoreButtonLabel,
  showLessButtonLabel,
  disableDownloads = false,
  isParty = true,
  language = 'it',
  handleTrackShowMoreLess,
}: Props) => {
  const [state, setState] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile && state) {
    setState(false);
  }

  const getPosition = (index: number): 'first' | 'last' | undefined => {
    if (index === 0) {
      return 'first';
    }
    if (index === statusHistory.length - 1) {
      return 'last';
    }
    return undefined;
  };

  const timelineComponent = statusHistory.map((t, i) => (
    <NotificationDetailTimelineStep
      timelineStep={t}
      statusHistory={statusHistory}
      recipients={recipients}
      position={getPosition(i)}
      clickHandler={clickHandler}
      key={`timeline_step_${t.status}_${i}`}
      showMoreButtonLabel={showMoreButtonLabel}
      showLessButtonLabel={showLessButtonLabel}
      handleTrackShowMoreLess={handleTrackShowMoreLess}
      disableDownloads={disableDownloads}
      isParty={isParty}
      language={language}
      reworkedStatus={t.reworkedStatus}
    />
  ));

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-testid="NotificationDetailTimeline"
      >
        {/* TODO: ripristinare quando sarà completata la issue pn-719 */}
        {/* <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti gli allegati</Button>
        </Grid> */}
      </Grid>
      {/* 
      If is mobile, then render a small preview of timeline with the possibility to open the customDrawer
      */}
      <TimelineNotification sx={{ my: isMobile ? 0 : 3, py: 0 }}>
        {timelineComponent}
      </TimelineNotification>
    </Fragment>
  );
};

export default NotificationDetailTimeline;
