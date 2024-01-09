import { CardHeader, Grid, GridProps } from '@mui/material';

import checkChildren from '../../../utility/children.utility';
import PnCardHeaderItem from './PnCardHeaderItem';

type Props = {
  testId?: string;
  headerGridProps?: GridProps;
  children: React.ReactNode;
};

const PnCardHeader: React.FC<Props> = ({ testId, children, headerGridProps }) => {
  // check on children
  checkChildren(children, [{ cmp: PnCardHeaderItem }], 'PnCardHeader');

  return (
    <CardHeader
      data-testid={testId}
      className={'card-header'}
      title={
        <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
          {children}
        </Grid>
      }
    />
  );
};

export default PnCardHeader;
