import { ReactChild, ReactFragment } from 'react';

import { Grid, GridProps } from '@mui/material';

export type PnCardHeaderItemProps = {
  gridProps?: GridProps;
  children: ReactChild | ReactFragment;
  position?: string;
  testId?: string;
};

const PnCardHeaderItem: React.FC<PnCardHeaderItemProps> = ({
  children,
  gridProps,
  position = 'left',
  testId,
}) => (
  <Grid
    item
    sx={{ textAlign: position, fontSize: '14px', fontWeight: 400 }}
    data-testid={testId}
    {...gridProps}
  >
    {children}
  </Grid>
);

export default PnCardHeaderItem;
