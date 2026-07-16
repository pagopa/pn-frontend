import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Typography } from '@mui/material';
import { EmptyState } from '@pagopa-pn/pn-commons';
import { ButtonNaked, IllusMIError, IllusMIMessage } from '@pagopa/mui-italia';

type Props = {
  filtersApplied: boolean;
  hasTimeoutError: boolean;
  onCleanFilters: () => void;
  onApiKeys: () => void;
  onManualSend: () => void;
};

type LinkApiKeyProps = {
  onApiKeys: () => void;
  children?: React.ReactNode;
};

type LinkCreateNotificationProps = {
  onManualSend: () => void;
  children?: React.ReactNode;
};

const CONTENT_CONTAINER_PROPS = {
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
} as const;

const INLINE_LINK_STYLE = {
  font: 'inherit',
  verticalAlign: 'baseline',
};

const FilteredEmptyStateContent: React.FC<{ cleanFilters: () => void }> = ({ cleanFilters }) => {
  const { t } = useTranslation('notifiche');

  return (
    <>
      <Typography variant="subtitle2" fontSize="16px" sx={{ color: '#636B82', mb: 1 }}>
        {t('empty-state.filtered')}
      </Typography>
      <Typography variant="body2" fontSize="14px" color="text.secondary" sx={{ mb: 2 }}>
        {t('empty-state.filtered-description')}
      </Typography>

      <ButtonNaked
        size="medium"
        color="primary"
        id="call-to-action-first"
        data-testid="link-remove-filters"
        onClick={cleanFilters}
      >
        {t('empty-state.clean-filters-cta')}
      </ButtonNaked>
    </>
  );
};

const LinkApiKey: React.FC<LinkApiKeyProps> = ({ children, onApiKeys }) => (
  <Link
    component="button"
    id="call-to-action-first"
    data-testid="link-api-keys"
    onClick={onApiKeys}
    sx={INLINE_LINK_STYLE}
  >
    {children}
  </Link>
);

const LinkCreateNotification: React.FC<LinkCreateNotificationProps> = ({
  children,
  onManualSend,
}) => (
  <Link
    component="button"
    id="call-to-action-second"
    data-testid="link-create-notification"
    onClick={onManualSend}
    sx={INLINE_LINK_STYLE}
  >
    {children}
  </Link>
);

const DefaultEmptyStateContent: React.FC<{
  onApiKeys: () => void;
  onManualSend: () => void;
}> = ({ onApiKeys, onManualSend }) => (
  <Typography variant="subtitle2" fontSize="16px" sx={{ color: '#636B82' }}>
    <Trans
      ns="notifiche"
      i18nKey="empty-state.no-notifications"
      components={[
        <LinkApiKey key="api-keys" onApiKeys={onApiKeys} />,
        <LinkCreateNotification key="create-notification" onManualSend={onManualSend} />,
      ]}
    />
  </Typography>
);

const TimeoutEmptyStateContent: React.FC = () => {
  const { t } = useTranslation('notifiche');

  return (
    <Typography variant="subtitle2" fontSize="16px" sx={{ color: '#636B82' }}>
      {t('empty-state.timeout')}
    </Typography>
  );
};

const NotificationsEmptyState: React.FC<Props> = ({
  filtersApplied,
  hasTimeoutError,
  onCleanFilters,
  onApiKeys,
  onManualSend,
}) => {
  if (filtersApplied) {
    return (
      <EmptyState
        slots={{ contentContainer: Box }}
        slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
        sentimentIcon={<IllusMIError size={56} />}
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
      {hasTimeoutError ? (
        <TimeoutEmptyStateContent />
      ) : (
        <DefaultEmptyStateContent onApiKeys={onApiKeys} onManualSend={onManualSend} />
      )}
    </EmptyState>
  );
};

export default NotificationsEmptyState;
