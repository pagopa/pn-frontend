import { ReactNode } from 'react';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Stack, Typography } from '@mui/material';
import { MIButton, MIChip, MIChipProps, MIPaper } from '@pagopa/mui-italia';

type NotificationStatusBoxProps = {
  ariaLabel: string;
  color: MIChipProps['color'];
  description: ReactNode;
  label: string;
  detailsLabel: string;
  onDetailsClick?: () => void;
  title: string;
};

const NotificationStatusBox = ({
  ariaLabel,
  color,
  description,
  label,
  detailsLabel,
  onDetailsClick,
  title,
}: NotificationStatusBoxProps) => (
  <MIPaper padding={24} data-testid="NotificationDetailTimeline">
    <Stack spacing={1} alignItems="flex-start">
      <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <MIChip color={color} variant="filled" label={label} sx={{ my: 1, width: 'fit-content' }} />
      {typeof description === 'string' ? (
        <Typography variant="body2">{description}</Typography>
      ) : (
        description
      )}
      <MIButton aria-label={ariaLabel} onClick={onDetailsClick} variant="text">
        {detailsLabel} <KeyboardArrowRightRoundedIcon />
      </MIButton>
    </Stack>
  </MIPaper>
);

export default NotificationStatusBox;
