import React from 'react';

import { CardContent } from '@mui/material';

import ItemsCardContent, { IItemsCardContentProps } from './ItemsCardContent';

export interface IItemsCardContentsProps {
  testId?: string;
  children?:
    | Array<React.ReactElement<IItemsCardContentProps>>
    | React.ReactElement<IItemsCardContentProps>;
}

const ItemsCardContents: React.FC<IItemsCardContentsProps> = ({ testId, children }) => {
  const contents = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardContent)
        .map((child: any) =>
          React.cloneElement(child, { ...child.props, testId: `${testId}.content` })
        )
    : [];
  return (
    <CardContent data-testid={testId} sx={{ padding: 0, mt: 2, ':last-child': { padding: 0 } }}>
      {contents}
    </CardContent>
  );
};

export default ItemsCardContents;
