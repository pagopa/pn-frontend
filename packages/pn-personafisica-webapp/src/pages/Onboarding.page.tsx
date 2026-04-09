import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { IllusEmailValidation, IllusPaymentCompleted, LogoIOApp } from '@pagopa/mui-italia';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import * as routes from '../navigation/routes.const';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';

export type ChipColors =
  | 'default'
  | 'indigo'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

type Item = {
  icon: React.ReactNode;
  text: string;
};

type ElementCategory = 'send' | 'contacts' | 'io';

type CardConfig = Array<{
  illustration: React.ReactNode;
  title: string;
  description: React.ReactNode;
  cta: string;
  path: string;
  chip?: { label: string; color: ChipColors };
}>;

const items: Record<ElementCategory, Array<Item>> = {
  send: [
    {
      icon: <CheckRoundedIcon />,
      text: 'Attivi il domicilio digitale e risparmi i costi di notifica legati alle raccomandate.',
    },
    {
      icon: <CheckRoundedIcon />,
      text: 'Ti avvisiamo alla ricezione di una notifica SEND via email e su IO.',
    },
  ],
  contacts: [
    {
      icon: <CheckRoundedIcon />,
      text: 'Ricevi avvisi via email, SMS e sull’app IO, così hai più possibilità di leggere in tempo la comunicazione ed evitare i costi di notifica legati alle raccomandate.',
    },
    {
      icon: <ErrorOutlineOutlinedIcon />,
      text: 'Se non apri la notifica SEND entro 5 giorni dalla ricezione, riceverai comunque una raccomandata con i relativi costi aggiuntivi.',
    },
  ],
  io: [
    {
      icon: <CheckRoundedIcon />,
      text: 'Ricevi avvisi e l’accesso alle comunicazioni a valore legale direttamente attraverso IO.',
    },
    {
      icon: <ErrorOutlineOutlinedIcon />,
      text: 'Se non apri la notifica SEND entro 5 giorni dalla ricezione, riceverai comunque una raccomandata con i relativi costi aggiuntivi.',
    },
  ],
};

const PaperContent = ({ items }: { items: Array<Item> }) => (
  <List disablePadding sx={{ display: 'flex', flexDirection: 'column' }}>
    {items.map((item, index) => (
      <ListItem key={index} disableGutters>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 1,
            mt: 0.25,
            color: '#BBC2D6',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} disableTypography sx={{ m: 0, color: '#555C70' }} />
      </ListItem>
    ))}
  </List>
);

const cardsData: CardConfig = [
  {
    illustration: <IllusPaymentCompleted size={48} />,
    title: 'Scelgo il meglio di SEND',
    description: <PaperContent items={items.send} />,
    cta: 'Attiva il meglio di SEND',
    path: routes.ONBOARDING_DIGITAL_DOMICILE,
    chip: { label: 'Consigliato', color: 'info' },
  },
  {
    illustration: <IllusEmailValidation size={48} />,

    title: 'Voglio solo gli avvisi',
    description: <PaperContent items={items.contacts} />,
    cta: 'Attiva solo gli avvisi',
    path: routes.ONBOARDING_COURTESY,
  },
  {
    illustration: <LogoIOApp size={48} color="default" title="Logo dell'app IO" />,
    title: 'Preferisco attivare solo SEND sull’app IO',
    description: <PaperContent items={items.io} />,
    cta: 'Attiva SEND su IO',
    path: routes.ONBOARDING_IO,
  },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isRootMode = location.pathname === routes.ONBOARDING;
  const loading = useAppSelector(contactsSelectors.selectLoading);

  if (loading) {
    return <></>;
  }

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
          {isRootMode && (
            <>
              <Typography component="h1" variant="h4">
                Configura SEND
              </Typography>
              <Typography component="p" variant="body1">
                Ottieni il massimo e risparmi!
              </Typography>
              <Grid
                container
                spacing={2}
                wrap={isMobile ? 'wrap' : 'nowrap'}
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                }}
                mt={1}
              >
                {cardsData.map((card, index) => (
                  <Grid item component="li" xs={12} sm={4} key={index}>
                    <Paper elevation={0} sx={{ padding: 3, borderRadius: 1 }}>
                      <Box mb={2}>{card.illustration}</Box>
                      <Typography
                        component="h2"
                        variant="subtitle1"
                        fontWeight="bold"
                        mb={1}
                        lineHeight={1.375}
                      >
                        {card.title}
                      </Typography>

                      {card.chip && (
                        <Chip label={card.chip.label} color={card.chip.color} size="small" />
                      )}

                      <Box my={1.5}>{card.description}</Box>

                      <Button
                        fullWidth
                        onClick={() => navigate(card.path)}
                        endIcon={<ArrowForwardRoundedIcon />}
                        variant="text"
                        sx={{ padding: 0, justifyContent: 'flex-start' }}
                      >
                        {card.cta}
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <Outlet />
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Onboarding;
