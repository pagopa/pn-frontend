import { SentimentDissatisfied } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';

import { CardElement, CardAction } from '../../types/ItemCard';
import { Item } from '../../types/ItemsTable';

type Props = {
  /* Card header elements*/
  cardHeader: [CardElement, CardElement];
  /* Card body elements*/
  cardBody: Array<CardElement>;
  /* Card data*/
  cardData: Array<Item>;
  /* Card actions*/
  cardActions?: Array<CardAction>;
};

const NotificationsCard = ({ cardHeader, cardBody, cardData, cardActions }: Props) => {
  const cardHeaderTitle = (item: Item) => (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item xs={4} sx={{ fontSize: '14px', fontWeight: 400 }} data-testid="cardHeaderLeft">
        {cardHeader[0].getLabel(item[cardHeader[0].id], item)}
      </Grid>
      <Grid
        item
        xs={7}
        sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right' }}
        data-testid="cardHeaderRight"
      >
        {cardHeader[1].getLabel(item[cardHeader[1].id], item)}
      </Grid>
    </Grid>
  );

  const theme = useTheme();

  return (
    <Box>
      {cardData.length ? (
        cardData.map((data) => (
          <Card
            key={data.id}
            sx={{
              marginBottom: '16px',
              padding: '24px',
              borderRadius: '8px',
              boxShadow:
                '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            }}
            data-testid="itemCard"
          >
            <CardHeader title={cardHeaderTitle(data)} sx={{ padding: 0 }} />
            <CardContent sx={{ padding: 0, marginTop: '16px', ':last-child': { padding: 0 } }}>
              {cardBody.map((body) => (
                <Box key={body.id} sx={{ marginBottom: '16px' }}>
                  <Typography sx={{ fontWeight: 600 }} data-testid="cardBodyLabel">
                    {body.label}
                  </Typography>
                  <Typography data-testid="cardBodyValue">
                    {body.getLabel(data[body.id])}
                  </Typography>
                </Box>
              ))}
            </CardContent>
            <CardActions disableSpacing>
              {cardActions &&
                cardActions.map((action) => (
                  <Box
                    key={action.id}
                    onClick={() => action.onClick(data)}
                    data-testid="cardAction"
                    sx={{ marginLeft: 'auto' }}
                  >
                    {action.component}
                  </Box>
                ))}
            </CardActions>
          </Card>
        ))
      ) : (
        <Card data-testid="itemCard" sx={{ padding: '24px' }}>
          <CardContent sx={{ padding: 0 }}>
            <SentimentDissatisfied sx={{ verticalAlign: 'middle', margin: '0 20px' }} />
            <span>I filtri che hai aggiunto non hanno dato nessun risultato.</span>
            &nbsp;
            <span
              style={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Rimuovi filtri
            </span>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NotificationsCard;
