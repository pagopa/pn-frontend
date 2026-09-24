import { useTranslation } from 'react-i18next';

import { InformalNotificationStatus, StatusTooltip } from '@pagopa-pn/pn-commons';

type Props = {
  status?: InformalNotificationStatus;
};

const PnCommunicationStatusTooltip = ({ status }: Props) => {
  const { t } = useTranslation('campaigns');

  const getStatusInfo = () => {
    switch (status) {
      case InformalNotificationStatus.ACCEPTED:
        return {
          label: t('detail.communications.statuses.ready'),
          color: 'default' as const,
        };

      case InformalNotificationStatus.PROCESSING:
        return {
          label: t('detail.communications.statuses.processing'),
          color: 'info' as const,
        };

      case InformalNotificationStatus.COMPLETED_REACHED:
        return {
          label: t('detail.communications.statuses.success'),
          color: 'success' as const,
        };

      case InformalNotificationStatus.UNDELIVERABLE:
        return {
          label: t('detail.communications.statuses.failed'),
          color: 'error' as const,
        };

      case InformalNotificationStatus.REFUSED:
        return {
          label: t('detail.communications.statuses.refused'),
          color: 'error' as const,
        };

      default:
        return {
          label: '-',
          color: 'default' as const,
        };
    }
  };

  const { label, color } = getStatusInfo();

  return <StatusTooltip label={label} tooltip="" color={color} />;
};

export default PnCommunicationStatusTooltip;
