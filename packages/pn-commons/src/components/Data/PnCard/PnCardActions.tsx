import { Children, ReactChild, ReactFragment, isValidElement } from 'react';

import { Box, CardActions } from '@mui/material';

export interface IPnCardActionsProps {
  testId?: string;
  disableSpacing?: boolean;
  children: ReactChild | ReactFragment | Array<ReactChild>;
}

const PnCardActions: React.FC<IPnCardActionsProps> = ({
  testId,
  disableSpacing = true,
  children,
}) => (
  <CardActions disableSpacing={disableSpacing} data-testid={testId} className={'card-actions'}>
    {Children.map(children, (child) =>
      isValidElement(child) ? (
        <Box sx={{ ml: 'auto' }} key={child.key}>
          {child}
        </Box>
      ) : (
        child
      )
    )}
  </CardActions>
);

export default PnCardActions;
