import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  Skeleton,
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
        <ListItemText
          primary={item.text}
          disableTypography
          sx={{ m: 0, fontWeight: 400, fontSize: '0.875rem', color: '#555C70' }}
        />{' '}
      </ListItem>
    ))}
  </List>
);

const OnboardingSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    // aria-live e aria-busy avvisano lo screen reader che stiamo caricando
    // 1. Manteniamo il contenitore esterno identico all'originale
    <Box display="flex" justifyContent="center" aria-live="polite" aria-busy="true">
      {/* Testo invisibile per l'accessibilità (Screen Reader) */}
      <Typography
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
        }}
      >
        Caricamento in corso
      </Typography>

      <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
        <Skeleton variant="text" width={250} height={50} />
        <Skeleton variant="text" width={180} height={24} sx={{ mb: 1 }} />

        <Grid container spacing={2} wrap={isMobile ? 'wrap' : 'nowrap'} mt={1}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={4} key={`skeleton-card-${index}`}>
              <Paper elevation={0} sx={{ padding: 3, borderRadius: 1 }}>
                <Box mb={2}>
                  <Skeleton variant="circular" width={48} height={48} />
                </Box>
                <Skeleton variant="text" width="85%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 1.5 }} />
                <Box my={1.5}>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
                <Skeleton variant="text" width="60%" height={isMobile ? 42 : 36} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const Onboarding: React.FC = () => {
  const { t } = useTranslation('recapiti');

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isRootMode = location.pathname === routes.ONBOARDING;
  const loading = useAppSelector(contactsSelectors.selectLoading);
  const items: Record<ElementCategory, Array<Item>> = useMemo(
    () => ({
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
    }),
    [t]
  );

  if (loading) {
    return <OnboardingSkeleton />;
  }

  const cardsData: CardConfig = [
    {
      illustration: <IllusPaymentCompleted size={48} />,
      title: t('onboarding.cards.send.title'),
      description: <PaperContent items={items.send} />,
      cta: t('onboarding.cards.send.cta'),
      path: routes.ONBOARDING_DIGITAL_DOMICILE,
      chip: { label: t('onboarding.cards.send.label'), color: 'info' },
    },
    {
      illustration: <IllusEmailValidation size={48} />,

      title: t('onboarding.cards.contacts.title'),
      description: <PaperContent items={items.contacts} />,
      cta: t('onboarding.cards.contacts.cta'),
      path: routes.ONBOARDING_COURTESY,
    },
    {
      illustration: <LogoIOApp size={48} color="default" title="Logo dell'app IO" />,
      title: t('onboarding.cards.io.title'),
      description: <PaperContent items={items.io} />,
      cta: t('onboarding.cards.io.cta'),
      path: routes.ONBOARDING_IO,
    },
  ];

  return (
    <LoadingPageWrapper isInitialized={true}>
      {loading ? (
        <OnboardingSkeleton />
      ) : (
        <Box display="flex" justifyContent="center">
          <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
            {isRootMode && (
              <>
                <Typography component="h1" variant="h4">
                  {t('onboarding.title')}
                </Typography>
                <Typography component="p" variant="body1">
                  {t('onboarding.description')}
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
                          sx={{ padding: 0, textAlign: 'left', justifyContent: 'flex-start' }}
                          size={isMobile ? 'large' : 'medium'}
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
      )}
    </LoadingPageWrapper>
  );
};

export default Onboarding;
