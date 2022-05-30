import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BreadcrumbLink, TitleBox, Prompt, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { createNewNotification, resetNewNotificationState } from '../redux/newNotification/actions';
import * as routes from '../navigation/routes.const';
import PreliminaryInformations from './components/NewNotification/PreliminaryInformations';
import Recipient from './components/NewNotification/Recipient';
import Attachments from './components/NewNotification/Attachments';
import PaymentMethods from './components/NewNotification/PaymentMethods';
import SyncFeedback from './components/NewNotification/SyncFeedback';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const subTitle = (
  <Fragment>
    Per inviare una notifica, inserisci i dati richiesti e aggiungi i modelli di pagamento. Se devi
    fare un invio massivo, puoi usare le <Link to={routes.API_KEYS}>Chiavi API</Link>.
  </Fragment>
);

const steps = ['Informazioni preliminari', 'Destinatario', 'Allegati', 'Metodi di pagamento'];

const NewNotification = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const notification = useAppSelector(
    (state: RootState) => state.newNotificationState.notification
  );
  const mustBeSaved = useAppSelector(
    (state: RootState) => state.newNotificationState.mustBeSaved
  );
  const dispatch = useAppDispatch();

  const goToNextStep = () => {
    setActiveStep((previousStep) => previousStep + 1);
  };

  useEffect(() => {
    // if it is last step, save notification
    if (activeStep === 3 && mustBeSaved) {
      dispatch(createNewNotification(notification))
        .unwrap()
        .then(() => setActiveStep((previousStep) => previousStep + 1))
        .catch(() => {});
    }
  }, [mustBeSaved]);

  useEffect(() => () => void dispatch(resetNewNotificationState()), []);

  if (activeStep === 4) {
    return <SyncFeedback />;
  }

  return (
    <Prompt title="Vuoi davvero uscire?" message="Se esci, i dati inseriti andranno persi.">
      <Grid container className={classes.root} sx={{ padding: isMobile ? '0 20px' : 0 }}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={1} sx={{ marginTop: '10px' }}>
            <Grid item>
              <ButtonNaked
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Indietro
              </ButtonNaked>
            </Grid>
            <Grid item>
              <Breadcrumbs aria-label="breadcrumb">
                <BreadcrumbLink to={routes.DASHBOARD}>Notifiche</BreadcrumbLink>
                <Typography
                  color="text.primary"
                  fontWeight={600}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  Nuova notifica
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <TitleBox
            variantTitle="h4"
            title="Invia una nuova notifica"
            sx={{ pt: '20px' }}
            subTitle={subTitle}
            variantSubTitle="body1"
          ></TitleBox>
          <Typography sx={{ marginTop: '10px' }} variant="body2">
            * Campi obbligatori
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ marginTop: '60px' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <PreliminaryInformations notification={notification} onConfirm={goToNextStep} />
          )}
          {activeStep === 1 && <Recipient onConfirm={goToNextStep} />}
          {activeStep === 2 && <Attachments onConfirm={goToNextStep} />}
          {activeStep === 3 && <PaymentMethods notification={notification}/>}
        </Grid>
      </Grid>
    </Prompt>
  );
};

export default NewNotification;
