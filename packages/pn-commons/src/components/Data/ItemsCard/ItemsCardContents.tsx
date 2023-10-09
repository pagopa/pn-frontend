import React from 'react';

import { CardContent } from '@mui/material';

import ItemsCardContent from './ItemsCardContent';

type Props = {
  testId?: string;
};

const ItemsCardContents: React.FC<Props> = ({ testId, children }) => {
  const contents = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsCardContent
      )
    : [];
  return (
    <CardContent data-testid={testId} sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 } }}>
      {contents}
    </CardContent>
  );
};

export default ItemsCardContents;
