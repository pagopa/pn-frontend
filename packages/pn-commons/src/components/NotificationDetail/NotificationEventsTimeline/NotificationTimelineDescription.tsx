import { Trans } from 'react-i18next';

import { Box, Typography, TypographyProps } from '@mui/material';
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
  slotProps?: {
    typography?: TypographyProps;
    button?: MIButtonProps;
  };
  isNewTimelineCopyEnabled?: boolean;
  event?: NotificationTimelineEvent;
  inlineLegalFact?: StatusLegalFact<NotificationTimelineEvent | INotificationDetailTimeline>;
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
  inlineLegalFact,
  event,
}) => {
  // Event legal facts are always listed below the text, unless one of them was inlined.
  const legalFactsToList =
    event && !inlineLegalFact ? (event.legalFactsIds ?? []).map((lf) => ({ event, lf })) : [];

  const downloadIsDisabled = (category: TimelineCategory) =>
    disableDownloads && category !== TimelineCategory.NOTIFICATION_CANCELLED;

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
        {inlineLegalFact && (
          <Trans
            i18nKey="description" // this is fake and is needed to run trans functionality
            t={() => description}
            components={[
              <NotificationTimelineEventLegalFact
                key={inlineLegalFact.lf.key}
                legalFact={inlineLegalFact.lf}
                clickHandler={clickHandler}
                slotProps={slotProps}
                disableDownloads={downloadIsDisabled(inlineLegalFact.event.category)}
                dataTestId={event ? 'download-legalfact-micro' : 'download-legalfact'}
                isNewTimelineCopyEnabled={isNewTimelineCopyEnabled}
              />,
            ]}
          />
        )}
        {!inlineLegalFact && (
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
