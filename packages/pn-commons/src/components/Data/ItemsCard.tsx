import React from 'react';

import { Box, SxProps } from '@mui/material';

import ItemsCardBody, { IItemsCardBodyProps } from './ItemsCard/ItemsCardBody';

type Props = {
  /** Custom style */
  sx?: SxProps;
  /** Cards test id */
  testId?: string;
  children?:
    | Array<React.ReactElement<IItemsCardBodyProps>>
    | React.ReactElement<IItemsCardBodyProps>;
};

const cardStyle = {
  '& .card-header': {
    padding: 0,
  },
  '& .card-actions': {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
};

const ItemsCard: React.FC<Props> = ({ sx, testId = 'mobileCards', children }) => {
  const cardBodies = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsCardBody)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.body` })
            : child
        )
    : [];
  return (
    <Box sx={{ ...cardStyle, ...sx }} data-testid={testId}>
      {cardBodies}
    </Box>
  );
};

export default ItemsCard;
