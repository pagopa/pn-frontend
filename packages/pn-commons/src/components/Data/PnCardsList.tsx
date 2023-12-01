import { Box, SxProps } from '@mui/material';

import checkChildren from '../../utility/children.utility';
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

const PnCardsList: React.FC<Props> = ({ sx, testId, children }) => {
  // check on children
  checkChildren(children, [{ cmp: PnCard }], 'PnCardsList');

  return (
    <Box sx={{ ...cardStyle, ...sx }} data-testid={testId}>
      {children}
    </Box>
  );
};

export default PnCardsList;
