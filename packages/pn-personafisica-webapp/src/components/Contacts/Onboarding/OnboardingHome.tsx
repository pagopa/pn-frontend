import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ConfirmationModal, EventAction, useIsMobile } from '@pagopa-pn/pn-commons';
import {
  IllusMIAward,
  IllusMIBell,
  IllusMIMessage,
  IllusMISmartphoneValidation,
} from '@pagopa/mui-italia';

import { OnboardingAvailableFlows } from '../../../models/Onboarding';
import { PFEventsType } from '../../../models/PFEventsType';
import * as routes from '../../../navigation/routes.const';
import { contactsSelectors } from '../../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  setHasSkippedOnboarding,
  setOnboardingHasBeenShown,
  setOnboardingSelectedFlow,
} from '../../../redux/sidemenu/reducers';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { hasCourtesyContacts } from '../../../utility/contacts.utility';

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
  hide?: boolean;
  mixpanelFlowId: OnboardingAvailableFlows;
}>;

const PaperContent = ({ items }: { items: Array<Item> }) => (
  <List disablePadding sx={{ display: 'flex', flexDirection: 'column' }}>
    {items.map((item, index) => (
      <ListItem key={index} disableGutters>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mt: 0.25,
            color: '#BBC2D6',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          disableTypography
          sx={{ m: 0, ml: 1, fontWeight: 400, fontSize: '0.875rem', color: '#555C70' }}
        />{' '}
      </ListItem>
    ))}
  </List>
);

const OnboardingHome: React.FC = () => {
  const { courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const hasIoEnabled = hasCourtesyContacts(courtesyAddresses);
  const { t } = useTranslation('recapiti');

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = React.useState(false);

  const items: Record<ElementCategory, Array<Item>> = {
    send: [
      {
        icon: <CheckRoundedIcon />,
        text: t('onboarding.cards.send.item_1'),
      },
      {
        icon: <CheckRoundedIcon />,
        text: t('onboarding.cards.send.item_2'),
      },
    ],
    contacts: [
      {
        icon: <CheckRoundedIcon />,
        text: t('onboarding.cards.contacts.item_1'),
      },
      {
        icon: <ErrorOutlineOutlinedIcon />,
        text: t('onboarding.cards.contacts.item_2'),
      },
    ],
    io: [
      {
        icon: <CheckRoundedIcon />,
        text: t('onboarding.cards.io.item_1'),
      },
      {
        icon: <ErrorOutlineOutlinedIcon />,
        text: t('onboarding.cards.io.item_2'),
      },
    ],
  };

  const cardsData: CardConfig = [
    {
      illustration: <IllusMIAward size={32} aria-hidden="true" />,
      title: t('onboarding.cards.send.title'),
      description: <PaperContent items={items.send} />,
      cta: t('onboarding.cards.send.cta'),
      path: routes.ONBOARDING_DIGITAL_DOMICILE,
      chip: { label: t('onboarding.cards.send.label'), color: 'info' },
      mixpanelFlowId: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    },
    {
      illustration: <IllusMIMessage size={32} aria-hidden="true" />,

      title: t('onboarding.cards.contacts.title'),
      description: <PaperContent items={items.contacts} />,
      cta: t('onboarding.cards.contacts.cta'),
      path: routes.ONBOARDING_COURTESY,
      mixpanelFlowId: OnboardingAvailableFlows.COURTESY,
    },
    {
      illustration: <IllusMISmartphoneValidation size={32} aria-hidden="true" />,
      title: t('onboarding.cards.io.title'),
      description: <PaperContent items={items.io} />,
      cta: t('onboarding.cards.io.cta'),
      path: routes.ONBOARDING_IO,
      hide: hasIoEnabled,
      mixpanelFlowId: OnboardingAvailableFlows.IO,
    },
  ];

  const borderStyle = {
    border: '3px solid transparent',
    background: `linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #0B3EE3 0%, #DBF9FA 27%, #99A3C1 50%, #B5C6FF 72%, #0B3EE3 95%) border-box`,
  };

  const redirectToNotifications = () => {
    dispatch(setHasSkippedOnboarding(true));
    navigate(routes.NOTIFICHE);
  };

  const handleSelectFlow = (path: string, selectedFlow: OnboardingAvailableFlows) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_FLOW_SELECTED, {
      onboarding_selected_flow: selectedFlow,
    });
    dispatch(setOnboardingSelectedFlow(selectedFlow));
    navigate(path);
  };

  const handleExitFlow = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_DECLINED, {
      event_type: EventAction.EXIT,
    });

    setOpenModal(true);
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ONBOARDING_START_FLOW, {
      event_type: EventAction.SCREEN_VIEW,
    });

    dispatch(setOnboardingHasBeenShown(true));
  }, []);

  return (
    <>
      <Typography component="h1" variant="h4">
        {t('onboarding.title')}
      </Typography>
      <Typography component="p" variant="body1">
        {t('onboarding.description')}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3}>
        {cardsData
          .filter((card) => !card.hide)
          .map((card, index) => {
            const isFirst = index === 0;
            return (
              <Box key={`card-${index}`} sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    padding: isMobile ? 2 : 3,
                    borderRadius: 2,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    ...(isFirst && borderStyle),
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <Box>{card.illustration}</Box>
                    <Box>
                      <Typography
                        component="h2"
                        variant="body1"
                        sx={{ fontWeight: '600' }}
                        fontWeight="bold"
                        mb={1}
                      >
                        {card.title}
                      </Typography>

                      {card.chip && (
                        <Chip label={card.chip.label} color={card.chip.color} size="small" />
                      )}
                    </Box>
                  </Stack>

                  <Box my={1}>{card.description}</Box>

                  <Button
                    fullWidth
                    onClick={() => handleSelectFlow(card.path, card.mixpanelFlowId)}
                    endIcon={<ArrowForwardRoundedIcon />}
                    variant="text"
                    sx={{ padding: 0, textAlign: 'left', justifyContent: 'flex-start' }}
                    size={isMobile ? 'large' : 'medium'}
                  >
                    {card.cta}
                  </Button>
                </Paper>
              </Box>
            );
          })}
      </Stack>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="text" onClick={handleExitFlow}>
          {t('onboarding.exit-flow')}
        </Button>
      </Box>
      <ConfirmationModal
        open={openModal}
        contentAlign="center"
        slots={{
          illustration: <IllusMIBell size={48} />,
          closeButton: Button,
        }}
        title={t('onboarding.exit-flow-dialog.title')}
        slotsProps={{
          actions: {
            sx: {
              flexDirection: 'column',
              justifyContent: 'flex-start',
            },
          },
          closeButton: {
            children: t('onboarding.exit-flow-dialog.cancel'),
            variant: 'contained',
            fullWidth: true,
            onClick: () => setOpenModal(false),
          },
          confirmButton: {
            children: t('onboarding.exit-flow'),
            variant: 'text',
            fullWidth: true,
            onClick: redirectToNotifications,
            sx: { marginBottom: 0 },
          },
        }}
      >
        <Typography variant="body2">{t('onboarding.exit-flow-dialog.description')}</Typography>
      </ConfirmationModal>
    </>
  );
};

export default OnboardingHome;
