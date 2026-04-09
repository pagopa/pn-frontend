import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { IllusAppIO } from '@pagopa-pn/pn-commons';

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
      illustration: <IllusAppIO />,
      title: 'Scelgo il meglio di SEND',
      description:
        'Attivi il domicilio digitale e risparmi i costi di notifica legati alle raccomandate.',
      cta: 'Attiva il meglio di SEND',
      path: routes.ONBOARDING_DIGITAL_DOMICILE,
      chip: { label: 'Consigliato', color: 'info' },
    },
    {
      illustration: <IllusAppIO />,
      title: 'Messaggio Cortesia',
      description: 'Imposta i messaggi di cortesia per gli utenti.',
      cta: 'Attiva il meglio di SEND',
      path: routes.ONBOARDING_COURTESY,
    },
    {
      illustration: <IllusAppIO />,
      title: 'Integrazione IO',
      description: "Gestisci i servizi e notifiche tramite l'App IO.",
      cta: 'Attiva il meglio di SEND',
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
            <>
              <Box sx={{ my: 3 }}>
                <Typography component="h1" variant="h4" mb={1}>
                  Configura SEND
                </Typography>
                <Typography component="p" variant="body1">
                  Ottieni il massimo e risparmi!
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  {cardsData.map((card, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card sx={{ height: '100%' }}>
                        <CardActionArea
                          onClick={() => navigate(card.path)}
                          sx={{ height: '100%', p: 2 }}
                        >
                          <CardContent sx={{ p: 0 }}>
                            <Box mb={1}>
                              {card.illustration}
                              <Typography variant="subtitle1" fontWeight="bold">
                                {card.title}
                              </Typography>

                              {card.chip && (
                                <Chip
                                  label={card.chip.label}
                                  color={
                                    card.chip.color as
                                      | 'default'
                                      | 'primary'
                                      | 'secondary'
                                      | 'error'
                                      | 'info'
                                      | 'success'
                                      | 'warning'
                                  }
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
            </>
          )}

          {/* Il nostro "buco nero" dove appaiono i componenti figli (es. Integrazione IO) */}
          <Outlet />
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Onboarding;
