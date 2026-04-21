import React from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { KnownSentiment, iconForKnownSentiment } from '../models/EmptyState';

type Props = {
  sentimentIcon?: KnownSentiment | SvgIconComponent | React.ReactNode;
  slots?: {
    contentContainer?: React.ElementType;
  };
  slotProps?: {
    contentContainer?: Record<string, unknown>;
  };
  children?: React.ReactNode;
};

const iconSx = {
  verticalAlign: 'middle',
  display: 'inline',
  mr: '20px',
  mb: '2px',
  fontSize: '1.25rem',
  color: 'action.active',
};

const linksSxProps = {
  cursor: 'pointer',
  display: 'inline',
  verticalAlign: 'unset',
  fontWeight: 'bold',
  fontSize: 'inherit',
};

const renderSentimentIcon = (sentimentIcon: Props['sentimentIcon']) => {
  if (React.isValidElement(sentimentIcon)) {
    return sentimentIcon;
  }
  if (typeof sentimentIcon === 'string') {
    const IconComponent = iconForKnownSentiment(sentimentIcon as KnownSentiment);
    return IconComponent ? <IconComponent sx={iconSx} /> : null;
  }
  if (typeof sentimentIcon === 'function') {
    const IconComponent = sentimentIcon as SvgIconComponent;
    return <IconComponent sx={iconSx} />;
  }
  return null;
};

const EmptyState: React.FC<Props> = ({
  sentimentIcon = KnownSentiment.DISSATISFIED,
  slots,
  slotProps,
  children,
}) => {
  const Container = slots?.contentContainer || Typography;
  const containerProps =
    Container === Typography
      ? {
          variant: 'body2' as const,
          sx: { display: 'inline', '& button': linksSxProps },
          ...slotProps?.contentContainer,
        }
      : slotProps?.contentContainer || {};

  return (
    <Box
      data-testid="emptyState"
      sx={{
        textAlign: 'center',
        my: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
      }}
    >
      {renderSentimentIcon(sentimentIcon)}
      <Container {...containerProps}>{children}</Container>
    </Box>
  );
};

export default EmptyState;
