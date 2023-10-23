import { Grid, GridProps } from '@mui/material';

import { CardElement, Item } from '../../../models';

export interface IItemsCardHeaderTitleProps {
  item: Item;
  headerGridProps?: GridProps;
  cardHeader: [CardElement, CardElement | null];
  children?: React.ReactNode;
}

const ItemsCardHeaderTitle: React.FC<IItemsCardHeaderTitleProps> = ({
  item,
  headerGridProps,
  cardHeader,
}) => (
  <Grid container spacing={2} direction="row" alignItems="center" {...headerGridProps}>
    <Grid
      item
      sx={{ fontSize: '14px', fontWeight: 400 }}
      data-testid="cardHeaderLeft"
      {...cardHeader[0].gridProps}
    >
      {cardHeader[0].getLabel(item[cardHeader[0].id], item)}
    </Grid>
    {cardHeader[1] && (
      <Grid
        item
        sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right' }}
        data-testid="cardHeaderRight"
        {...cardHeader[1].gridProps}
      >
        {cardHeader[1].getLabel(item[cardHeader[1].id], item)}
      </Grid>
    )}
  </Grid>
);

export default ItemsCardHeaderTitle;
