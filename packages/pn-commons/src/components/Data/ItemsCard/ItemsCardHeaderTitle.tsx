import { Grid, GridProps } from '@mui/material';

export interface IItemsCardHeaderTitleProps {
  gridProps?: GridProps;
  children?: React.ReactNode;
  position?: string;
}

const ItemsCardHeaderTitle: React.FC<IItemsCardHeaderTitleProps> = ({
  children,
  gridProps,
  position = 'left',
}) => (
  <Grid
    item
    sx={{ textAlign: position, fontSize: '14px', fontWeight: 400 }}
    data-testid={position === 'left' ? 'cardHeaderLeft' : 'cardHeaderRight'}
    {...gridProps}
  >
    {children}
  </Grid>
);

export default ItemsCardHeaderTitle;
