import { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';
import { IllusMIError, IllusMIMessage, MIButton } from '@pagopa/mui-italia';

import EmptyState from './EmptyState';

type DefaultAction = {
  label: ReactNode;
  onClick: () => void;
};

type EmptyErrorStateProps = {
  title: ReactNode;
  description?: ReactNode;
  variant?: 'empty' | 'error';
  action?: DefaultAction | ReactNode;
};

const CONTAINER_PROPS = {
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

const isDefaultAction = (action: DefaultAction | ReactNode): action is DefaultAction =>
  typeof action === 'object' && action !== null && 'label' in action && 'onClick' in action;

const EmptyErrorState = ({
  title,
  description,
  variant = 'empty',
  action,
}: EmptyErrorStateProps) => (
  <EmptyState
    slots={{ contentContainer: Box }}
    slotProps={{ contentContainer: CONTAINER_PROPS }}
    sentimentIcon={variant === 'error' ? <IllusMIError size={56} /> : <IllusMIMessage size={56} />}
  >
    <Typography
      variant="subtitle2"
      fontSize="16px"
      color="text.secondary"
      mb={description ? 1 : action ? 2 : 0}
    >
      {title}
    </Typography>

    {description && (
      <Typography variant="body2" fontSize="14px" color="text.secondary" mb={action ? 2 : 0}>
        {description}
      </Typography>
    )}

    {action &&
      (isDefaultAction(action) ? (
        <MIButton variant="text" onClick={action.onClick}>
          {action.label}
        </MIButton>
      ) : (
        action
      ))}
  </EmptyState>
);

export default EmptyErrorState;
