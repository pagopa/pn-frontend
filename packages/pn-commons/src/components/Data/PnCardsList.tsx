import { Children, ReactElement, isValidElement } from 'react';

import { Box, SxProps } from '@mui/material';

import PnCard from './PnCard/PnCard';

type Props = {
  /** Custom style */
  sx?: SxProps;
  /** Cards test id */
  testId?: string;
  children: ReactElement | Array<ReactElement>;
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

const PnCardsList: React.FC<Props> = ({ sx, testId, children }) => {
  // check on children
  // PnCardsList can have only children of type PnCard
  // the cast ReactElement | Array<ReactElement> of property children ensures that the PnCardsList can have two defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnCard) {
      throw new Error('PnCardsList must have only children of type PnCard');
    }
  });

  return (
    <Box sx={{ ...cardStyle, ...sx }} data-testid={testId}>
      {children}
    </Box>
  );
};

export default PnCardsList;
