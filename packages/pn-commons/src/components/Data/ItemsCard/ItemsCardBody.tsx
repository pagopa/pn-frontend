import React from 'react';

import { Card } from '@mui/material';

import ItemsCardActions, { IItemsCardActionsProps } from './ItemsCardActions';
import ItemsCardContents, { IItemsCardContentsProps } from './ItemsCardContents';
import ItemsCardHeader, { IItemsCardHeaderProps } from './ItemsCardHeader';

export interface IItemsCardBodyProps {
  testId?: string;
  children?:
    | Array<React.ReactElement<IItemsCardHeaderProps>>
    | React.ReactElement<IItemsCardHeaderProps>
    | Array<React.ReactElement<IItemsCardContentsProps>>
    | React.ReactElement<IItemsCardContentsProps>
    | Array<React.ReactElement<IItemsCardActionsProps>>
    | React.ReactElement<IItemsCardActionsProps>;
}

const ItemsCardBody: React.FC<IItemsCardBodyProps> = ({ testId = 'itemCard', children }) => {
  const header = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardHeader)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.header` })
            : child
        )
    : [];
  const contents = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardContents)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.contents` })
            : child
        )
    : [];
  const actions = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardActions)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.actions` })
            : child
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
      {contents}
      {actions}
    </Card>
  );
};

export default ItemsCardBody;
