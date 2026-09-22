import { Trans } from 'react-i18next';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Link, Typography, TypographyProps } from '@mui/material';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailRecipient,
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
  recipients?: Array<NotificationDetailRecipient>;
  isSenderTimeline?: boolean;
  perfectionLink?: string;
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
    underAStatus?: boolean;
  }
> = ({
  slotProps,
  legalFact,
  clickHandler,
  children,
  disableDownloads,
  dataTestId,
  isNewTimelineCopyEnabled,
  underAStatus = false,
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
      startIcon={underAStatus && !isNewTimelineCopyEnabled ? <AttachFileIcon /> : undefined}
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
    return getStatusLegalFacts(status.steps);
  } else {
    return getLegacyStatusLegalFacts(legacyStatus?.steps);
  }
}

function getLegalFactRecipient(
  legalFactEvent: NotificationTimelineEvent | INotificationDetailTimeline,
  isSenderTimeline: boolean,
  recipients?: Array<NotificationDetailRecipient>
) {
  if (!isSenderTimeline || !recipients || recipients.length <= 1) {
    return undefined;
  }

  const recIndex = legalFactEvent.details.recIndex;
  return recIndex !== undefined ? recipients[recIndex] : undefined;
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
  recipients,
  isSenderTimeline = false,
  perfectionLink,
  ...rest
}) => {
  const { legacyStatus, status, event } = rest;

  const legalFactsIds = getLegalFacts(event, status, legacyStatus);

  const perfectionLinkComponent: Record<string, React.ReactElement> = perfectionLink
    ? {
        PerfectionLink: (
          <Link
            href={perfectionLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ...slotProps?.button?.sx, fontWeight: 400 }}
            data-testid="perfection-link"
          />
        ),
      }
    : {};

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
            components={{
              ...legalFactsIds.map((legalFact) => (
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
              )),
              ...perfectionLinkComponent,
            }}
          />
        )}
        {(!isNewTimelineCopyEnabled || legalFactsIds.length > 1) && (
          <Trans
            i18nKey="description" // this is fake and is needed to run trans functionality
            t={() => description}
            components={perfectionLinkComponent}
          />
        )}
        {date && language && (
          <>
            &nbsp;
            <NotificationTimelineEventDate date={date} language={language} />
          </>
        )}
      </Typography>
      {(!isNewTimelineCopyEnabled || legalFactsIds.length > 1) &&
        legalFactsIds.map((legalFact) => {
          const recipient = getLegalFactRecipient(legalFact.event, isSenderTimeline, recipients);
          const recipientLabel =
            !!(status ?? legacyStatus) && recipient
              ? ` - ${recipient.denomination} (${recipient.taxId})`
              : '';

          return (
            <NotificationTimelineEventLegalFact
              key={legalFact.lf.key}
              legalFact={legalFact.lf}
              clickHandler={clickHandler}
              slotProps={{ ...slotProps, button: { sx: { display: 'block' } } }}
              disableDownloads={
                disableDownloads &&
                legalFact.event.category !== TimelineCategory.NOTIFICATION_CANCELLED
              }
              dataTestId={
                status || legacyStatus ? 'download-legalfact' : 'download-legalfact-micro'
              }
              underAStatus={!!(status ?? legacyStatus)}
              isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
            >
              {`${getLegalFactLabel(
                legalFact.event,
                legalFact.lf.category,
                legalFact.lf.key || ''
              )}${recipientLabel}`}
            </NotificationTimelineEventLegalFact>
          );
        })}
    </Box>
  );
};

export default NotificationTimelineDescription;
