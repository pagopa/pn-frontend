import { Trans } from 'react-i18next';

import { Box, Link, Typography, TypographyProps } from '@mui/material';
import { MIButton, MIButtonProps } from '@pagopa/mui-italia';

import { INotificationDetailTimeline, LegalFactId, TimelineCategory } from '../../../models';
import { NotificationTimelineEvent } from '../../../models/NotificationTimeline';
import { getLegalFactLabel } from '../../../utility';
import { StatusLegalFact } from '../../../utility/notificationTimeline.utility';
import NotificationTimelineEventDate from './NotificationTimelineEventDate';

type Props = {
  title?: string;
  description: string;
  date?: string;
  language?: string;
  clickHandler: (legalFactId: LegalFactId) => void;
  disableDownloads?: boolean;
  perfectionLink?: string;
  slotProps?: {
    typography?: TypographyProps;
    button?: MIButtonProps;
  };
  isNewTimelineCopyEnabled?: boolean;
  event?: NotificationTimelineEvent;
  legalFacts: Array<StatusLegalFact<NotificationTimelineEvent | INotificationDetailTimeline>>;
};

const NotificationTimelineEventLegalFact: React.FC<
  Pick<Props, 'slotProps' | 'clickHandler' | 'disableDownloads' | 'isNewTimelineCopyEnabled'> & {
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

const NotificationTimelineDescription: React.FC<Props> = ({
  title,
  description,
  date,
  language,
  clickHandler,
  disableDownloads = false,
  slotProps,
  isNewTimelineCopyEnabled = false,
  legalFacts,
  event,
  perfectionLink,
}) => {
  // inline only makes sense with the new copy, where the description text contains the placeholder
  const inlineLegalFact =
    isNewTimelineCopyEnabled && legalFacts.length === 1 ? legalFacts[0] : undefined;

  const legalFactsToList = inlineLegalFact ? [] : legalFacts;

  const downloadIsDisabled = (category: TimelineCategory) =>
    disableDownloads && category !== TimelineCategory.NOTIFICATION_CANCELLED;

  const emptySlot = <span />;

  const legalFactSlot = inlineLegalFact ? (
    <NotificationTimelineEventLegalFact
      legalFact={inlineLegalFact.lf}
      clickHandler={clickHandler}
      slotProps={slotProps}
      disableDownloads={downloadIsDisabled(inlineLegalFact.event.category)}
      dataTestId={event ? 'download-legalfact-micro' : 'download-legalfact'}
      isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
    />
  ) : (
    emptySlot
  );

  const perfectionLinkSlot = perfectionLink ? (
    <Link
      href={perfectionLink}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ ...slotProps?.button?.sx, fontWeight: 400 }}
      data-testid="perfection-link"
    />
  ) : (
    emptySlot
  );

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
        <Trans
          i18nKey="description" // this is fake and is needed to run trans functionality
          t={() => description}
          components={[legalFactSlot, perfectionLinkSlot]}
        />
        {date && language && (
          <>
            &nbsp;
            <NotificationTimelineEventDate date={date} language={language} />
          </>
        )}
      </Typography>
      {legalFactsToList.map((legalFact) => (
        <NotificationTimelineEventLegalFact
          key={legalFact.lf.key}
          legalFact={legalFact.lf}
          clickHandler={clickHandler}
          slotProps={{ ...slotProps, button: { sx: { display: 'block' } } }}
          disableDownloads={downloadIsDisabled(legalFact.event.category)}
          dataTestId="download-legalfact-micro"
          isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
        >
          {getLegalFactLabel(legalFact.event, legalFact.lf.category, legalFact.lf.key || '')}
        </NotificationTimelineEventLegalFact>
      ))}
    </Box>
  );
};

export default NotificationTimelineDescription;
