import { Trans } from 'react-i18next';

import { Box, Typography, TypographyProps } from '@mui/material';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationStatusHistory,
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
  Pick<BaseProps, 'slotProps' | 'clickHandler'> & {
    legalFact: LegalFactId;
    children?: React.ReactNode;
  }
> = ({ slotProps, legalFact, clickHandler, children }) => (
  <MIButton
    {...slotProps?.button}
    variant="text"
    onClick={() => clickHandler(legalFact)}
    sx={{
      textDecoration: 'underline',
      verticalAlign: 'baseline',
      ...slotProps?.button?.sx,
      fontWeight: 400,
    }}
  >
    {children}
  </MIButton>
);

const NotificationTimelineDescription: React.FC<Props> = ({
  title,
  description,
  date,
  language,
  clickHandler,
  slotProps,
  isNewTimelineCopyEnabled = false,
  ...rest
}) => {
  const { legacyStatus, status, event } = rest;
  // eslint-disable-next-line functional/no-let
  let legalFactsIds: Array<{
    event: NotificationTimelineEvent | INotificationDetailTimeline;
    lf: LegalFactId;
  }> = [];

  if (event) {
    legalFactsIds = event.legalFactsIds?.map((lf) => ({ event, lf })) ?? [];
  } else if (status) {
    legalFactsIds = getStatusLegalFacts(status.steps);
  } else {
    legalFactsIds = getLegacyStatusLegalFacts(legacyStatus.steps);
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
      {(!isNewTimelineCopyEnabled || legalFactsIds.length > 1) &&
        legalFactsIds.map((legalFact) => (
          <NotificationTimelineEventLegalFact
            key={legalFact.lf.key}
            legalFact={legalFact.lf}
            clickHandler={clickHandler}
            slotProps={{ ...slotProps, button: { sx: { display: 'block' } } }}
          >
            {getLegalFactLabel(legalFact.event, legalFact.lf.category, legalFact.lf.key || '')}
          </NotificationTimelineEventLegalFact>
        ))}
    </Box>
  );
};

export default NotificationTimelineDescription;
