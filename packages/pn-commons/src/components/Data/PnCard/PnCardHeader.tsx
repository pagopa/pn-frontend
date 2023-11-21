import { Children } from 'react';

import { CardHeader, Grid, GridProps } from '@mui/material';

import PnCardHeaderItem from './PnCardHeaderItem';

type Props = {
  testId?: string;
  headerGridProps?: GridProps;
  children: React.ReactNode;
};

const PnCardHeader: React.FC<Props> = ({ testId, children, headerGridProps }) => {
  const cells = children
    ? Children.toArray(children).filter((child) => (child as JSX.Element).type === PnCardHeaderItem)
    : [];

  if (cells.length === 0) {
    throw new Error('PnCardHeader must have at least one child');
  }

  if (cells.length > 2) {
    throw new Error('PnCardHeader must have a maximum of two children');
  }

  if (cells.length < Children.toArray(children).length) {
    throw new Error('PnCardHeader must have only children of type PnCardHeaderItem');
  }

  return (
    <CardHeader
      data-testid={testId}
      className={'card-header'}
      title={
        <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
          {cells}
        </Grid>
      }
    />
  );
};

export default PnCardHeader;
