import { Trans } from 'react-i18next';

import { Box, Typography, TypographyProps } from '@mui/material';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationStatusHistory,
  TimelineCategory,
} from '../../../models';
import {
  NotificationTimelineEvent,
  NotificationTimelineLegacyStatusHistory,
} from '../../../models/NotificationTimeline';
import { getLegalFactLabel } from '../../../utility';
import {
  getLegacyStatusLegalFacts,
  getStatusLegalFacts,
} from '../../../utility/notificationTimeline.utility';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';

type BaseProps = {
  title?: string;
  description: string;
  date?: string;
  language?: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  slotProps?: {
    typography?: TypographyProps;
    button?: MIButtonProps;
  };
  isNewTimelineCopyEnabled?: boolean;
};

type EventProps = BaseProps & {
  event: NotificationTimelineEvent;
  status?: never;
  legacyStatus?: never;
};

type StatusProps = BaseProps & {
  status: NotificationTimelineLegacyStatusHistory;
  event?: never;
  legacyStatus?: never;
};

type LegacyStatusProps = BaseProps & {
  legacyStatus: NotificationStatusHistory;
  event?: never;
  status?: never;
};

type Props = EventProps | StatusProps | LegacyStatusProps;

const NotificationTimelineEventLegalFact: React.FC<
  Pick<
    BaseProps,
    'slotProps' | 'clickHandler' | 'disableDownloads' | 'isNewTimelineCopyEnabled'
  > & {
    legalFact: LegalFactId;
    children?: React.ReactNode;
    dataTestId?: string;
  }
> = ({
  slotProps,
  legalFact,
  clickHandler,
  children,
  disableDownloads,
  dataTestId,
  isNewTimelineCopyEnabled,
}) => {
  const buttonLayout = !isNewTimelineCopyEnabled
    ? {
        fontSize: '14px',
        justifyContent: 'flex-start',
        display: 'flex',
        textAlign: 'left',
      }
    : {
        textDecoration: 'underline',
        verticalAlign: 'baseline',
        ...slotProps?.button?.sx,
        fontWeight: 400,
      };

  return (
    <MIButton
      {...slotProps?.button}
      variant="text"
      onClick={() => clickHandler(legalFact)}
      disabled={disableDownloads}
      sx={buttonLayout}
      data-testid={dataTestId}
    >
      {children}
    </MIButton>
  );
};

function getLegalFacts(
  event?: NotificationTimelineEvent,
  status?: NotificationTimelineLegacyStatusHistory,
  legacyStatus?: NotificationStatusHistory
): Array<{
  event: NotificationTimelineEvent | INotificationDetailTimeline;
  lf: LegalFactId;
}> {
  if (event) {
    return event.legalFactsIds?.map((lf) => ({ event, lf })) ?? [];
  } else if (status) {
    return getStatusLegalFacts(status);
  } else {
    return getLegacyStatusLegalFacts(legacyStatus);
  }
}

const NotificationTimelineDescription: React.FC<Props> = ({
  title,
  description,
  date,
  language,
  clickHandler,
  disableDownloads = false,
  slotProps,
  isNewTimelineCopyEnabled = false,
  ...rest
}) => {
  const { legacyStatus, status, event } = rest;

  const legalFactsIds = getLegalFacts(event, status, legacyStatus);

  if (legacyStatus) {
    console.log(legacyStatus);
  }

  return (
    <Box>
      <Typography {...slotProps?.typography}>
        {title && (
          <>
            <Typography component="span" variant="body2" fontWeight={600}>
              {title}
            </Typography>
            {' - '}
          </>
        )}
        {isNewTimelineCopyEnabled && legalFactsIds.length <= 1 && (
          <Trans
            i18nKey="description" // this is fake and is needed to run trans functionality
            t={() => description}
            components={legalFactsIds.map((legalFact) => (
              <NotificationTimelineEventLegalFact
                key={legalFact.lf.key}
                legalFact={legalFact.lf}
                clickHandler={clickHandler}
                slotProps={slotProps}
                disableDownloads={
                  disableDownloads &&
                  legalFact.event.category !== TimelineCategory.NOTIFICATION_CANCELLED
                }
                dataTestId={
                  status || legacyStatus ? 'download-legalfact' : 'download-legalfact-micro'
                }
                isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
              />
            ))}
          />
        )}
        {(!isNewTimelineCopyEnabled || legalFactsIds.length > 1) && (
          <Trans
            i18nKey="description" // this is fake and is needed to run trans functionality
            t={() => description}
            components={[]}
          />
        )}
        {date && language && (
          <>
            &nbsp;
            <NotificationTimelineEventDate date={date} language={language} />
          </>
        )}
      </Typography>
      {event &&
        (!isNewTimelineCopyEnabled || legalFactsIds.length > 1) &&
        legalFactsIds.map((legalFact) => (
          <NotificationTimelineEventLegalFact
            key={legalFact.lf.key}
            legalFact={legalFact.lf}
            clickHandler={clickHandler}
            slotProps={{ ...slotProps, button: { sx: { display: 'block' } } }}
            disableDownloads={
              disableDownloads &&
              legalFact.event.category !== TimelineCategory.NOTIFICATION_CANCELLED
            }
            dataTestId={status || legacyStatus ? 'download-legalfact' : 'download-legalfact-micro'}
            isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
          >
            {getLegalFactLabel(legalFact.event, legalFact.lf.category, legalFact.lf.key || '')}
          </NotificationTimelineEventLegalFact>
        ))}
    </Box>
  );
};

export default NotificationTimelineDescription;
