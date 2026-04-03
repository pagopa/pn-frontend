import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Chip } from '@pagopa/mui-italia';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import * as routes from '../navigation/routes.const';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootMode = location.pathname === routes.ONBOARDING;
  const loading = useAppSelector(contactsSelectors.selectLoading);

  const cardsData = [
    {
      title: 'Domicilio Digitale',
      description: 'Configura e gestisci il tuo domicilio digitale.',
      path: routes.ONBOARDING_DIGITAL_DOMICILE,
      chip: { label: 'Consigliato', color: 'indaco' },
    },
    {
      title: 'Messaggio Cortesia',
      description: 'Imposta i messaggi di cortesia per gli utenti.',
      path: routes.ONBOARDING_COURTESY,
    },
    {
      title: 'Integrazione IO',
      description: "Gestisci i servizi e notifiche tramite l'App IO.",
      path: routes.ONBOARDING_IO,
    },
  ];
  if (loading) {
    return <></>;
  }

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }}>
          {isRootMode && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Seleziona il tipo di Onboarding
              </Typography>

              <Grid container spacing={2}>
                {cardsData.map((card, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardActionArea
                        onClick={() => navigate(card.path)}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          {/* Questo Box allinea orizzontalmente il Titolo e la Chip (se c'è) */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={1}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {card.title}
                            </Typography>

                            {/* INTERRUTTORE 2: Se la card ha una 'chip', allora disegnala! */}
                            {card.chip && (
                              <Chip
                                label={card.chip.label}
                                // Usiamo "as any" per evitare che TypeScript faccia capricci sui nomi dei colori
                                color={card.chip.color as any}
                                size="small"
                              />
                            )}
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {card.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Il nostro "buco nero" dove appaiono i componenti figli (es. Integrazione IO) */}
          <Outlet />
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Onboarding;
