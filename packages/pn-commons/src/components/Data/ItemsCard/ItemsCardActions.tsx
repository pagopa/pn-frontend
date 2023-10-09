import React from 'react';

import { CardActions } from '@mui/material';

import ItemsCardAction from './ItemsCardAction';

type Props = {
  testId?: string;
  disableSpacing?: boolean;
  className?: string;
};

const ItemsCardActions: React.FC<Props> = ({
  testId,
  disableSpacing = true,
  className = 'card-actions',
  children,
}) => {
  const actions = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsCardAction
      )
    : [];
  return (
    <CardActions disableSpacing={disableSpacing} data-testid={testId} className={className}>
      {actions}
    </CardActions>
  );
};

export default ItemsCardActions;
