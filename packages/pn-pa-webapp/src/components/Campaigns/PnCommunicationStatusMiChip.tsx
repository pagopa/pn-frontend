import { useTranslation } from 'react-i18next';

import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';
import { MIChip } from '@pagopa/mui-italia';

type Props = {
  status?: InformalNotificationStatus;
};

const PnCommunicationStatusMIChip = ({ status }: Props) => {
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
      case InformalNotificationStatus.COMPLETED_UNREACHED:
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

  return <MIChip label={label} color={color} />;
};

export default PnCommunicationStatusMIChip;
