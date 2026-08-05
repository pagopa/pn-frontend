import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { EmptyState } from '@pagopa-pn/pn-commons';
import { IllusMIInbox, IllusMIMessage, MIButton } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';

type Props = {
  filtersApplied: boolean;
  filterNotificationsRef: React.MutableRefObject<{
    cleanFilters: () => void;
  }>;
  isDelegatedPage: boolean;
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
      <Typography variant="subtitle2" fontSize="16px" sx={{ color: '#636B82' }}>
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

const DefaultEmptyStateContent: React.FC = () => {
  const { t } = useTranslation('notifiche');

  const navigate = useNavigate();
  const goToContactsPage = () => {
    navigate(routes.RECAPITI);
  };

  return (
    <>
      <Typography variant="subtitle2" fontSize="16px" sx={{ color: '#636B82' }}>
        {t('empty-state.title')}
      </Typography>
      <Typography variant="body2" fontSize="14px" color="text.secondary" sx={{ mb: 2 }}>
        {t('empty-state.description')}
      </Typography>

      <MIButton
        variant="text"
        id="call-to-action-first"
        data-testid="link-route-contacts"
        onClick={goToContactsPage}
      >
        {t('empty-state.go-to-contacts-cta')}
      </MIButton>
    </>
  );
};

const NotificationsEmptyState: React.FC<Props> = ({
  filtersApplied,
  filterNotificationsRef,
  isDelegatedPage,
}) => {
  const { t } = useTranslation('notifiche');

  if (filtersApplied) {
    return (
      <EmptyState
        slots={{ contentContainer: Box }}
        slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
        sentimentIcon={<IllusMIInbox size={56} />}
      >
        <FilteredEmptyStateContent cleanFilters={filterNotificationsRef.current.cleanFilters} />
      </EmptyState>
    );
  }

  return (
    <EmptyState
      slots={{ contentContainer: Box }}
      slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
      sentimentIcon={<IllusMIMessage size={56} />}
    >
      {isDelegatedPage ? (
        <Typography fontSize="16px" fontWeight="500" color="text.secondary">
          {t('empty-state.delegate')}
        </Typography>
      ) : (
        <DefaultEmptyStateContent />
      )}
    </EmptyState>
  );
};

export default NotificationsEmptyState;
