import { Children, cloneElement, isValidElement } from 'react';

import { Box, CardActions } from '@mui/material';

export interface IPnCardActionsProps {
  testId?: string;
  disableSpacing?: boolean;
  children: React.ReactNode;
}

const PnCardActions: React.FC<IPnCardActionsProps> = ({
  testId,
  disableSpacing = true,
  children,
}) => {
  const actions = children
    ? Children.toArray(children).map((child) =>
        isValidElement(child) ? (
          <Box sx={{ ml: 'auto' }} data-testid={`${testId}.action`} key={child.key}>
            {cloneElement(child)}
          </Box>
        ) : (
          child
        )
      )
    : [];

  return (
    <CardActions disableSpacing={disableSpacing} data-testid={testId} className={'card-actions'}>
      {actions}
    </CardActions>
  );
};

export default PnCardActions;
