import { Box } from '@mui/material';

import { formatDay, formatMonthString, formatTime } from '../../../utility';

const NotificationTimelineEventDate = ({ date, language }: { date: string; language: string }) => (
  <Box component="span" sx={{ fontSize: '12px' }} data-testid="dateItem">
    {`${formatDay(date)} ${formatMonthString(date, language)}, ${formatTime(date)}`}
  </Box>
);

export default NotificationTimelineEventDate;
