import { Card } from '@mui/material';

import checkChildren from '../../../utility/children.utility';
import PnCardActions from './PnCardActions';
import PnCardContent from './PnCardContent';
import PnCardHeader from './PnCardHeader';

type Props = {
  testId?: string;
  children: React.ReactNode;
};

const PnCard: React.FC<Props> = ({ testId = 'itemCard', children }) => {
  // check on children
  checkChildren(
    children,
    [
      { cmp: PnCardHeader, maxCount: 1 },
      { cmp: PnCardContent, maxCount: 1, required: true },
      { cmp: PnCardActions, maxCount: 1 },
    ],
    'PnCard'
  );

  return (
    <Card
      raised
      data-testid={testId}
      sx={{
        mb: 2,
        p: 3,
      }}
    >
      {children}
    </Card>
  );
};

export default PnCard;
