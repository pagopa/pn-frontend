import React from 'react';

import { CardHeader, Grid, GridProps } from '@mui/material';

import ItemsCardHeaderTitle, { IItemsCardHeaderTitleProps } from './ItemsCardHeaderTitle';

export interface IItemsCardHeaderProps {
  testId?: string;
  headerGridProps?: GridProps;
  children?:
    | React.ReactElement<IItemsCardHeaderTitleProps>
    | [
        React.ReactElement<IItemsCardHeaderTitleProps>,
        React.ReactElement<IItemsCardHeaderTitleProps> | null
      ];
}
const ItemsCardHeader: React.FC<IItemsCardHeaderProps> = ({
  testId,
  children,
  headerGridProps,
}) => {
  const cells = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardHeaderTitle)
        .map((child) =>
          React.isValidElement(child) ? React.cloneElement(child, { ...child.props }) : child
        )
    : [];
  return (
    <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
      <CardHeader data-testid={testId} className={'card-header'} title={cells} />
    </Grid>
  );
};

export default ItemsCardHeader;
