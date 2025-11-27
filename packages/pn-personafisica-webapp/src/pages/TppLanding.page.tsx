import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { AppRouteParams, IllusLandingTpp } from '@pagopa-pn/pn-commons';

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { PFEventsType } from '../models/PFEventsType';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const TppLanding: React.FC = () => {
  const { t } = useTranslation('notifiche', { keyPrefix: 'tppLanding' });
  const rapidAccessParam = useRapidAccessParam() || [];
  const [param, value] = rapidAccessParam;
  const navigate = useNavigate();

  const whatIsSendFaqTitle = t('faq.what-is-send.question');
  const whatAreNotificationsFaqTitle = t('faq.what-are-notifications.question');

  const handleClickAccessButton = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_LANDING_PAGE_CLICK_ACCESS);
    navigate(`/?${AppRouteParams.RETRIEVAL_ID}=${value}`, { replace: true });
  };

  const onAccordionClick = (expanded: boolean, faqTitle: string) => {
    if (expanded) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_LANDING_PAGE_FAQ_OPEN, {
        faq_name: faqTitle,
      });
    }
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_LANDING_PAGE);
  }, []);

  if (!param || !value || param !== AppRouteParams.RETRIEVAL_ID) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{ py: { md: 4 } }}
      data-testid="tppLandingContainer"
    >
      <Stack direction="column">
        <Paper sx={{ backgroundColor: { xs: 'background.paper', md: 'transparent' } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
            <IllusLandingTpp
              sx={{
                width: { xs: '100%', md: '50%' },
                height: { xs: '100%', md: '350px' },
              }}
              data-testid="tppLandingIllustration"
            />

            <Stack direction="column" padding={3} spacing={3} sx={{ flex: { md: 1 } }}>
              <Typography
                variant="h5"
                fontWeight={700}
                data-testid="tppLandingTitle"
                whiteSpace="pre-line"
              >
                {t('title')}
              </Typography>

              <Typography data-testid="tppLandingDescription" whiteSpace="pre-line">
                <Trans t={t} i18nKey="description" />
              </Typography>

              <Button
                variant="contained"
                onClick={handleClickAccessButton}
                sx={{ maxWidth: { md: '300px' } }}
                data-testid="accessButton"
              >
                {t('access-button')}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack
          direction="column"
          padding={3}
          sx={{ maxWidth: { md: '900px' }, mx: { md: 'auto' }, width: { md: '100%' } }}
          data-testid="faqSection"
        >
          <Typography variant="h6" fontWeight={700} mb={2} data-testid="faqTitle">
            {t('faq.title')}
          </Typography>

          <Accordion
            sx={{ borderRadius: '4px' }}
            onChange={(_, expanded) => onAccordionClick(expanded, whatAreNotificationsFaqTitle)}
            data-testid="notificationsAccordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              data-testid="notificationsAccordionSummary"
              aria-controls="notifications-content"
              id="notifications-header"
            >
              <Typography fontWeight={600} fontSize="16px" component="span">
                {whatAreNotificationsFaqTitle}
              </Typography>
            </AccordionSummary>
            <AccordionDetails data-testid="notificationsAccordionDetails">
              <Typography component="span">{t('faq.what-are-notifications.answer')}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              mt: 2,
              borderRadius: '4px',
              '&:before': {
                display: 'none',
              },
            }}
            onChange={(_, expanded) => onAccordionClick(expanded, whatIsSendFaqTitle)}
            data-testid="sendAccordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              data-testid="sendAccordionSummary"
              aria-controls="send-content"
              id="send-header"
            >
              <Typography fontWeight={600} fontSize="16px" component="span">
                {whatIsSendFaqTitle}
              </Typography>
            </AccordionSummary>
            <AccordionDetails data-testid="sendAccordionDetails">
              <Typography component="span" whiteSpace="pre-line">
                {t('faq.what-is-send.answer')}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TppLanding;
