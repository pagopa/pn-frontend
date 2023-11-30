import { Children, ReactElement, isValidElement } from 'react';

import { CardHeader, Grid, GridProps } from '@mui/material';

import PnCardHeaderItem from './PnCardHeaderItem';

type Props = {
  testId?: string;
  headerGridProps?: GridProps;
  children: ReactElement | [ReactElement, ReactElement];
};

const PnCardHeader: React.FC<Props> = ({ testId, children, headerGridProps }) => {
  // check on children
  // PnCardHeader can have max two children of type PnCardHeaderItem
  // the cast ReactElement | [ReactElement, ReactElement] of property children
  // ensures that the PnCardHeader can have two defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnCardHeaderItem) {
      throw new Error('PnCardHeader must have only children of type PnCardHeaderItem');
    }
  });

  return (
    <CardHeader
      data-testid={testId}
      className={'card-header'}
      title={
        <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
          {children}
        </Grid>
      }
    />
  );
};

export default PnCardHeader;
