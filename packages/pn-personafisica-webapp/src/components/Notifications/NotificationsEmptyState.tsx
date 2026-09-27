import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { EmptyState } from '@pagopa-pn/pn-commons';
import { IllusMIInbox, IllusMIMessage, MIButton } from '@pagopa/mui-italia';

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
  onCleanFilters: () => void;
  currentDelegator?: Delegator;
};

const CONTENT_CONTAINER_PROPS = {
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

const FilteredEmptyStateContent: React.FC<{ cleanFilters: () => void }> = ({ cleanFilters }) => {
  const { t } = useTranslation('notifiche');

  return (
    <>
      <Typography variant="subtitle2" fontSize="16px" sx={{ color: 'text.secondary' }}>
        {t('empty-state.filtered')}
      </Typography>
      <Typography variant="body2" fontSize="14px" color="text.secondary" sx={{ mb: 2 }}>
        {t('empty-state.filtered-description')}
      </Typography>

      <MIButton
        variant="text"
        id="call-to-action-first"
        data-testid="link-remove-filters"
        onClick={cleanFilters}
      >
        {t('empty-state.clean-filters-cta')}
      </MIButton>
    </>
  );
};

const DelegatorEmptyStateContent: React.FC<{ currentDelegator: Delegator }> = ({
  currentDelegator,
}) => (
  <Typography variant="subtitle2" fontSize="16px" sx={{ color: 'text.secondary' }}>
    <Trans
      values={{ name: currentDelegator.delegator?.displayName }}
      ns="notifiche"
      i18nKey="empty-state.delegate"
    />
  </Typography>
);

const DefaultEmptyStateContent: React.FC<{ showOnboardingContent: boolean }> = ({
  showOnboardingContent,
}) => {
  const { t } = useTranslation('notifiche');

  return (
    <>
      <Typography variant="subtitle2" fontSize="16px" sx={{ color: 'text.secondary' }}>
        {t('empty-state.title')}
      </Typography>
      <Typography variant="body2" fontSize="14px" color="text.secondary" sx={{ mb: 2 }}>
        {showOnboardingContent
          ? t('empty-state.description-onboarding')
          : t('empty-state.description')}
      </Typography>
      <EmptyStateCTA showOnboardingContent={showOnboardingContent} />
    </>
  );
};

const EmptyStateCTA: React.FC<{ showOnboardingContent: boolean }> = ({ showOnboardingContent }) => {
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

  if (showOnboardingContent) {
    return (
      <MIButton
        variant="contained"
        key="route-onboarding"
        data-testid="button-route-onboarding"
        onClick={goToOnboardingPage}
        fullWidth={false}
      >
        {t('empty-state.go-to-onboarding-cta')}
      </MIButton>
    );
  }

  return (
    <MIButton
      variant="text"
      id="call-to-action-first"
      data-testid="link-route-contacts"
      onClick={goToContactsPage}
    >
      {t('empty-state.go-to-contacts-cta')}
    </MIButton>
  );
};

const NotificationsEmptyState: React.FC<Props> = ({
  filtersApplied,
  onCleanFilters,
  currentDelegator,
}) => {
  const addresses = useAppSelector(contactsSelectors.selectAddresses);
  const { IS_ONBOARDING_ENABLED } = getConfiguration();
  const hasEnoughContacts = hasRequiredContacts(addresses);

  const showOnboardingContent = IS_ONBOARDING_ENABLED && !hasEnoughContacts;

  if (filtersApplied) {
    return (
      <EmptyState
        slots={{ contentContainer: Box }}
        slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
        sentimentIcon={<IllusMIInbox size={56} />}
      >
        <FilteredEmptyStateContent cleanFilters={onCleanFilters} />
      </EmptyState>
    );
  }

  return (
    <EmptyState
      slots={{ contentContainer: Box }}
      slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
      sentimentIcon={<IllusMIMessage size={56} />}
    >
      {currentDelegator ? (
        <DelegatorEmptyStateContent currentDelegator={currentDelegator} />
      ) : (
        <DefaultEmptyStateContent showOnboardingContent={showOnboardingContent} />
      )}
    </EmptyState>
  );
};

export default NotificationsEmptyState;
