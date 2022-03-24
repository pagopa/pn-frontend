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

import { CardElem, CardAction } from '../../types/NotificationsCard';
import { Row } from '../../types/NotificationsTable';

type Props = {
  /*Card header elements*/
  cardHeader: [CardElem, CardElem];
  /*Card body elements*/
  cardBody: Array<CardElem>;
  /* Card data*/
  cardData: Array<Row>;
  /* Card actions*/
  cardActions?: Array<CardAction>;
};

const NotificationsCard = ({ cardHeader, cardBody, cardData, cardActions }: Props) => {
  const cardHeaderTitle = (elem: Row) => (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item xs={4} sx={{ fontSize: '14px', fontWeight: 400 }} data-testid="cardHeaderLeft">
        {cardHeader[0].getLabel(elem[cardHeader[0].id])}
      </Grid>
      <Grid
        item
        xs={8}
        sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right' }}
        data-testid="cardHeaderRight"
      >
        {cardHeader[1].getLabel(elem[cardHeader[1].id])}
      </Grid>
    </Grid>
  );

  const theme = useTheme();

  return (
    <Box>
      {cardData.length ? (
        cardData.map((d) => (
          <Card
            key={d.id}
            sx={{
              marginBottom: '16px',
              padding: '24px',
              borderRadius: '8px',
              boxShadow:
                '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            }}
            data-testid="notificationCard"
          >
            <CardHeader title={cardHeaderTitle(d)} sx={{ padding: 0 }} />
            <CardContent sx={{ padding: 0, marginTop: '16px', ':last-child': { padding: 0 } }}>
              {cardBody.map((b) => (
                <Box key={b.id} sx={{ marginBottom: '16px' }}>
                  <Typography sx={{ fontWeight: 600 }} data-testid="cardBodyLabel">
                    {b.label}
                  </Typography>
                  <Typography data-testid="cardBodyValue">{b.getLabel(d[b.id])}</Typography>
                </Box>
              ))}
            </CardContent>
            <CardActions disableSpacing>
              {cardActions &&
                cardActions.map((a) => (
                  <Box key={a.id} onClick={() => a.onClick(d)} data-testid="cardAction" sx={{marginLeft: 'auto'}}>
                    {a.component}
                  </Box>
                ))}
            </CardActions>
          </Card>
        ))
      ) : (
        <Card data-testid="notificationCard" sx={{ padding: '24px' }}>
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
