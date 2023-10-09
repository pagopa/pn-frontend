import React from 'react';

import { Card } from '@mui/material';

import ItemsCardActions from './ItemsCardActions';
import ItemsCardContents from './ItemsCardContents';
import ItemsCardHeader from './ItemsCardHeader';

type Props = {
  testId?: string;
};

const ItemsCardBody: React.FC<Props> = ({ testId = 'itemCard', children }) => {
  const header = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsCardHeader
      )
    : [];
  const body = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsCardContents
      )
    : [];
  const actions = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsCardActions
      )
    : [];
  return (
    <Card
      raised
      data-testid={testId}
      sx={{
        mb: 2,
        p: 3,
      }}
    >
      {header}
      {body}
      {actions}
    </Card>
  );
};

export default ItemsCardBody;
