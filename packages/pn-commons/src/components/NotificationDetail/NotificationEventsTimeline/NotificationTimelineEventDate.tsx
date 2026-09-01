import { Box } from '@mui/material';

import { formatTimelineDate } from '../../../utility';

const NotificationTimelineEventDate = ({ date, language }: { date: string; language: string }) => (
  <Box component="span" sx={{ fontSize: '12px' }} data-testid="dateItem">
    {formatTimelineDate(date, language)}
  </Box>
);

export default NotificationTimelineEventDate;
