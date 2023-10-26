import React from 'react';

import { CardActions } from '@mui/material';

import ItemsCardAction, { IItemsCardActionProps } from './ItemsCardAction';

export interface IItemsCardActionsProps {
  testId?: string;
  disableSpacing?: boolean;
  className?: string;
  children?: Array<React.ReactElement<IItemsCardActionProps>>;
}

const ItemsCardActions: React.FC<IItemsCardActionsProps> = ({
  testId,
  disableSpacing = true,
  className = 'card-actions',
  children,
}) => {
  const actions = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardAction)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.action` })
            : child
        )
    : [];
  return (
    <CardActions disableSpacing={disableSpacing} data-testid={testId} className={className}>
      {actions}
    </CardActions>
  );
};

export default ItemsCardActions;
