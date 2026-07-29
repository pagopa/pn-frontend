import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Link, Typography } from '@mui/material';
import { EmptyState } from '@pagopa-pn/pn-commons';
import { IllusMIError, IllusMIMessage, MIButton } from '@pagopa/mui-italia';

type Props = {
  filtersApplied: boolean;
  hasTimeoutError: boolean;
  onCleanFilters: () => void;
  onApiKeys: () => void;
  onManualSend: () => void;
  onRetry: () => void;
};

type NotificationsEmptyStateViewProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
};

type NotificationsGenericErrorStateProps = {
  onRetry: () => void;
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

const NotificationsEmptyStateView: React.FC<NotificationsEmptyStateViewProps> = ({
  title,
  description,
  action,
  illustration = <IllusMIError size={56} />,
}) => (
  <EmptyState
    slots={{ contentContainer: Box }}
    slotProps={{ contentContainer: CONTENT_CONTAINER_PROPS }}
    sentimentIcon={illustration}
  >
    <Typography
      variant="subtitle2"
      fontSize="16px"
      sx={{
        color: '#636B82',
        mb: description ? 1 : action ? 2 : 0,
      }}
    >
      {title}
    </Typography>

    {description && (
      <Typography
        variant="body2"
        fontSize="14px"
        color="text.secondary"
        sx={{ mb: action ? 2 : 0 }}
      >
        {description}
      </Typography>
    )}

    {action}
  </EmptyState>
);

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

export const NotificationsGenericErrorState: React.FC<NotificationsGenericErrorStateProps> = ({
  onRetry,
}) => {
  const { t } = useTranslation('notifiche');

  return (
    <NotificationsEmptyStateView
      title={t('empty-state.generic-error')}
      action={
        <MIButton
          variant="text"
          size="medium"
          color="primary"
          id="call-to-action-first"
          data-testid="link-retry"
          onClick={onRetry}
        >
          {t('empty-state.generic-error-cta')}
        </MIButton>
      }
    />
  );
};

const NotificationsEmptyState: React.FC<Props> = ({
  filtersApplied,
  hasTimeoutError,
  onCleanFilters,
  onApiKeys,
  onManualSend,
  onRetry,
}) => {
  const { t } = useTranslation(['notifiche', 'common']);
  if (hasTimeoutError) {
    return (
      <NotificationsEmptyStateView
        title={t('notifiche:empty-state.timeout')}
        action={
          <MIButton
            variant="text"
            size="medium"
            color="primary"
            id="call-to-action-first"
            data-testid="link-retry"
            onClick={onRetry}
          >
            {t('common:messages.generic-api-error-action-text')}
          </MIButton>
        }
      />
    );
  }

  if (filtersApplied) {
    return (
      <NotificationsEmptyStateView
        title={t('notifiche:empty-state.filtered')}
        description={t('notifiche:empty-state.filtered-description')}
        action={
          <MIButton
            variant="text"
            size="medium"
            color="primary"
            id="call-to-action-first"
            data-testid="link-remove-filters"
            onClick={onCleanFilters}
          >
            {t('notifiche:empty-state.clean-filters-cta')}
          </MIButton>
        }
      />
    );
  }

  return (
    <NotificationsEmptyStateView
      illustration={<IllusMIMessage size={56} />}
      title={
        <Trans
          ns="notifiche"
          i18nKey="empty-state.no-notifications"
          components={[
            <LinkApiKey key="api-keys" onApiKeys={onApiKeys} />,
            <LinkCreateNotification key="create-notification" onManualSend={onManualSend} />,
          ]}
        />
      }
    />
  );
};

export default NotificationsEmptyState;
