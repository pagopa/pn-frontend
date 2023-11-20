import { Grid, GridProps } from '@mui/material';

type Props = {
  gridProps?: GridProps;
  children: React.ReactNode;
  position?: string;
};

const PnCardHeaderItem: React.FC<Props> = ({ children, gridProps, position = 'left' }) => (
  <Grid
    item
    sx={{ textAlign: position, fontSize: '14px', fontWeight: 400 }}
    data-testid={position === 'left' ? 'cardHeaderLeft' : 'cardHeaderRight'}
    {...gridProps}
  >
    {children}
  </Grid>
);

export default PnCardHeaderItem;
