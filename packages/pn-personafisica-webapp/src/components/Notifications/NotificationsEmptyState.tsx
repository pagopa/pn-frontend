import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Link, Typography } from '@mui/material';
import { EmptyState, KnownSentiment } from '@pagopa-pn/pn-commons';
import { IllusMIMessage } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { ContactSource } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { Delegator } from '../../redux/delegation/types';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { hasRequiredContacts } from '../../utility/contacts.utility';

type Props = {
  filtersApplied: boolean;
  filterNotificationsRef: React.MutableRefObject<{
    filtersApplied: boolean;
    cleanFilters: () => void;
  }>;
  currentDelegator?: Delegator;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<LinkRemoveFiltersProps> = ({ children, cleanFilters }) => (
  <Link
    component="button"
    variant="body1"
    id="call-to-action-first"
    key="remove-filters"
    data-testid="link-remove-filters"
    onClick={cleanFilters}
  >
    {children}
  </Link>
);

const EmptyStateCTA: React.FC<{ showOnboardingCta: boolean }> = ({ showOnboardingCta }) => {
  const { t } = useTranslation('notifiche');
  const navigate = useNavigate();
  const goToContactsPage = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, {
      source: ContactSource.HOME_NOTIFICHE,
    });
    navigate(routes.RECAPITI);
  };

  const goToOnboardingPage = () => {
    navigate(routes.ONBOARDING);
  };

  if (showOnboardingCta) {
    return (
      <Button
        variant="contained"
        key="route-onboarding"
        data-testid="button-route-onboarding"
        onClick={goToOnboardingPage}
        fullWidth={false}
      >
        {t('empty-state.go-to-onboarding-cta')}
      </Button>
    );
  }

  return (
    <Link
      component="button"
      variant="body1"
      fontSize="16px"
      fontWeight={600}
      id="call-to-action-first"
      data-testid="link-route-contacts"
      sx={{ textDecoration: 'none' }}
      onClick={goToContactsPage}
    >
      {t('empty-state.go-to-contacts-cta')}
    </Link>
  );
};

const NotificationsEmptyState: React.FC<Props> = ({
  filtersApplied,
  filterNotificationsRef,
  currentDelegator,
}) => {
  const { t } = useTranslation('notifiche');
  const addresses = useAppSelector(contactsSelectors.selectAddresses);
  const { IS_ONBOARDING_ENABLED } = getConfiguration();
  const hasEnoughContacts = hasRequiredContacts(addresses);

  const showOnboardingContent = IS_ONBOARDING_ENABLED && !hasEnoughContacts;

  if (filtersApplied) {
    return (
      <EmptyState sentimentIcon={KnownSentiment.DISSATISFIED}>
        <Trans
          ns="notifiche"
          i18nKey="empty-state.filtered"
          components={[
            <LinkRemoveFilters
              key="remove-filters"
              cleanFilters={filterNotificationsRef.current.cleanFilters}
            />,
          ]}
        />
      </EmptyState>
    );
  }

  if (currentDelegator) {
    return (
      <EmptyState sentimentIcon={KnownSentiment.NONE}>
        <Trans
          values={{ name: currentDelegator.delegator?.displayName }}
          ns="notifiche"
          i18nKey="empty-state.delegate"
        />
      </EmptyState>
    );
  }

  return (
    <EmptyState
      slots={{ contentContainer: Box }}
      slotProps={{
        contentContainer: {
          display: 'flex',
          textAlign: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
      sentimentIcon={<IllusMIMessage size={56} />}
    >
      <Typography variant="subtitle2" fontSize="16px" color="text.primary">
        {t('empty-state.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {showOnboardingContent
          ? t('empty-state.description-onboarding')
          : t('empty-state.description')}
      </Typography>
      <EmptyStateCTA showOnboardingCta={showOnboardingContent} />
    </EmptyState>
  );
};

export default NotificationsEmptyState;
