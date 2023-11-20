import { Children, cloneElement, isValidElement } from 'react';

import { Box, SxProps } from '@mui/material';

import PnCard from './PnCard/PnCard';

type Props = {
  /** Custom style */
  sx?: SxProps;
  /** Cards test id */
  testId?: string;
  children: React.ReactNode;
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

const PnCardsList: React.FC<Props> = ({ sx, testId = 'mobileCards', children }) => {
  const cards = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnCard)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.body` })
            : child
        )
    : [];

  if (cards.length === 0) {
    throw new Error('PnCardsList must have at least one child');
  }

  if (cards.length < Children.toArray(children).length) {
    throw new Error('PnCardsList must have only children of type PnCard');
  }

  return (
    <Box sx={{ ...cardStyle, ...sx }} data-testid={testId}>
      {cards}
    </Box>
  );
};

export default PnCardsList;
